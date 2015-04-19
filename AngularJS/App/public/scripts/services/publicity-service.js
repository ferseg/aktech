/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: publicity-service.js
 */

'use strict';

angular.module('CoesApp').service('PublicityService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var publicityURL = baseUrl + '/api/spaces-publicity/';

	/**
	 * get the fields in the system
	 * @return {Object} - Promise to return
	 */
	this.getPublicities = function() {
		return request.get(publicityURL);
	};

	/**
	 * get a publicity value for the space pass in parameter
	 * @param  {String} pMediaType - Tag of the media type
	 * @param  {String} pEdition - edition of the media 
	 * @return {Object} - Promise to return
	 */
	this.getPublicityBySpace = function(pMediaType, pEdition) {
		return request.get(publicityURL + '%23' + pMediaType.substr(1) + '/' + pEdition);
	};

	/**
	 * get a publicity value for the space pass in parameter
	 * @param  {String} pMediaType - Tag of the media type
	 * @param  {String} pEdition - edition of the media 
	 * @return {Object} - Promise to return
	 */
	this.getPublicityBySpaceWithSize = function(pMediaType, pEdition, pSize) {
		return request.get(publicityURL + '%23' + pMediaType.substr(1) + '/' + pEdition + '/' + pSize);
	};
});