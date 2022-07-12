/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: userLogged.js
 */

'use strict';

//Factory to manage the users operations to the web server
angular.module('CoesApp').factory('sessionService', ['$rootScope', '$window', '$http',
	function ($rootScope, $window, $http) {
		//var adminRoles = ['admin', 'editor'];
		var session = {
			/**
			 * Initialize the session by reset the session
			 */
			init: function () {
				this.resetSession();
			},
			/**
			 * Reset the session
			 */
			resetSession: function() {
				this.currentUser = null;
				this.isLoggedIn = false;
			},
			/**
			 * logout the session active
			 */
			logout: function() {
				var scope = this;
				scope.resetSession();
				$rootScope.$emit('session-changed');
			},
			/**
			 * Save the data of the session in the frontend
			 * @param  {Object} pUserData - Object with the information of the current user
			 */
			authSuccess: function(pUserData) {
				if(!this.currentUser) {
					this.currentUser = pUserData;
					this.isLoggedIn = true;
					$rootScope.$emit('session-changed');
				}
			},
			/**
			 * If login failed, reset the session
			 */
			authFailed: function() {
				this.resetSession();
			},
			/**
			 * Set the current user selected in the system
			 * @param  {Object} pUser - Object with the information of the current user
			 */
			setCurrentUserWithClient: function(pUser){
				this.currentUserWithClient = pUser;
			},
			/**
			 * Set the current user selected in the system
			 * @param  {Object} pUser - Object with the information of the current user
			 */
			getCurrentUserWithClient: function(){
				return this.currentUserWithClient;
			},
			/**
			 * Get the current user in the system
			 * @return {Object} Return the object of the current user in the system
			 */
			getCurrentUser: function(){
				return this.currentUser;
			},
			/**
			 * Set the current user selected in the system
			 * @param  {Object} pUser - Object with the information of the current user
			 */
			setClientsObject: function(pClientsObject){
				this.clientsObject = pClientsObject;
			},
			/**
			 * Get the current user in the system
			 * @return {Object} Return the object of the current user in the system
			 */
			getClientsObject: function(){
				return this.clientsObject;
			},
			/**
			 * Get the state of the session
			 * @return {Boolean} Return true if the user is logged in the system, or false if not
			 */
			isLogIn: function(){
				return this.isLoggedIn;
			},
			/**
			 * function to get if the current user is Admin
			 * @return {Boolean} - true if the user is admin, false if not
			 */
			isAdmin: function(){
				var result = jQuery.inArray( 'ADM', this.currentUser.permissions );
				if(result===-1) {
					return false;
				}
				return true;
			},
			/**
			 * function to get if the current user is collaborator of COES (ADM, SUP or EDI)
			 * @return {Boolean} true if the user is collaborator, false if not
			 */
			isCollaborator: function(){
				return this.currentUser.isAdmin;
			},
			/**
			 * function to get if the current user is Admin
			 * @return {Boolean} - true if the user is admin, false if not
			 */
			isSupervisor: function(){
				var result = jQuery.inArray( 'SUP', this.currentUser.permissions );
				if(result===-1) {
					return false;
				}
				return true;
			},
			/**
			 * function to validate the permissions in the current route
			 * @param  {String} pRoute - url to validate permissions
			 * @return {Boolen} - True if is valid tfhe route or false if not
			 */
			validatePermissions: function (pRoute) {
				if(pRoute.access.isFree){
					return true;
				} else {
					if(this.validatePermission(pRoute.access.ADM, 'ADM')) {
						return true;
					} else {
						if(this.validatePermission(pRoute.access.SUP, 'SUP')) {
							return true;
						} else {
							if(this.validatePermission(pRoute.access.EDI, 'EDI')) {
								return true;
							} else {
								return this.validatePermission(pRoute.access.CLI, 'CLI');
							}
						}
					}
				}
			},
			/**
			 * Validate a single permission
			 * @param  {Boolean} pPermission - True if boolean is required for the url
			 * @param  {String} pPermissionString - name of the permission to validate
			 * @return {Boolean} - True if is valid or false if not
			 */
			validatePermission: function (pPermission, pPermissionString) {
				if(pPermission){
					var result = jQuery.inArray( pPermissionString, this.currentUser.permissions );
					if(result===-1) {
						return false;
					}
					return true;
				}
				return false;
			}
		};
		session.init();
		return session;
	}]);