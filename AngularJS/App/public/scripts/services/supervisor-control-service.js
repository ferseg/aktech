/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: supervisor-control-service.js
 */

'use strict';

angular.module('CoesApp').service('SupervisorControlService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var supervisorsControlURL = baseUrl + '/api/supervisorscontrol/';

	/**
	 * get all the supervisorscontrol limit by number
	 * @return {Object} - Promise to return
	 */
	this.getSupervisorsControl = function() {
		return request.get(supervisorsControlURL);
	};

	this.updateSupervisorControl = function(pSupervisorControl) {
		return request.save(supervisorsControlURL + pSupervisorControl.id, pSupervisorControl);
	};
});