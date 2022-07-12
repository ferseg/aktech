/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: spaces-service.js
 */

'use strict';

angular.module('CoesApp').service('SpacesService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var spacesURL = baseUrl + '/api/spaces/';
	var spacesWithMediaURL = spacesURL + 'with_media_type';
	var mediaTypesURL = baseUrl + '/api/media/';
	var countriesURL = baseUrl + '/api/countries';

	/**
	 * get the media types in the db
	 * @return {Object} - Promise to return
	 */
	this.getMediaTypes = function() {
		return request.get(mediaTypesURL);
	};

	/**
	 * get the countries in the db
	 * @return {Object} - Promise to return
	 */
	this.getCountries = function() {
		return request.get(countriesURL);
	};
	
	/**
	 * get the spaces in the db
	 * @return {Object} - Promise to return
	 */
	this.getSpaces = function() {
		return request.get(spacesURL);
	};

	/**
	 * Get Spaces with media type
	 * @return {Object} Promise of the spaces
	 */
	this.getSpacesWithMediaType = function() {
		return request.get(spacesWithMediaURL);
	};

	/**
	 * update the space in the system
	 * @param  {Object} pSpace - object to update
	 * @param  {String} pId - id of the object to update
	 * @return {Object} - Promise to return
	 */
	this.updateSpace = function(pSpace, pId) {
		return request.save(spacesURL + pId, pSpace);
	};

	/**
	 * save a new space in the db
	 * @param  {Object} pSpace - Object to save in the db
	 * @return {Object} - Promise to return
	 */
	this.saveSpace = function(pSpace) {
		return request.post(spacesURL, pSpace);
	};
});