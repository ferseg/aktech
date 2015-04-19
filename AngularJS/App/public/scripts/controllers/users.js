/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: users.js
 */

'use strict';

//Controller for users module
angular.module('CoesApp').controller('UsersCtrl',
	function userModule($rootScope, $scope, $filter, $sce, UsersService, generalSettings, logClass, sessionService, utils, ClientsService) {
		
		var EDITING_STATE = 0;
		var CREATING_STATE = 1;

		/**
		 * Variables
		 */
		var url = generalSettings.getSetting('serviceURL');
		var newUser = false;
		var disabledUser;
		var editPermissions = false;
		var log = {};
		var timerId;
		var indexUser;
		var clients = {};
		var selectedClient = {};
		var usersByClient = {};

		/**
		 * Scope variables
		 */
		$scope.sort = 'up';
		$scope.sortbyemail = 'up';
		$scope.usersPhotoEndpoint = $sce.trustAsResourceUrl(url + '/api/users/photos');
		$scope.pageAlerts = [];
		$scope.reverse = false;
		$scope.settings = {};
		$scope.filter = {};
		$scope.selectedClient = {};

		/**
		 * Functions
		 */
		
		/**
		 * function to load permissions available for the current user in edit form
		 */
		function loadPermissions(){
			$scope.permissions.forEach(function(pPermission){
				if($scope.editUser.permissions) {
					if( $scope.editUser.permissions.indexOf(pPermission.code) > -1){
						pPermission.checked=true;
					} else {
						pPermission.checked=false;
					}
				}
			});
			$scope.availablePermissions = $filter('filter')($scope.permissions, {checked: true});
		}

		/**
		 * function to initialize variables for edit new user
		 */
		function initializeUser(){
			loadPermissions();
			disabledUser = false;
			editPermissions = false;
			if (!$scope.editUser.urlFoto){
				$scope.editUser.urlFoto = url + '/images/default-user-icon-profile.png';
			}
		}

		/**
		 * Get the current session in the system
		 */
		function getCurrentUser() {
			if(sessionService.getCurrentUser()) {
				$scope.userLogged = sessionService.getCurrentUser().username;
				if(sessionService.isAdmin()) {
					$scope.availableEdit = true;
				}
			} else {
				UsersService.getCurrentUser()
				.then(function(pUser) {
					sessionService.authSuccess(pUser.user);
					//sessionService.setCurrentClient(pUser.client);
					$scope.userLogged = sessionService.getCurrentUser().username;
					if(sessionService.isAdmin()) {
						$scope.availableEdit = true;
					}

					$rootScope.$emit('loginSuccess', pUser);
				}).catch(function(pError) {
					$scope.pageAlerts.push({
						message: pError,
						type: 'danger'
					});
				});
			}
		}

		/**
		 * function to load the list of users
		 */
		function loadUsers() {
			ClientsService.getClients()
			.then(function(pClients) {
				var coesClient = {
					name: 'COES',
					tag: '#coes'
				};
				$scope.clients = pClients;
				$scope.clients.push(coesClient);
				$scope.clients.forEach(function(pClient) {
					clients[pClient.tag] = pClient;
				});

				UsersService.getUsers()
				.then(function(pUsers) {
					$scope.allUsers = utils.clone(pUsers);
					$scope.users = pUsers;

					$scope.users.forEach(function(pUser) {

						pUser.client = {};

						pUser.clientTag.forEach(function(pClientTag) {
							pUser.client[pClientTag] = utils.clone(clients[pClientTag]);
							pUser.client[pClientTag].advanced = false;

							/*if(!usersByClient[pClientTag]) {
								usersByClient[pClientTag] = [utils.clone(pUser)];
							} else {
								usersByClient[pClientTag].push(utils.clone(pUser));
							}*/
						});

						pUser.advanceUser.forEach(function(pAdvancedUser) {
							pUser.client[pAdvancedUser.clientTag].advanced = pAdvancedUser.advanced;

							if(!usersByClient[pAdvancedUser.clientTag]) {
								usersByClient[pAdvancedUser.clientTag] = [utils.clone(pUser)];
							} else {
								usersByClient[pAdvancedUser.clientTag].push(utils.clone(pUser));
							}
						});
					});

					$scope.selectedClient = utils.clone(coesClient);
					selectedClient = utils.clone($scope.selectedClient);
					$scope.users = usersByClient[coesClient.tag];

					$scope.editUser = utils.clone($scope.users[0]);
					$scope.editUser.password = "";
					$scope.settings.selectedUserIndex = 0;
					if (!$scope.editUser.urlFoto){
						$scope.editUser.urlFoto = url+'/images/default-user-icon-profile.png';
					}
					indexUser = 0;

					//Get all the permissions
					UsersService.getPermissions()
					.then(function(pPermissions) {
						$scope.permissions = pPermissions;
						loadPermissions();
					}).catch(function(pError) {
						$scope.pageAlerts.push({
							message: pError,
							type: 'danger'
						});
					});
				}).catch(function(pError) {
					$scope.pageAlerts.push({
						message: pError,
						type: 'danger'
					});
				});
			}).catch(function(pError) {
				$scope.pageAlerts.push({
					message: pError,
					type: 'danger'
				});
			});
		}

		/**
		 * function to validate if the fields are valid
		 * @param  {Object} pUser - the user to save or update
		 * @return {Boolean} - true if is valid inputs or false if not
		 */
		function validateFields(pUser) {
			var retorno = true;

			if(pUser.name===undefined){
				$scope.pageAlerts.push({
					message: 'El campo nombre es requerido',
					type: 'danger'
				});
				retorno = false;
			}
			if(pUser.lastName1===undefined){
				$scope.pageAlerts.push({
					message: 'El campo primer apellido es requerido',
					type: 'danger'
				});
				retorno = false;
			}
			if(pUser.username===undefined){
				$scope.pageAlerts.push({
					message: 'Email inválido',
					type: 'danger'
				});
				retorno = false;
			} else {
				if ((newUser)&&($scope.users)) {
					$scope.users.forEach(function(pUserIntoUsers) {
						if (pUserIntoUsers.username.toLowerCase()===pUser.username.toLowerCase()) {
							$scope.pageAlerts.push({
								message: 'El campo de email debe ser único, ya existe un usuario con email ' + pUserIntoUsers.username,
								type: 'danger'
							});
							retorno = false;
						}
					});
				}
			}
			if(pUser.password===undefined){
				$scope.pageAlerts.push({
					message: 'El campo password es requerido',
					type: 'danger'
				});
				retorno = false;
			}
			if(utils.isEmptyObject($scope.editUser.client)) {
				$scope.pageAlerts.push({
					message: 'Se debe seleccionar al menos un cliente/empresa para el usuario',
					type: 'danger'
				});
				retorno = false;
			}

			if(pUser.tag===undefined){
				/*$scope.pageAlerts.push({
					message: 'El campo tag es requerido',
					type: 'danger'
				});
				retorno = false;*/
			} else {
				pUser.tag = pUser.tag.toLowerCase();
				if(!utils.isValidTag(pUser.tag)) {
				//if(!pUser.tag.match(/(^#)(((\w+)(-*))*)$/)){
					$scope.pageAlerts.push({
						message: 'El tag es inválido',
						type: 'danger'
					});
					retorno = false;
				}
			}
			return retorno;
		}
                                                                                                               
		/**
		 * Check to see when a user has selected a file 
		 */
		timerId = setInterval(function() {
			if($('#userPhotoInput').val() !== '') {
				clearInterval(timerId);
				$('#uploadForm').submit();
			}
		}, 1000);

		/**
		 * upload the image to the server
		 */
		$('#uploadForm').submit(function() {
			$(this).ajaxSubmit({
				error: function(pError) {
					$scope.pageAlerts.push({
						message: pError,
						type: 'danger'
					});
				},
				success: function(pResponse) {
					$scope.editUser.urlFoto = url + '/images/' + pResponse;
				}
			});
			// Stop the form from submitting and causing a page refresh
			return false;
		});

		/**
		 * Scope functions
		 */
		
		/**
		 * Generic funtion to close alerts in the page
		 * @param  {Int} pIndex - index of the alert
		 * @param  {Array} pArrayName - Array of alerts
		 */
		$scope.closeAlert = function(pIndex, pArrayName) {
			$scope[pArrayName].splice(pIndex, 1);
		};
		
		/**
		 * function to move down in the table
		 * @param  {Int} pIndex - index of the user to load
		 */
		$scope.nextUser = function(pUser, pIndex) {
			pIndex = pIndex===$scope.users.length ? 0 : pIndex;
			$('#user-'+pIndex).focus();
			$scope.changeUser(pUser, pIndex);
		};

		/**
		 * function to move up in the table
		 * @param  {Int} pIndex - index of the user to load
		 */
		$scope.previousUser = function(pUser, pIndex) {
			pIndex = pIndex<0 ? $scope.users.length-1 : pIndex;
			$('#user-'+pIndex).focus();
			$scope.changeUser(pUser, pIndex);
		};

		/**
		 * generic funtion the change the focus element
		 * @param  {String} pElement - id of the element to focus (ie. #users-table)
		 */
		$scope.changeFocus = function(pElement) {
			utils.changeFocus(pElement);
		};
		
		/**
		 * fuction to change user selected to edit
		 * @param  {Object} pIndex - index of user to edit
		 */
		$scope.changeUser = function(pUser, pIndex) {
			$scope.settings.selectedUserIndex = pIndex;
			pIndex = $scope.reverse ? $scope.users.length-pIndex-1 : pIndex;
			var index = $scope.users.indexOf(pUser);
		    if ($scope.users[pIndex].username===pUser.username) {
			    var user = utils.clone($scope.users[pIndex]);
		    	indexUser = pIndex;
			} else {
		        var user = utils.clone($scope.users[index]);
		    	indexUser = index;
		    }

		    $scope.editUser = utils.clone(user);
		    $scope.editUser.password = "";
			initializeUser();
			newUser = false;
			$scope.settings.screenState = EDITING_STATE;
		};

		/**
		 * function to clean the form and create new object to add user
		 */
		$scope.addUser = function(){
			$scope.settings.screenState = CREATING_STATE;
			$scope.settings.selectedUserIndex = -1;
			newUser=true;
			$scope.editUser = {
				enabled: true,
				client: {},
				clientTag: [$scope.selectedClient.tag]
			};
			$scope.editUser.client[$scope.selectedClient.tag] = $scope.selectedClient;
			initializeUser();
			$scope.changeFocus('#name-input');
		};

		/**
		 * Invoke the util function to generate the tag
		 */
		$scope.generateTag = function() {
			if (newUser) {
				if (($scope.editUser.name!==undefined) && ($scope.editUser.tag===undefined)) {
					$scope.editUser.tag = utils.generateTag($scope.editUser.name);
				}
			}
		};

		/**
		 * function to update a user or create a new one
		 * @param  {Object} pUser - user to update in the database
		 */
		$scope.updateUser = function(pUser, pPermissions){
			var permissions = [];

			if (!validateFields(pUser)){
				return false;
			}

			pPermissions.forEach(function(pPermission){
				if(pPermission.checked){
					permissions.push(pPermission.code);
				}
			});
			pUser.permissions = permissions;

			pUser.advanceUser = [];
			for (var key in pUser.client) {
				pUser.advanceUser.push({
					clientTag: pUser.client[key].tag,
					advanced: pUser.client[key].advanced ? pUser.client[key].advanced : false
				});
			}
			
			if(newUser){

				var clientsTags = [];
				for (var key in pUser.client) {
					clientsTags.push(pUser.client[key].tag);
				}
				pUser.clientTag = clientsTags;

				pUser.isAdmin = pUser.clientTag.indexOf('#coes')!==-1 ? true : false;

				UsersService.saveUser(pUser)
				.then(function(pResponse) {
					
					pUser.clientTag.forEach(function(pClientTag) {
						if(!usersByClient[pClientTag]) {
							usersByClient[pClientTag] = [utils.clone(pUser)];
						} else {
							usersByClient[pClientTag].push(utils.clone(pUser));
						}
					});

					$scope.users = usersByClient[$scope.selectedClient.tag];
					
					log = new logClass.log('USER CREATED','INFORMATION','New user was added to the database', sessionService.getCurrentUser()._id, [pResponse._id]);
					logClass.post(url+'/api/logs/', log);
					newUser = false;

					pUser.password = '';
					
					$scope.pageAlerts.push({
						message: 'Usuario creado exitosamente!!!',
						type: 'success'
					});

					if($scope.users) {
						$scope.settings.selectedUserIndex = $scope.users.length - 1;
					} else {
						$scope.addUser();
					}
				}).catch(function(pError) {
					$scope.pageAlerts.push({
						message: pError,
						type: 'danger'
					});
				});
			} else {

				var newClientsTags = [];
				var clientsToDelete = [];
				var clientsTags = [];
				for (var key in pUser.client) {
					
					if (pUser.clientTag.indexOf(key)==-1) {
						newClientsTags.push(key);
					}

					clientsTags.push(pUser.client[key].tag);
				}

				pUser.clientTag.forEach(function(pClientTag) {
					if(!pUser.client[pClientTag]) {
						clientsToDelete.push(pClientTag);
					}
				});

				//retomar el password original
				if(pUser.password==='') {
					pUser.password = $scope.users[$scope.settings.selectedUserIndex].password;
				}

				pUser.clientTag = clientsTags;
				pUser.isAdmin = pUser.clientTag.indexOf('#coes')!==-1 ? true : false;

				UsersService.updateUser(pUser, pUser._id)
				.then(function(pResponse) {

					pUser.password = '';

					newClientsTags.forEach(function(pClientTag) {
						if(!usersByClient[pClientTag]) {
							usersByClient[pClientTag] = [utils.clone(pUser)];
						} else {
							usersByClient[pClientTag].push(utils.clone(pUser));
						}
					});

					if(disabledUser){
						log = new logClass.log('USER DISABLED','INFORMATION','A user was disabled in the database', sessionService.getCurrentUser()._id, [pResponse._id]);
						logClass.post(url+'/api/logs/', log);
						disabledUser = false;
					}
					if(editPermissions){
						log = new logClass.log('CHANGE PERMISSIONS OF USER','INFORMATION','Were changed permissions for a user', sessionService.getCurrentUser()._id, [pResponse._id]);
						logClass.post(url+'/api/logs/', log);
						editPermissions = false;
					}
					
					//delete of user in others clients
					clientsToDelete.forEach(function(pClientTag) {
						usersByClient[pClientTag].forEach(function(pUserByClient, pIndex) {
							if(pUser.username===pUserByClient.username) {
								usersByClient[pClientTag].splice(pIndex, 1);
							}
						});
					});

					//$scope.users[indexUser] = pUser;
					/*if(pUser.clientTag.indexOf($scope.selectedClient.tag)!=-1) {
						$scope.users[indexUser] = pUser;
					} else {
						$scope.users.splice(indexUser, 1);

						if($scope.users.length!==0) {
							$scope.editUser = utils.clone($scope.users[0]);
							$scope.settings.selectedUserIndex = 0;
						} else {
							$scope.addUser();
						}
					}*/


					$scope.pageAlerts.push({
						message: 'Usuario actualizado exitosamente!!!',
						type: 'success'
					});
				}).catch(function(pError) {
					$scope.pageAlerts.push({
						message: pError,
						type: 'danger'
					});
				});
			}
		};

		/**
		 * function to enable a user
		 * @param  {Object} pUser - user to enable
		 */
		$scope.enableUser = function(){
			if($scope.editUser.enabled){
				disabledUser = true;
			} else {
				disabledUser = false;
			}
		};

		/**
		 * function to turn on the flag of permissions edited
		 */
		$scope.selectedPermissions = function(){
			editPermissions = true;
		};

		/**
		 * change the sort order in the table of users
		 */
		$scope.changeSortOrder = function(){
			$scope.sort = $scope.sort === 'down' ? 'up' : 'down';
			$scope.reverse = !$scope.reverse;
		};

		/**
		 * change the sort order in the table of users by email
		 */
		$scope.changeSortOrderByEmail = function(){
			$scope.sortbyemail = $scope.sortbyemail === 'down' ? 'up' : 'down';
			//$scope.reverse = !$scope.reverse;
		};

		$scope.getRightColumnStyle = function() {
			if ($scope.settings.selectedUserIndex != null && $scope.settings.selectedUserIndex > -1) {
				return 'wrapped-container';
			}
		};

		$scope.getActionLabel = function() {
			return $scope.settings.screenState === EDITING_STATE ? 'Editar' : 'Agregar';
		};

		$scope.removeClient = function(pClient) {
			delete $scope.editUser.client[pClient.tag]; 
		};

		$scope.typeaheadSelectClient = function() {
			$scope.clients.forEach(function(pClient) {
				if($scope.newClient===pClient.name) {
					$scope.editUser.client[pClient.tag] = pClient;
					$scope.newClient = '';
				}
			});
		};

		$scope.filterByClient = function (pClient) {
			//console.log(pClient);
			$scope.selectedClient = utils.clone(pClient);
			selectedClient = utils.clone($scope.selectedClient);
			$scope.users = usersByClient[pClient.tag];

			$scope.status.isopen = false;

			if($scope.users) {
				$scope.editUser = utils.clone($scope.users[0]);
				$scope.editUser.password = "";
				$scope.settings.selectedUserIndex = 0;
				indexUser = 0;
				newUser = false;

				initializeUser();
			} else {
				$scope.addUser();
			}
		};

		//Get the current user logged in the backend
		getCurrentUser();
		//Get all the users
		loadUsers();
		$scope.settings.screenState = EDITING_STATE;

	});

		

/* ----------------------------------------------------------- */

		/**
		 * function to delete a user
		 * @param  {Object} pUser - User to delete in database
		 */
		/*
		$scope.deleteUser = function(pUser){
			var promiseUser = request.delete(url+'/api/users/'+pUser._id);
			promiseUser.then(function(pResponse){
				alert('Usuario eliminado correctamente');
				findAndRemove($scope.users, '_id', pUser._id);
				$scope.editUser = $scope.users[0];
				console.log(pResponse);
			}, function(pStatus){
				console.log(pStatus);
			});
		};*/
		/**
		 * function to remove object from json array
		 * @param  {Array} pArray - Array to evaluate
		 * @param  {objectField} pProperty - name of the field to compare
		 * @param  {fieldValue} pValue - value of the field 
		 */
		/*function findAndRemove(pArray, pProperty, pValue) {
			$.each(pArray, function(index, result) {
				if (result!=undefined){
					if(result[pProperty] == pValue) {
						//Remove from array
						pArray.splice(index, 1);
					}
				}
			});
		}*/
