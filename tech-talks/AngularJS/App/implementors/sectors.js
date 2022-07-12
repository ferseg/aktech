/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: sectors.js
 */

/* Requires */
var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Q = require('q');
var Response = require('../utils/response-creator/response-object');


/* Private vars */
var app;
var sectorModel;
var tagModel;
var subscrptionDeliveriesModel;

/* Private Methods */

var getSectorsInternal = function(pRequest) {
	if(!pRequest.user) {
		return new Response(app.constants.CODE_UNAUTHORIZED);
	} else {
		var getSectors = Q.nbind(sectorModel.find, sectorModel);
		return getSectors()
		.then(function(pSectors) {
			return new Response(pSectors, app.constants.CODE_OK);
		})
		.catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
		});
	}
};

var getDashboardSectors = function(pRequest){
	if (!pRequest.user){
		return new Response(app.constants.CODE_UNAUTHORIZED);
	}
	else{
		//If it is admin, return all the sectors.
		if (pRequest.user.isAdmin)
			return getSectorsInternal(pRequest);
		else {
			//If not, only those that are part of the subscription deliveries that I am associated with. 
			var query = Q.nbind(subscrptionDeliveriesModel.find, subscrptionDeliveriesModel);
			return query({email: pRequest.user.username, enabled: true}, 'tagSectors')
			.then(function(pDeliveries) {
				//Get the sector tags.
				var sectors = {};
				pDeliveries.forEach(function(pDelivery){
					pDelivery.tagSectors.forEach(function(pSector){
						sectors[pSector] = true;
					});
				});
				//Get the sectors
				var query = Q.nbind(sectorModel.find, sectorModel);
				return query({ 'tag' : {$in: Object.keys(sectors)}})
				.then(function(pSectors) {
					return new Response(pSectors, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
				return new Response(pDeliveries, app.constants.CODE_OK);
			})
			.catch(function(pError) {
				exceptionsLogger.logError(app, pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		}
	}
};

var getSectorsByTagInternal = function(pRequest) {
	if(!pRequest.user) {
		return new Response(app.constants.CODE_UNAUTHORIZED);
	} else {
		var query = Q.nbind(sectorModel.find, sectorModel);
		return query({ 'tag' : pRequest.params.tag})
		.then(function(pSectors) {
			return new Response(pSectors, app.constants.CODE_OK);
		})
		.catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
		});
	}
};

var getSectorsHierarchyInternal = function(pRequest) {
	if(!pRequest.user) {
		return new Response(app.constants.CODE_UNAUTHORIZED);
	} else {
		var findSectors = Q.nbind(sectorModel.find, sectorModel);
		var subsectors = {};
		var fatherIndex = {};
		var responseArray = [];
		return findSectors()
		.then(function(pSectors) {
			pSectors.forEach(function(pSector) {
				if (pSector.tagFather == null) {
					fatherIndex[pSector.tag] = responseArray.length;
					responseArray.push(pSector);
					return;
				}
				if (subsectors[pSector.tagFather] == null) {
					subsectors[pSector.tagFather] = [];
				}
				subsectors[pSector.tagFather].push(pSector);
			});
			for (var key in subsectors) {
				var sector = {
					tag: responseArray[fatherIndex[key]].tag,
					detail: responseArray[fatherIndex[key]].detail,
					_id: responseArray[fatherIndex[key]]._id,
					subsectors: subsectors[key]
				};
				responseArray[fatherIndex[key]] = sector;
			}
			responseArray.sort(function(pSectorA, pSectorB) {
				return pSectorA.detail.localeCompare(pSectorB.detail);
			});
			return new Response(responseArray, app.constants.CODE_OK);
		})
		.catch(function(pError) {
			console.log(pError);
			exceptionsLogger.logError(app, pError);
			return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
		});
	}
};

var saveSectorInternal = function(pRequest) {
	if(!pRequest.user) {
		return new Response(app.constants.CODE_UNAUTHORIZED);
	} else {
		var newTag = new tagModel({
			tag: pRequest.body.tag,
			codeCollection: app.constants.SECTORS_TAGS
		});
		var newSector = new sectorModel({
			tag: pRequest.body.tag,
			detail: pRequest.body.detail,
			tagFather: pRequest.body.tagFather
		});
		return Q.allSettled([
			utils.isHashTagValid(app, pRequest.body.tag),
			utils.hashTagExists(app, app.constants.SECTORS_TAGS, pRequest.body.tagFather)
		]).then(function(result) {
			isValidHashTag = result[0].value;
			tagFatherExists = result[1].value;
			if (isValidHashTag) {  
				if (pRequest.body.tagFather) { // If tagFather is sent in the request
					if (tagFatherExists) { 
						return Q.when(newSector.save());	
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_TAG_FATHER);
				} else {
					return Q.when(newSector.save());
				}
			} 
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_INVALID_HASHTAG);
		}).then(function() {
			return Q.when(newTag.save());
		}).then(function() {
			return new Response(newSector, app.constants.CODE_OK);
		}, function(pError) {
			if (pError.http_code) {
				return new Response(pError.message, pError.http_code);
			} else {
				exceptionsLogger.logError(app, pError);
				return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
			}
		});
	}
};

/**
 * Helper method: looks for a sector. If it doesn't exist, throws an error
 * @param  {String} pHashTag Hashtag to look for
 * @return {Object} 		 Found sector
 */
var sectorExistsInternal = function(pHashTag) {
	var query = sectorModel.find( 
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

/**
 * Helper method: throws an error if a sector has subsectors
 * @param  {Object}  pSector Father sector
 * @return {Object}  		 Returns the same sector if doesn't have subsectors. Otherwise, throws an error.
 */
var hasSubSectorsInternal = function(pSector) {
	var query = sectorModel.find( 
		{
			'tagFather':pSector.tag
		} 
	);
	return Q(query.exec())
	.then(function(pSectors) {
		if (pSectors.length > 0) {
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_HAS_SUBSECTORS);
		}
		return pSector;
	});
};

var updateSectorInternal = function(pRequest) {
	if(!pRequest.user) {
		return new Response(app.constants.CODE_UNAUTHORIZED);
	} else {
		return sectorExists(pRequest.params.tag)
		.then(function(pSector) {
			if (pSector.tag !== pRequest.body.tag) { // The tag can't be updated
				throw utils.createError(app.constants.CODE_ERROR, app.constants.ERROR_UPDATE_TAG);
			}
			if (pRequest.body.tagFather && pRequest.body.tagFather === pSector.tagFather) { // If changing tag father
				return utils.hashTagExists(app, 'sectors', pRequest.body.tagFather) //validate new tagFather
				.then(function(pIsValid) {
					if (pIsValid) {
						return updateSectorFunc(pSector, pRequest);
					} else {
						throw utils.createError(app.constants.CODE_ERROR, app.constants.ERROR_INVALID_TAG_FATHER);
					}
				});
			}
			return updateSectorFunc(pSector, pRequest);
		})
		.then(function() {
			return new Response(app.constants.SUCCESS_UPDATE, app.constants.CODE_OK);
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
};

/**
 * Removes a sector and it's tag
 * @param  {Object} pSector Sector to delete
 * @return {Object}         Returns a promise when a the sector and tags are removed
 */
var removeSectorAndTagInternal = function(pSector) {
	var removeSector = Q.nbind(sectorModel.remove, sectorModel);
	var removeTag = Q.nbind(tagModel.remove, tagModel);
	var sectorToRemove = {
		_id : pSector._id
	};
	var tagToRemove = {
		tag : pSector.tag
	};

	return Q.allSettled([removeSector(sectorToRemove), removeTag(tagToRemove)]);
};

/**
 * Removes a sector
 */
var deleteSectorInternal = function(pRequest) {
	if(!pRequest.user) {
		return new Response(app.constants.CODE_UNAUTHORIZED);
	} else {
		sectorExists(pRequest.params.tag)
		.then(function(pSector) {
			return hasSubSectors(pSector)
			.then(removeSectorAndTag)
			.then(function() {
				return new Response(app.constants.SUCCESS_DELETE, app.constants.CODE_OK);
			})
			.catch(function(pError) {
				throw pError; // Throw inner error 
			});
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
};

var updateSectorFunc = function(pOldSector, pRequest) {
	var tagFather = pRequest.body.tagFather ? 
		pRequest.body.tagFather : 
		'';
	var updatedSector = 
	{
		detail : pRequest.body.detail,
		tagFather : tagFather
	};

	return Q(sectorModel.update({ _id : pOldSector._id }, { $set: updatedSector }).exec());
};

module.exports = function(pApp) {
	app = pApp;
	tagModel = app.models['tags'];
	sectorModel = app.models['sectors'];
	subscrptionDeliveriesModel = app.models['subscription-deliveries'];

	return {
		getSectors: getSectorsInternal,
		getDashboardSectors: getDashboardSectors,
		getSectorsByTag: getSectorsByTagInternal,
		getSectorsHierarchy: getSectorsHierarchyInternal,
		saveSector: saveSectorInternal,
		updateSector: updateSectorInternal,
		deleteSector: deleteSectorInternal
	};
};
