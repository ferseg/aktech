/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: permissions.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var permissionModel = app.models['permissions'];

	return {
		/**
		 * READ a list of permissions order by name
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getPermissions: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getPermissions = Q.nbind(permissionModel.find, permissionModel);
				return getPermissions({enabled: true}, null, {sort:{'order':1}})
				.then(function(pPermissions) {
					return new Response(pPermissions);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single permission
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createPermission: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var permission;
				permission = new permissionModel({
					name: pRequest.body.name,
					description: pRequest.body.description,
					enabled: pRequest.body.enabled,
					code: pRequest.body.code,
					order: pRequest.body.order
				});
				return Q.when(permission.save())
				.then(function() {
					return new Response(permission);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single permission
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updatePermission: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var permission = {
					name: pRequest.body.name,
					description: pRequest.body.description,
					enabled: pRequest.body.enabled,
					code: pRequest.body.code,
					order: pRequest.body.order
				};
				var updatePermission = Q.nbind(permissionModel.findByIdAndUpdate, permissionModel);
				return updatePermission(pRequest.params.id, permission)
				.then(function() {
					return new Response(permission);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};
