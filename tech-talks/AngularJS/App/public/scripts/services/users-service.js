/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: users-service.js
 */

'use strict';

angular.module('CoesApp').service('UsersService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var usersURL = baseUrl + '/api/users/';
	var permissionsURL = baseUrl + '/api/permissions/';

	/**
	 * get the current user in the system
	 * @return {Object} - Promise to return
	 */
	this.getCurrentUser = function() {
		return request.get(baseUrl+'/api/currentUser/');
	};

	this.getUsers = function() {
		return request.get(usersURL);
	};

	this.getUsersByClient = function(pClientTag) {
		return request.get(usersURL + 'byClient/%23' + pClientTag.substring(1, pClientTag.lenght));
	};

	/**
	 * get a user by email
	 * @return {Object} - Promise to return
	 */
	this.getUser = function(pEmail) {
		return request.get(usersURL + pEmail);
	};

	/**
	 * create a new user in the db
	 * @return {Object} - Promise to return
	 */
	this.saveUser = function(pUser) {
		return request.post(usersURL, pUser);
	};

	/**
	 * update a user in the db
	 * @return {Object} - Promise to return
	 */
	this.updateUser = function(pUser, pId) {
		return request.save(usersURL + pId, pUser);
	};

	this.getPermissions = function() {
		return request.get(permissionsURL);
	};
});