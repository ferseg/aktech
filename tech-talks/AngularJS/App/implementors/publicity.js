/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: publicity.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var publicityModel = app.models['publicity'];
	var tagModel = app.models['tags'];

	/**
	 * Helper method: looks for a media type. If it doesn't exist, throws an error
	 * @param  {String} pHashTag Hashtag to look for
	 * @return {Object} 		 Found media type
	 */
	var spaceExists = function(pHashTag) {
		var query = tagModel.find( 
			{
				'tag':pHashTag
			} 
		);
		return Q(query.exec())
		.then(function(pSpace) {
			if (pSpace.length < 1) {
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_INVALID_HASHTAG);
			}
			return pSpace[0];
		});
	};

	return {
		/**
		 * READ a list of publicity values order by name
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSpacesPublicity: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getPublicity = Q.nbind(publicityModel.find, publicityModel);
				return getPublicity({}, null, {sort:{'mediaType':1}})
				.then(function(pSpacesPublicity) {
					return new Response(pSpacesPublicity, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a space publicity by space and edition
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getPublicityBySpace: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getPublicity = Q.nbind(publicityModel.find, publicityModel);
				return getPublicity({ mediaType: pRequest.params.mediaType, edition: pRequest.params.edition })
				.then(function(pPublicity) {
					return new Response(pPublicity);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a space publicity by space and edition for newspaper
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getPublicityBySpaceWithSize: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getPublicity = Q.nbind(publicityModel.find, publicityModel);
				return getPublicity({ mediaType: pRequest.params.mediaType, edition: pRequest.params.edition, size: pRequest.params.size })
				.then(function(pPublicity) {
					return new Response(pPublicity);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single publicity value
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createSpacesPublicity: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var spacePublicity;
				return spaceExists(pRequest.body.mediaType)
				.then(function(pSpace) {
					spacePublicity = new publicityModel({
						mediaType: pRequest.body.mediaType,
						edition: pRequest.body.edition,
						size: pRequest.body.size,
						currency: pRequest.body.currency,
						value: pRequest.body.value,
						scope: pRequest.body.scope
					});
					return Q.when(spacePublicity.save());
				})
				.then(function() {
					return new Response(spacePublicity);
				})
				.catch(function(pError) {
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single space publicity
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateSpacesPublicity: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var spacesPublicity;
				return spaceExists(pRequest.body.mediaType)
				.then(function(pSpace) {
					var spacesPublicity = {
						mediaType: pRequest.body.mediaType,
						edition: pRequest.body.edition,
						size: pRequest.body.size,
						currency: pRequest.body.currency,
						value: pRequest.body.value,
						scope: pRequest.body.scope
					};
					var updateSpacePublicity = Q.nbind(publicityModel.findByIdAndUpdate, publicityModel);
					return updateSpacePublicity(pRequest.params.id, spacesPublicity);
				})
				.then(function() {
					return new Response(spacesPublicity);
				})
				.catch(function(pError) {
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};
