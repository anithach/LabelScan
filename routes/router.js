/**
 * http://usejsdoc.org/
 */
var nodemailer = require('nodemailer');
var User = require('../models/user');
module.exports = function(app, passport) 
{
	app.get('/', function(req, res) 
	{
		res.render('login.jade', { title: 'Intre Label Docs' });
	});
	
	app.get('/login', function(req, res) 
			{
				res.render('login.jade', { title: 'Intre Label Docs' });
			});	
	
	app.get('/home', isLoggedIn, function(req, res) 
			{
				res.render('home.jade', 
						{
							user : req.user
						});
	});	
	
	app.get('/contact', isLoggedIn, function(req, res) 
			{
				res.render('contact.jade', 
						{
							user : req.user
						});
	});	
	
	app.get('/about', isLoggedIn, function(req, res) 
			{
				res.render('about.jade', 
						{
							user : req.user
						});
	});		

	app.get('/login', function(req, res) 
	{
		res.render('login.jade', { title: 'Intre Label Docs' });
	});
	
	app.post('/login', passport.authenticate('local-login', 
	{
		successRedirect : '/home',
		failureRedirect : '/login',
		failureFlash : true
	}));
	
	app.get('/profile', isLoggedIn, function(req, res) 
			{
				res.render('profile.jade', 
						{
							user : req.user
						});
	});		
		
	
	app.post('/createpo', function(req, res) {
		var PO = require('../models/porder');
		var newPO = new PO();
		newPO.ponumber = req.body.ponumber;
		newPO.prodcode = req.body.prodcode;
		newPO.proddate = req.body.proddate;
		newPO.vendor  = req.body.vendor;
		newPO.countryoforigin = req.body.countryoforigin;
		newPO.fdaregno = req.body.fdaregno;
		newPO.tracebilityid = req.body.tracebilityid;
		newPO.producttype = req.body.producttype;
		newPO.productweight = req.body.productweight;
		newPO.itemperpound = req.body.itemperpound;
		
		
		newPO.save(function(err) 
				{
                    if (err)
                    	{
                        	console.log(err);
                        	res.render('home.jade', 
            						{
            							user : req.user
            						});
                    	}else{
                    		res.render('profile.jade', 
            						{
            							user : req.user
            						});
                    	}
                });
	});
	
		
	
	app.get('/createpo', isLoggedIn, function(req, res) 
			{
				res.render('createpo.jade', 
						{
							user : req.user
						});
	});	
	
	app.get('/qrcode', isLoggedIn, function(req, res) 
			{
				res.render('qrcode.jade', 
						{
							user : req.user
						});
	});	
	
	app.get('/register', function(req, res) 
	{
		res.render('register.jade', { message: req.flash('registerMessage') });
	});
	
	app.post('/register', passport.authenticate('local-register', 
			{
				successRedirect : '/register_done',
				failureRedirect : '/register_notdone',
				failureFlash : true
			}));
	
	app.get('/register_done', isLoggedIn, function(req, res) 
			{
		 res.render('login', { title: 'Success', msg: 'Your have been Successfully registered!. Please login to continue', err: true, page: 'home' });
	});
	
	app.get('/register_notdone', isLoggedIn, function(req, res) 
			{
		res.render('login', { title: 'Error has occured, please contact help desk @ 123 123 45678', err: true, page: 'home' });
	});
	
	app.get('/profile', isLoggedIn, function(req, res) 
			{	
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				var PO = require('../models/porder');
				PO.find({}, function(err, result) 
						 {
						      if (!err) 
						      {
						    	  res.render('profile.jade', { user : req.user, podocs: result, poscount: PO.find({}).count()});
						      } 
						      else 
						      {
						    	res.render('profile.jade', { user : req.user, podocs: {error : err}});
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
				res.render('forgot.jade', { title: 'Intre Label Docs' });
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
		        if (!user) {
		          req.flash('error', 'No account with that email address exists.');
		          return  res.render('home', { title: 'Test email- Contact', msg: 'No account with that email address exists.'+err, err: true, page: 'home' });
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
				      service: 'Gmail',
				      auth: {
				          user: "raksapp.user@gmail.com",
				          pass: "raks_pwd" 
				      }
				  });				
				  //Mail options
				  mailOpts = {
				      from: 'raksapp.user@gmail.com', //grab form data from the request body object
				      to: req.body.emailaddress,
				      subject: 'Password Reset',
				        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				  };
				  smtpTrans.sendMail(mailOpts, function(err) {
				      //Email not sent
				      if (!err) {
				    	  res.render('login', { title: 'Test email- Contact', msg: 'An e-mail has been sent to ' + user.emailaddress + ' with further instructions.', err: true, page: 'login' });
				      }
				      //Yay!! Email sent
				      else {
				          res.render('login', { title: 'Reste not done', err: false, page: 'login' });
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
		          return res.redirect('home');
		        }

		        user.password = req.body.password;
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
				      service: 'Gmail',
				      auth: {
				          user: "raksapp.user@gmail.com",
				          pass: "raks_pwd" 
				      }
				  });				
				  //Mail options
				  mailOpts = {
				      from: 'raksapp.user@gmail.com', //grab form data from the request body object
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
