/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: exportable-fields-service.js
 */

'use strict';

angular.module('CoesApp').service('ExportableFieldsService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var exportableFieldsURL = baseUrl + '/api/exportableFields/';

	this.getExportableFieldsByTag = function(pTag) {
		return request.get(exportableFieldsURL+encodeURIComponent(pTag));
	};
});