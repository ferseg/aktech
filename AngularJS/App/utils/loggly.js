/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: loggly.js
 */

/* Save logs in loggly */

'use strict';

var https = require('https');

/**
 * Logs an error
 * @param  {Object} app    Express app
 * @param  {Object} pError V8 error object
 * @return {none}          Only logs the error, doesn't return anything
 */
exports.logError = function(app, pError) {
	var errorObject = {
		type: 'ERROR',
		message: pError.message,
		name: pError.name,
		stackTrace: pError.stack,
		module: 'Backend',
		environment: app.configuration.getEnvironment()
	};
	logglyCall(errorObject, app.configuration.getSetting('loggly_host'), app.configuration.getSetting('loggly_path'));
};

/**
 * Loggly http request
 * @param  {Object} pErrorObject V8 error object
 * @param  {String} pURL         Loggly URL
 * @return {none}              	 Doesn't return anything
 */
var logglyCall = function(pErrorObject, pHost, pPath) {
	var options = {
		host: pHost,
		path: pPath,
		method: 'POST'
	};
	try {
		var request = https.request(options, function(pError) {
			
		});
		request.write(JSON.stringify(pErrorObject));
		request.end();
	} catch(pException) {
		console.log(pException);
	}
};