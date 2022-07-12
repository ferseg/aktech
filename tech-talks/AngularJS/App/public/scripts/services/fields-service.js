/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: fields-service.js
 */

'use strict';

angular.module('CoesApp').service('FieldsService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var fieldsURL = baseUrl + '/api/fields/';

	/**
	 * get the fields in the system
	 * @return {Object} - Promise to return
	 */
	this.getFields = function() {
		return request.get(fieldsURL);
	};

	/**
	 * get the exclusives fields in the system
	 * @return {Object} - Promise to return
	 */
	this.getExclusivesFields = function() {
		return request.get(fieldsURL + 'exclusives');
	};

	/**
	 * get the measurables fields in the system
	 * @return {Object} - Promise to return
	 */
	this.getMeasurablesFields = function() {
		return request.get(fieldsURL + 'measurables');
	};

	/**
	 * Update a field in the db
	 * @param  {Object} pField - Object to update
	 * @return {Object} - Promise to return
	 */
	this.updateField = function (pField) {
		return request.save(fieldsURL + pField._id, pField);
	};

	/**
	 * save a new field in the db
	 * @param  {Object} pField - Object to save in the db
	 * @return {Object} - Promise to return
	 */
	this.saveField = function(pField) {
		return request.post(fieldsURL, pField);
	};
});