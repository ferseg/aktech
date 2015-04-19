/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: logs.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var logModel = app.models['logs'];

	return {

		/**
		 * READ a list of logs
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getLogs: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getLogs = Q.nbind(logModel.find, logModel);
				return getLogs()
				.then(function(pLogs) {
					return new Response(pLogs);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single log
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createLog: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var log;
				var currentdatetime = utils.getCurrentDateTime();

				log = new logModel({
					type: pRequest.body.type,
					category: pRequest.body.category,
					description: pRequest.body.description,
					datetime: currentdatetime,
					idHost: pRequest.connection.remoteAddress,
					idUser: pRequest.body.idUser,
					ids: pRequest.body.ids,
					extraInfo: pRequest.body.extraInfo
				});
				return Q.when(log.save())
				.then(function() {
					return new Response(log);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};