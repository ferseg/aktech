/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: spaces.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var spacesModel = app.models['spaces'];
	var tagModel = app.models['tags'];
	var mediaTypeModel = app.models['media-types'];

	/**
	 * function to save the space in the db
	 * @param  {Object} pSpace - Space object to save in the database
	 * @param  {Object} pTagSpace - Space tag to save in the database
	 * @return {Object} - Promise object
	 */
	var saveSpace = function(pSpace, pTagSpace) {
		return Q.when(pTagSpace.save()
			).then(function(pResult){
				Q.when(pSpace.save());
			},function(pError){
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_DATABASE);
			});
	};

	/**
	 * Helper method: looks for a space. If it doesn't exist, throws an error
	 * @param  {String} pHashTag Hashtag to look for
	 * @return {Object} 		 Found space
	 */
	var spaceExists = function(pHashTag) {
		var query = spacesModel.find( 
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

	/**
	 * Updates the space
	 * @param  {Object} pOldSpace  Old space to update
	 * @param  {Object} pRequest   Express Request object
	 * @return {Object}            Returns a promise that updates the sector
	 */
	var updateASpace = function(pOldSpace, pRequest) {
		var updatedSpace = 
		{
			name: pRequest.body.name,
			country: pRequest.body.country,
			mediaType: pRequest.body.mediaType,
			company: pRequest.body.company,
			isAutomatic: pRequest.body.isAutomatic,
			enabled: pRequest.body.enabled
		};
		return Q(spacesModel.update({ _id : pOldSpace._id }, { $set: updatedSpace }).exec());
	};

	var buildSpace = function(pSpace, pMediaType) {
		return {
			name: pSpace.name,
			country: pSpace.country,
			tag: pSpace.tag,
			mediaType: pMediaType,
			company: pSpace.company,
			isAutomatic: pSpace.isAutomatic,
			enabled: pSpace.enabled
		};
	};

	return {
		
		/**
		 * READ a list of spaces
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSpaces: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSpaces = Q.nbind(spacesModel.find, spacesModel);
				return getSpaces({}, null, {
					sort: {'name':1}
				})
				.then(function(pSpaces) {
					return new Response(pSpaces);
				})
				.catch(function(pError) {
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * Get a list of spaces with the associated media type
		 * @param  {Object} pRequest  Express request object
		 * @param  {Object} pResponse Express response object
		 * @return {Object}           Spaces
		 */
		getSpacesWithMediaTypes: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var findSpaces = Q.nbind(spacesModel.find, spacesModel);
				var findMediaTypeById = Q.nbind(mediaTypeModel.findById, mediaTypeModel);
				var cachedMediaTypes = {};
				var mediaTypeAssigned = 0;
				var spacesToReturn = [];
				return findSpaces()
				.then(function(pSpaces) {
					var deferred = Q.defer();
					pSpaces.forEach(function(pSpace) {
						if (cachedMediaTypes[pSpace.mediaType.toString()] == null) {
							findMediaTypeById(pSpace.mediaType.toString())
							.then(function(pMediaType) {
								cachedMediaTypes[pSpace.mediaType.toString()] = pMediaType;
								spacesToReturn.push(buildSpace(pSpace, pMediaType));
								mediaTypeAssigned++;
								if (mediaTypeAssigned === pSpaces.length) {
									deferred.resolve(new Response(spacesToReturn));
								}
							})
							.catch(function(pError) {
								throw pError;
							});
						} else {
							spacesToReturn.push(buildSpace(pSpace, cachedMediaTypes[pSpace.mediaType.toString()]));
							mediaTypeAssigned++;
							if (mediaTypeAssigned === pSpaces.length) {
								deferred.resolve(new Response(spacesToReturn));
							}
						}
					});
					return deferred.promise;
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single space
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createSpace: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var space = new spacesModel({
					name: pRequest.body.name,
					country: pRequest.body.country,
					tag: pRequest.body.tag,
					mediaType: pRequest.body.mediaType,
					company: pRequest.body.company,
					isAutomatic: pRequest.body.isAutomatic,
					enabled: pRequest.body.enabled
				});

				return utils.isHashTagValid(app, pRequest.body.tag)
				.then(function(result) {
					if (result) {
						var newTagSpace = new tagModel({
							tag: pRequest.body.tag,
							codeCollection: app.constants.SPACES_TAGS
						});
						return saveSpace(space, newTagSpace);
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG);
				}).then(function() {
					return new Response(space);
				}).catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},

		/**
		 * UPDATE a single space
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateSpace: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return spaceExists(pRequest.body.tag)
				.then(function(pSpace) {
					if (pSpace.tag !== pRequest.body.tag) { // The tag can't be updated
						throw utils.createError(app.constants.CODE_ERROR, 
							app.constants.ERROR_UPDATE_TAG);
					}
					return updateASpace(pSpace, pRequest);
				})
				.then(function() {
					return new Response(app.constants.SUCCESS_UPDATE);
				})
				.catch(function(pError) {
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		}
	};
};