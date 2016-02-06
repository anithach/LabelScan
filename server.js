
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    configDB = require('./config/app_properties.js');
    async = require('async');
    bcrypt = require('bcrypt-nodejs');
    crypto = require('crypto');

var app = express();

mongoose.connect(configDB.dburl, function(err)
		{
			if(err)
				{
					console.log('Connection Failed');
				}
			else
				{
					console.log('Connected to Database');
				}
		});

app.configure(function() 
		{
			app.set('port', process.env.PORT || 3000);
			app.set('views', __dirname + '/views');
			app.set('view engine', 'jade');
			app.use(express.favicon());
			app.use(express.logger('dev'));
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(flash());
			//app.use(app.router);
			app.use(express.static(path.join(__dirname, 'public')));
			app.use(express.cookieParser());
			app.use(express.session({ secret: 'secretsessionvalue' }));
			app.use(passport.initialize());
			app.use(passport.session());
		});

require('./config/passport')(passport);

// development only
if ('development' === app.get('env')){app.use(express.errorHandler());}

require('./routes/router.js')(app, passport);

http.createServer(app).listen(app.get('port'), function()
		{
		  console.log('Express server listening on port ' + app.get('port'));
		});
