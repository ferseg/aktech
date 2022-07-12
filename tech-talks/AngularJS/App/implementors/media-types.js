/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: media-types.js
 */


var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var mediaModel = app.models['media-types'];
	var tagModel = app.models['tags'];

	/**
	 * Helper method: looks for a media type. If it doesn't exist, throws an error
	 * @param  {String} pHashTag Hashtag to look for
	 * @return {Object} 		 Found media type
	 */
	var mediaTypeExists = function(pHashTag) {
		var query = mediaModel.find( 
			{
				'tag':pHashTag
			} 
		);
		return Q(query.exec())
		.then(function(pSectors) {
			if (pSectors.length < 1) {
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_INVALID_HASHTAG);
			}
			return pSectors[0];
		});
	};

	return {
		/**
		 * Return all the media types
		 */
		getMediaTypes: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var query = Q.nbind(mediaModel.find, mediaModel);
				return query()
				.then(function(pMediaTypes) {
					return new Response(pMediaTypes);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * Return a specific media type indicating its hashtag
		 */
		getMediaTypeByTag: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var query = Q.nbind(mediaModel.find, mediaModel);
				return query({'tag':pRequest.params.tag})
				.then(function(pMediaTypes) {
					return new Response(pMediaTypes);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * Saves a new media type
		 */
		createMediaType: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var newTag = new tagModel({
					tag: pRequest.body.tag,
					codeCollection: app.constants.MEDIATYPES_TAGS
				});
				var newMediaType = new mediaModel({
					tag: pRequest.body.tag,
					name: pRequest.body.name,
					fields: pRequest.body.fields
				});
				return utils.isHashTagValid(app, pRequest.body.tag)
				.then(function(pIsValid) {
					if (pIsValid) {
						return Q.allSettled([Q.when(newMediaType.save()), Q.when(newTag.save())]);
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG);	
				})
				.then(function(pResult) {
					return new Response(newMediaType);
				})
				.catch(function(pError) {
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(app, pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},

		/**
		 * Updates a media type
		 */
		updateMediaType: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return mediaTypeExists(pRequest.params.tag)
				.then(function(pMediaType) {
					if (pMediaType.tag !== pRequest.body.tag) {
						throw utils.createError(app.constants.CODE_ERROR, 
										app.constants.ERROR_UPDATE_TAG);
					}
					return Q(mediaModel.update({ _id : pMediaType._id }, { $set: {name: pRequest.body.name, fields: pRequest.body.fields } }).exec());
				})
				.then(function() {
					return new Response(app.constants.SUCCESS_UPDATE);
				}) 
				.catch(function(pError) {
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(app, pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},


		/**
		 * Remove a media type
		 */
		deleteMediaType: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return mediaTypeExists(pRequest.params.tag)
				.then(function(pMediaType) {
					var removeMediaType = Q.nbind(mediaModel.remove, mediaModel);
					var mediaToRemove = {
						_id : pMediaType._id
					};
					return removeMediaType(mediaToRemove);
				})
				.then(function() {
					return new Response(app.constants.CODE_OK, app.constants.SUCCESS_DELETE);
				})
				.catch(function(pError) {
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(app, pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		}
	};
};