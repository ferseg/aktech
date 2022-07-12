/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: sectors-service.js
 */

'use strict';

angular.module('CoesApp').service('SectorsService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var sectorsURL = baseUrl + '/api/sectors';
    var sectorsDashboardURL = baseUrl + '/api/dashboard/sectors';
	var sectorsHierarchy = baseUrl + '/api/sectors_hierarchy';

	this.getSectorsHierarchy = function() {
		return request.get(sectorsHierarchy);
	};

	this.getSectors = function() {
		return request.get(sectorsURL);
	};

    this.getDashboardSectors = function() {
        return request.get(sectorsDashboardURL);
    };
});