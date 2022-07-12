/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: tagsHash.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var tagsHashModel = app.models['tagsHash'];

	return {
		/**
		 * READ a list of tagsHash
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getTagsHash: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var tagsHash = Q.nbind(tagsHashModel.find, tagsHashModel);
				return tagsHash()
				.then(function(pTagsHash) {
					return new Response(pTagsHash);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single tagHash
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createTagHash: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var tagHash = new tagsHashModel({
					tag: pRequest.body.tag,
					emails: pRequest.body.emails
				});

				return Q.when(tagHash.save())
				.then(function() {
					return new Response(tagHash);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single tagHash
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateTagHash: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return Q.when(tagsHashModel.update({ tag : pRequest.params.tag }, 
					{$set: {emails: pRequest.body.emails}}).exec())
				.then(function(pResult){
					return new Response(pResult);
				})
				.catch(function(pError) {
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		}
	};
};