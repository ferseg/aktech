/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: response-creator.js
 */

/* Constants */
var ERROR_CODE = 500;
var OK_CODE = 200;
var ERROR_MESSAGE = 'Unknown Error';
var ROUTES_CONFIG_FILE = 'routes-config.json';

/* Requires */
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* Local Variables */
var appDirectory = path.dirname(require.main.filename)+'/';
var implementors = {}; 
var routesConfiguration;
var localApp;

var parseRoutes = function() {
	return Q.nfcall(fs.readFile, appDirectory+ROUTES_CONFIG_FILE, 'utf8');
};

var createRoutes = function(pAuthFunction, pMethod, pRoutes) {
	for (var path in pRoutes) {
		if (!path.noAuth || !pAuthFunction) {
			localApp[pMethod](path, createResponse);
		} else {
			localApp[pMethod](path, pAuthFunction, createResponse);
		}
	}
};

var createHandlers = function(app, pRoutesConfiguration) {
	var authFunction;
	routesConfiguration = JSON.parse(pRoutesConfiguration);
	if (routesConfiguration == null) {
		throw 'Bad Configuration File';
	}
	if (routesConfiguration.authorization) {
		var authorizationFile = require(appDirectory + routesConfiguration.authorization.containerFile);
		authFunction = authorizationFile[routesConfiguration.authorization.method];
	}
	for (var key in routesConfiguration.endpoints) {
		createRoutes(authFunction, key, routesConfiguration.endpoints[key])
	}
};

var createResponse = function(pRequest, pResponse, pNext) {
	var config = routesConfiguration.endpoints[pRequest.route.method][pRequest.route.path];
	if (implementors[config.implementorFile] == null) {
		implementors[config.implementorFile] = require(appDirectory + config.implementorFile)(localApp);
	}
	Q.when(implementors[config.implementorFile][config.method](pRequest, pResponse, pNext))
	.then(function(pResponseObject) {
		var responseCode = pResponseObject.responseCode == null ? OK_CODE : pResponseObject.responseCode;
		return pResponse.send(responseCode, pResponseObject.responseObject);
	})
	.catch(function(pError) {
		console.log(pError.stack)
		return pResponse.send(ERROR_CODE, ERROR_MESSAGE);
	});
};

module.exports = function(app) {
	localApp = app;
	parseRoutes()
	.then(function(pRoutesConfiguration) {
		createHandlers(app, pRoutesConfiguration);
	})
	.catch(function(pError) {
		console.log(pError.stack);
	});
};


