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
					usernameField : 'username',
			        passwordField : 'password',
			        passReqToCallback : true
				},
				function(req, username, password, done) 
				{
					var newUser = new User();
					newUser.firstname = req.body.firstname;
					newUser.lastname = req.body.lastname;
					newUser.username = username;
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
			                        	console.log(err);
			                        	throw err;
			                    	}
			                    return done(null, newUser);
			                });
					
				}
				));
	
	passport.use('local-login', new LocalStrategy(
			{
				usernameField : 'username',
		        passwordField : 'password',
		        passReqToCallback : true
			},
			function(req, username, password, done) 
			{
				User.findOne({ 'username' :  username }, function(err, user) 
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