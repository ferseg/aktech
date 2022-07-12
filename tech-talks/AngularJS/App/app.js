
/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: app.js
 */

/**
 * Module dependencies.
 */
 
var application_root = __dirname;
var logger = require('./utils/logger');

var express = require('express');
var path = require('path');
var passport = require('passport');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();
var MongoStore = require('connect-mongo')(express);

app.configuration = require('./config');
app.constants = require('./utils/coes-constants.js');

// Config
app.configure(function () {
	
	app.use(express.bodyParser({ uploadDir: 'public/images/' }));
	//app.use(express.bodyParser());
	app.use(express.json());
    app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		store: new MongoStore({
			url: app.configuration.getSetting(app.constants.CONFIG_CONNECTION_STRING)
		}),
		secret: '1234567890QWERTY'
	}));
	app.use(passport.initialize());
    app.use(passport.session());

	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/* Standard requires */
app.loader = require('./initializer');
app.dirname = application_root;
app.bcrypt = require('bcrypt');

/* Initial methods */
app.loader.loadModules(app);
require('./passport')(app, passport);

var rc = require('./utils/response-creator/response-creator')(app);

// Launch server
var server = app.listen(app.configuration.getSetting(app.constants.CONFIG_PORTS));
console.log('Server listening on port '+app.configuration.getSetting(app.constants.CONFIG_PORTS))