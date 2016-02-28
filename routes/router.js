/**
 * http://usejsdoc.org/
 */
var nodemailer = require('nodemailer');
var User = require('../models/user');
var uuid = require('node-uuid');
module.exports = function(app, passport) 
{
	
	app.get('*', function(req, res, next) {
		  // just use boolean for loggedIn
		  res.locals.loggedIn = (req.user) ? true : false;

		  next();
	});
	
	app.get('/', function(req, res) 
	{
		if(req.user){
			res.render('home.jade', { title: 'Trace IT' });
		}else{
			res.render('login.jade', { title: 'Trace IT' });
		}
	});
	
	app.get('/home', function(req, res) 
			{
				res.render('home.jade');
	});	
	
	app.get('/contact', function(req, res) 
			{
				res.render('contact.jade');
	});	
	
	app.post('/contact', function(req, res) 
	{
		var Contact = require('../models/contact');
		var newContact = new Contact();
		newContact.name = req.body.name;
		newContact.emailaddress = req.body.emailaddress;
		newContact.subject = req.body.subject;
		newContact.message = req.body.message;
		newContact.submit_dt = Date.now();
		newContact.save(function(err) 
				{
                    if (err)
                    	{
                        	console.log(err); 
                        	res.render('contact', { title: 'Error', err: false,msg: 'Please try again!', page: 'contact' }); 
                    	}else{
                    		res.render('contact', { title: 'Thanks', err: false,msg: 'Thanks for contacting us, we will get back to you shortly!', page: 'contact' }); 
                    	}
                });
		 
	});	
	
	app.get('/about', function(req, res) 
			{
				res.render('about.jade');
	});		

	app.get('/login',isUserNotLoggedIn, function(req, res) 
	{
		res.render('login.jade', { title: 'Trace IT' });
	});
	
	app.post('/login', function(req, res, next) {
		  passport.authenticate('local-login', function(err, user, info) {
		    if (err) { return res.render('login',{msg:'Please enter a valid Email Address and Password!'}); }
		    if (!user) { return res.render('login',{msg:'Please enter a valid Email Address and Password!'}); }
		    req.logIn(user, function(err) {
		      if (err) {  return res.render('login',{msg:'Please enter valid Email Address and Password!'});  }
		      if(user.status == 0){
		    	  return res.render('login',{msg:'Please activate your account to login!'});  
		      }
		      return res.redirect('home');
		    });
		  })(req, res, next);
		});
		
	app.post('/createpo', isLoggedIn, function(req, res) {	
		var PO = require('../models/porder');
		var qrocdeUniqId = uuid.v1();
		var newPO = new PO();
		newPO.ponum = req.body.ponum;
		newPO.bqcode = req.body.ponum+Date.now();
		newPO.itemnum = req.body.itemnum;
		newPO.prodcode = req.body.prodcode;
		newPO.fdaregno  = req.body.fdaregno;
		newPO.traceid = req.body.traceid;
		newPO.productwgt = req.body.productwgt;
		newPO.producttype = req.body.producttype;
		newPO.packing = req.body.packing;
		newPO.corigin = req.body.corigin;
		newPO.company = req.body.company;
		newPO.processor = req.body.processor;
		newPO.submit_date = Date.now();
		newPO.proddate = req.body.proddate;	
		newPO.username = req.user.emailaddress;	
		var bqcode = newPO.bqcode;

		newPO.save(function(err) 
				{
                    if (err)
                    	{
                        	console.log(err); 
                        	res.render('createpo', { title: 'error', err: false,msg: 'Error saving PO, please contact Help Desk.'+err, page: 'createpo' }); 
                    	}else{
                    		console.log("bqcode  -  "+newPO.bqcode);
                    		res.render('qrcode', { title: 'QR Code',bqcode:bqcode,user:req.user, err: true, page: 'qrcode' });
                    		//res.render('qrcode', { title: 'QR COde', bqcode:bqcode,err: false, page: 'qrcode' }); 
                    	}
                });
	});
	
		
	
	app.get('/createpo', isLoggedIn, function(req, res) 
			{
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');		
				res.render('createpo.jade', 
						{
							user : req.user
						});
	});	
	
	app.get('/qrcode', isLoggedIn, function(req, res) 
			{
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('qrcode.jade', 
						{
							user : req.user
						});
	});	
	
	app.get('/register', isUserNotLoggedIn,function(req, res) 
	{
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('register.jade', { message: req.flash('registerMessage') });
	});
	
	app.post('/register', function(req, res, next) {
		  passport.authenticate('local-register', function(err, user, info) {
		    if (err) { return res.render('register', { title: 'error', err: false,msg: 'Email address  is invalid.'+err, page: 'register' }); }
		    if (!user) {
		      return res.render('register', { title: 'user not saved', err: false,msg: 'Error occured Please contact Help desk!', page: 'register' });
		    }
		    req.logIn(user, function(err) {
		      if (err) { return res.render('register', { title: 'user not saved', err: false,msg:'Error occured Please contact Help desk!'+ err, page: 'register' }); }
			  async.waterfall([
			       		    function(done) {
			       		      crypto.randomBytes(20, function(err, buf) {
			       		        var token = buf.toString('hex');
			       		        done(err, token);
			       		      });
			       		    },
			       		    function(token, done) {
			       		      User.findOne({ emailaddress: user.emailaddress }, function(err, user) {
			       		        if (!user) {
			       		          req.flash('error', 'No account with that email address exists.');
			       		          return  res.render('home', { title: 'Test email- Contact', msg: 'No account with that'+emailaddress+ 'address exists.'+err, err: true, page: 'home' });
			       		        }

			       		        user.activateToken = token;
			       		        user.activateTokenExpires = Date.now() + 3600000; // 1 hour

			       		        user.save(function(err) {
			       		          done(err, token, user);
			       		        });
			       		      });
			       		    },
			       		    function(token, user, done) {
			       				var mailOpts, smtpTrans;
			       				smtpTrans = nodemailer.createTransport('SMTP', {
			       				      service: 'gmail',
			       				      auth: {
			       				          user: "noreplytraceit@gmail.com",
			       				          pass: "Mailer4comm" 
			       				      }
			       				  });				
			       				  //Mail options
			       				  mailOpts = {
			       				      from: 'noreplytraceit@gmail.com', //grab form data from the request body object
			       				      to: req.body.emailaddress,
			       				      subject: 'Welcome to Label Docs',
			       				        text: 'Welcome to our Label Docs.\n\n' +
			       				          'Please click on the following link, or paste this into your browser to complete your registration with us:\n\n' +
			       				          'http://' + req.headers.host + '/login/' + token + '\n\n'
			       				  };
			       				  smtpTrans.sendMail(mailOpts, function(err) {
			       				      //Email sent
			       				      if (!err) {
			       				    	  res.render('login', { title: 'Test email- Contact', msg: 'An e-mail has been sent to ' + user.emailaddress + ' with further instructions.', err: true, page: 'login' });
			       				      }//Email not sent
			       				      else {
			       				          res.render('register', { title: 'Reste not done', err: false,msg: 'Email address '+user.emailaddress+' is invalid.'+err, page: 'register' });
			       				      }					  					 
			       		      });
			       		    }
			       		  ]);
		    });
		  })(req, res, next);
		});
	
	app.get('/register_done', isLoggedIn, function(req, res) 
			{
		 res.render('login', { title: 'Success', msg: 'Your have been Successfully registered!. Please login to continue', err: true, page: 'home' });
	});
	
	app.get('/register_notdone', isLoggedIn, function(req, res) 
			{
		res.render('register', { title: 'Error has occured, please contact help desk @ 123 123 45678', err: true, page: 'home' });
	});
	
	
	app.get('/login/:token', function(req, res) {
		  async.waterfall([
		    function(done) {
		      User.findOne({ activateToken: req.params.token}, function(err, user) {
		        if (!user) {
		          req.flash('error', 'Password reset token is invalid or has expired.');
		          return res.render('login', { title: 'Test email- Contact', msg: 'Password reset token is invalid or has expired.', err: true, page: 'login' });
		        }

		        user.status = 1;
		        user.activateToken = undefined;
		        user.activateTokenExpires = undefined;

		        user.save(function(err) {
		        	 done(err,user);
		        });
		      });
		    },
		    function(user, done) {
				var mailOpts, smtpTrans;
				smtpTrans = nodemailer.createTransport('SMTP', {
				      service: 'gmail',
				      auth: {
				          user: "noreplytraceit@gmail.com",
				          pass: "Mailer4comm" 
				      }
				  });				
				  //Mail options
				  mailOpts = {
				      from: 'noreplytraceit@gmail.com', //grab form data from the request body object
				      to: user.emailaddress,
				      subject: 'Your Label Docs Account is Activated',
				        text: 'Hello,\n\n' +
				          'This is a confirmation that your account ' + user.emailaddress + ' is sucesfully activated.\n'				  };
				  smtpTrans.sendMail(mailOpts, function(err) {
				      //Email  sent
				      if (!err) {
				    	  res.render('login', { title: 'Success', msg: 'Your account ' + user.emailaddress + ' has been activated Successfully!. Please login to continue', err: true, page: 'home' });
				      }
				      //Email not sent
				      else {
				          res.render('login', { title: 'Reste not done', msg:err, page: 'login' });
				      }					  					 
		      });
		    }
		  ]);
		});	
	
	app.get('/profile',isLoggedIn, function(req,res){
		  res.render('profile.jade', { user : req.user});
		});
	
	app.get('/get/json', function(req, res) 
			{	
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				var PO = require('../models/porder');
				PO.find({username:req.user.emailaddress}, function(err, result) 
						 {
						      if (!err) 
						      {
								  res.setHeader('Content-Type', 'application/result');
								  res.end(JSON.stringify(result));
						    	 // res.render('profile.jade', { user : req.user, podocs: result, poscount: PO.find({}).count()});
						      } 
						      else 
						      {
						    	res.render('profile.jade', { user : req.user, msg: 'Error occured while loading the page.'});
						      }
						 });
				
				//console.log("PO Number " + mypos.ponumber);
			});
	
	app.get('/logout', function(req, res) 
			{
				req.session.destroy();
				req.logout();
				res.redirect('/');
			});
	
	app.get('/forgot', function(req, res) 
			{
				res.render('forgot.jade', { title: 'Trace IT' });
			});	

	
	app.post('/forgot', function(req, res, next) {
		  async.waterfall([
		    function(done) {
		      crypto.randomBytes(20, function(err, buf) {
		        var token = buf.toString('hex');
		        done(err, token);
		      });
		    },
		    function(token, done) {
		      User.findOne({ emailaddress: req.body.emailaddress }, function(err, user) {
		    	if (err) { 
		    		return res.render('forgot',{msg:'Please enter a valid Email Address!'}); 
		    	}
		        if (!user) {
		          req.flash('error', 'No account with that email address exists.');
		          return  res.render('forgot', { title: 'Error', msg: 'No account with '+req.body.emailaddress+ ' exists.', err: true, page: 'forgot' });
		        }

		        user.resetPasswordToken = token;
		        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

		        user.save(function(err) {
		          done(err, token, user);
		        });
		      });
		    },
		    function(token, user, done) {
				var mailOpts, smtpTrans;
				smtpTrans = nodemailer.createTransport('SMTP', {
				      service: 'gmail',
				      auth: {
				          user: "noreplytraceit@gmail.com",
				          pass: "Mailer4comm" 
				      }
				  });				
				  //Mail options
				  mailOpts = {
				      from: 'noreplytraceit@gmail.com', //grab form data from the request body object
				      to: req.body.emailaddress,
				      subject: 'Password Reset',
				        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				  };
				  smtpTrans.sendMail(mailOpts, function(err) {
				      //Email sent
				      if (!err) {
				    	  res.render('login', { title: 'Test email- Contact', msg: 'An e-mail has been sent to ' + user.emailaddress + ' with further instructions.', err: true, page: 'login' });
				      }//Email not sent
				      else {
				          res.render('login', { title: 'Reste not done', err: false,msg: 'No account with that email address '+user.emailaddress+' exists.'+err, page: 'login' });
				      }					  					 
		      });
		    }
		  ]);
		});	
	
	app.get('/reset/:token', function(req, res) {
		  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		    if (!user) {
		      req.flash('error', 'Password reset token is invalid or has expired.');
		      return res.redirect('/forgot');
		    }
		    res.render('reset.jade', {
		      user: req.user
		    });
		  });
		});
	
	app.post('/reset/:token', function(req, res) {
		  async.waterfall([
		    function(done) {
		      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		        if (!user) {
		          req.flash('error', 'Password reset token is invalid or has expired.');
		          return res.render('login', { title: 'Test email- Contact', msg: 'Password reset token is invalid or has expired.', err: true, page: 'login' });
		        }

		        user.password = user.generateHash(req.body.password);
		        user.resetPasswordToken = undefined;
		        user.resetPasswordExpires = undefined;

		        user.save(function(err) {
		        	 done(err,user);
		        });
		      });
		    },
		    function(user, done) {
				var mailOpts, smtpTrans;
				smtpTrans = nodemailer.createTransport('SMTP', {
				      service: 'gmail',
				      auth: {
				          user: "noreplytraceit@gmail.com",
				          pass: "Mailer4comm" 
				      }
				  });				
				  //Mail options
				  mailOpts = {
				      from: 'noreplytraceit@gmail.com', //grab form data from the request body object
				      to: user.emailaddress,
				      subject: 'Your password has been changed',
				        text: 'Hello,\n\n' +
				          'This is a confirmation that the password for your account ' + user.emailaddress + ' has just been changed.\n'				  };
				  smtpTrans.sendMail(mailOpts, function(err) {
				      //Email not sent
				      if (!err) {
				    	  res.render('login', { title: 'Success', msg: 'Your password has been changed Successfully!. Please login to continue', err: true, page: 'home' });
				      }
				      //Yay!! Email sent
				      else {
				          res.render('login', { title: 'Reste not done', err: false, page: 'home' });
				      }					  					 
		      });
		    }
		  ]);
		});	

};

function isLoggedIn(req, res, next) 
{
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

function isUserNotLoggedIn(req, res, next) 
{
	if (!req.isAuthenticated())
		return next();

	res.redirect('/');
}
