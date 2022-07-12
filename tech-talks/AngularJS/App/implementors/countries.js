/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: countries.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var countriesModel = app.models['countries'];
	var tagModel = app.models['tags'];

	/**
	 * Helper method: looks for a country. If it doesn't exist, throws an error
	 * @param  {String} pHashTag Hashtag to look for
	 * @return {Object} 		 Found space
	 */
	var countryExists = function(pHashTag) {
		var query = countriesModel.find( 
			{
				'tag':pHashTag
			} 
		);
		return Q(query.exec())
		.then(function(pCountry) {
			if (pCountry.length < 1) {
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_INVALID_HASHTAG);
			}
			return pCountry[0];
		});
	};

	/**
	 * Updates the country
	 * @param  {Object} pOldCountry  Old country to update
	 * @param  {Object} pRequest   Express Request object
	 * @return {Object}            Returns a promise that updates the sector
	 */
	var updateCountryInternal = function(pOldCountry, pRequest) {
		var updatedCountry = 
		{
			name: pRequest.body.name,
			enabled: pRequest.body.enabled
		};
		return Q(countriesModel.update({ _id : pOldCountry._id }, { $set: updatedCountry }).exec());
	};

	/**
	 * function to save the space in the db
	 * @param  {Object} pCountry - Country object to save in the database
	 * @param  {Object} pTagCountry - Country tag to save in the database
	 * @return {Object} - Promise object
	 */
	var saveCountry = function(pCountry, pTagCountry) {
		return Q.when(pTagCountry.save()
			).then(function(pResult){
				Q.when(pCountry.save());
			},function(pError){
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_DATABASE);
			});
	};

	return {
		/**
		 * READ a list of countries
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getCountries: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getCountriesFunc = Q.nbind(countriesModel.find, countriesModel);
				return getCountriesFunc({enabled: true}, null, {sort:{'name':1}})
				.then(function(pCountries) {
					return new Response(pCountries);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single country
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createCountry: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				console.log('POST COUNTRY');
				var country = new countriesModel({
					name: pRequest.body.name,
					tag: pRequest.body.tag,
					enabled: pRequest.body.enabled
				});

				return utils.isHashTagValid(app, pRequest.body.tag)
				.then(function(result) {
					if (result) {
						var newTagCountry = new tagModel({
							tag: pRequest.body.tag,
							codeCollection: app.constants.COUNTRIES_TAGS
						});
						return saveCountry(country, newTagCountry);
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG);
				}).then(function() {
					return new Response(country);
				}).catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					console.log(pError);
					if (pError.http_code) {					
						return new Response(pError.message, pError.http_code);
					} else {
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},

		/**
		 * UPDATE a single country
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateCountry: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return countryExists(pRequest.body.tag)
				.then(function(pCountry) {
					if (pCountry.tag !== pRequest.body.tag) { // The tag can't be updated
						throw utils.createError(app.constants.CODE_ERROR, 
							app.constants.ERROR_UPDATE_TAG);
					}
					return updateCountryInternal(pCountry, pRequest);
				})
				.then(function() {
					return pResponse.send(app.constants.CODE_OK, app.constants.SUCCESS_UPDATE);
				})
				.catch(function(pError) {
					if (pError.http_code) {
						return pResponse.send(pError.http_code, pError.message);
					} else {
						exceptionsLogger.logError(pError);
						return pResponse.send(app.constants.CODE_SERVER_ERROR, app.constants.ERROR_DATABASE);
					}
				});
			}
		}
	};
};