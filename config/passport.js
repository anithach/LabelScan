/**
 * http://usejsdoc.org/
 */

var LocalStrategy   = require('passport-local').Strategy;
var User       		= require('../models/user');

module.exports = function(passport) 
{
	passport.serializeUser(function(user, done) 
			{
		        done(null, user.id);
		    });
	
	passport.deserializeUser(function(id, done)
			{
		        User.findById(id, function(err, user) 
		        		{
				            done(err, user);
				        });
		    });
	
	passport.use('local-register', new LocalStrategy(
				{
					usernameField : 'emailaddress',
			        passwordField : 'password',
			        passReqToCallback : true
				},
				function(req, emailaddress, password, done) 
				{
					var newUser = new User();
					newUser.firstname = req.body.firstname;
					newUser.lastname = req.body.lastname;
					newUser.username = emailaddress;
					newUser.password = newUser.generateHash(password);
					newUser.company = req.body.company;
					newUser.emailaddress = req.body.emailaddress;
					newUser.logo = req.body.logo;
					newUser.primaryPhone = req.body.primaryPhone;
					newUser.secondaryPhone = req.body.secondaryPhone;
					newUser.adressLine1 = req.body.adressLine1;
					newUser.adressLine2 = req.body.adressLine2;
					newUser.city = req.body.city;
					newUser.postalCode = req.body.postalCode;
					newUser.country = req.body.country;										
					newUser.save(function(err) 
							{
			                    if (err)
			                    	{
			                    	var message  = '';;
			                    	if (err.code) {
			                            switch (err.code) {
			                                case 11000:
			                                case 11001:
			                                    message = 'This email is already registered, please use a different email address!';
			                                    break;
			                                default:
			                                    message = 'Something went wrong';
			                            }
			                        } else {
			                            for (var errName in err.errors) {
			                                if (err.errors[errName].message) message = err.errors[errName].message;
			                            }
			                        }		                     
		                        	return done(message);
			                    	}
			                    return done(null, newUser);
			                });
					
				}
				));
	
	passport.use('local-login', new LocalStrategy(
			{
				usernameField : 'emailaddress',
		        passwordField : 'password',
		        passReqToCallback : true
			},
			function(req, emailaddress, password, done) 
			{
				User.findOne({ 'username' :  emailaddress }, function(err, user) 
				{
					if (err)
						{
		                	return done(err);
						}
					if (!user)
						{
		                	return done(null, false, req.flash('loginMessage', 'No user found.'));
						}
					if (!user.validPassword(password))
						{
		                	return done(null, false, req.flash('loginMessage', 'Wrong password.'));
						}					
					 return done(null, user);
				});
				
			}));

};