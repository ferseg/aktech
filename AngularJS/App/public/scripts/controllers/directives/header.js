/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: header.js
 */


'use strict';

angular.module('CoesApp')
  .controller('HeaderController', function ($scope, $http, $location, $route, $rootScope, UsersService, 
  		sessionService, generalSettings, request, logClass, coesModules) {
    

	//url of the web server
	var url = generalSettings.getSetting('serviceURL');
	var log;
	var logWithExtraInfo;

	//$scope.isHide = true;
    $scope.showLogin = true;
    $scope.isOpenChat = false;
    $scope.user = {};
    $scope.pageAlerts = {};
    $scope.clientsObject = {};
    $scope.isDashboard = false;
    $scope.pendingMessagesDashboard = {};
    
    /**
	 * Get the current session in the system
	 */
	function getCurrentUser() {
		if((sessionService.getCurrentUser())&&(sessionService.getClientsObject())) {
			$scope.userLogged = sessionService.getCurrentUser();
			$scope.clientsObject = sessionService.getClientsObject();
			$scope.showLogin = false;
			
			$scope.userLogged.currentClient = $scope.clientsObject[$scope.userLogged.clientTag[0]];

			$scope.menuItems = coesModules.getUsersMenu($scope.userLogged.permissions);
			if(sessionService.isAdmin()) {
				$scope.availableEdit = true;
			}
			if(sessionService.isCollaborator()) {
				$scope.isCollaborator = true;
			}
		} else {
			UsersService.getCurrentUser()
			.then(function(pUser) {
				if(!pUser) {
					$scope.showLogin = true;
				} else {
					createSession(pUser);
				}
			}).catch(function(pError) {
				$scope.showLogin = true;
				/* $scope.pageAlerts.push({
					message: pError,
					type: 'danger'
				}); */
			});
		}
	}

	var createSession = function(pUser) {
		if ($scope.showLogin) {
			$scope.showLogin = false;
			sessionService.authSuccess(pUser.user);
			$scope.clients = pUser.clients;

			if(sessionService.isAdmin()) {
				$scope.availableEdit = true;
			}
			if(sessionService.isCollaborator()) {
				$scope.isCollaborator = true;
				$scope.clients.push({
					'tag': '#coes',
					'name': 'COES'
				});
			}

			$scope.clients.forEach(function (pClient) {
				$scope.clientsObject[pClient.tag] = pClient;
			});

			sessionService.setClientsObject($scope.clientsObject);
			
			$scope.userLogged = sessionService.getCurrentUser();
			$scope.userLogged.currentClient = $scope.clientsObject[$scope.userLogged.clientTag[0]];
			$scope.menuItems = coesModules.getUsersMenu($scope.userLogged.permissions);

			sessionService.setCurrentUserWithClient($scope.userLogged);
		}
	};

	/**
	 * function to trigger in the login event
	 */
	$scope.loginUser = function () {
		//get the promise object
		var promise = request.post(url+'/api/login', $scope.user);

		//if the reponse success
		promise.then(function(pUser){
			sessionService.authSuccess(pUser.user);
			$scope.user = pUser.user;
			$scope.clients = pUser.clients;
			
			$scope.isHide = true;

			log = new logClass.log('LOGIN','INFORMATION','Login success', pUser.user._id);
			logClass.post(url+'/api/logs/', log);
			$scope.message = null;

			$scope.showLogin = false;
			$scope.userLogged = pUser.user;
			
			//$scope.user.username = '';
			$scope.user.password = '';
			$scope.menuItems = coesModules.getUsersMenu($scope.userLogged.permissions);
			//$scope.reloadChat();

			if(sessionService.isCollaborator()) {
				$scope.isCollaborator = true;
				$scope.clients.push({
					'tag': '#coes',
					'name': 'COES'
				});
			}

			$scope.clients.forEach(function (pClient) {
				$scope.clientsObject[pClient.tag] = pClient;
			});
			$scope.userLogged.currentClient = $scope.clientsObject[$scope.userLogged.clientTag[0]];
		//if the response failed
		}, function(pError) {
			$scope.message = 'Email o password incorrectos';
			$scope.isHide = false;
			$scope.user.password = '';

			logWithExtraInfo = new logClass.logWithExtraInfo('LOGIN FAILED','ERROR','The request for login failed', pError);
			logClass.post(url+'/api/logs/', logWithExtraInfo);
			sessionService.authFailed();
			$('#inputPassword').focus();
		});
	};

	$scope.changeClient = function(pClient) {
		$scope.userLogged.currentClient = pClient;
		$rootScope.$emit('changeClient', {data: $scope.userLogged});
	};

	$scope.logout = function() {
		request.post(url+'/api/logout', $scope.user)
		.then(function() {
			sessionService.logout();
			$scope.showLogin = true;
			$location.path('/');
		});
	};

	$scope.isActive = function(pLink) {
		if ($route.current.loadedTemplateUrl) {
			var currentModule = $route.current.loadedTemplateUrl.replace('.html', '').replace('views', '');
			return currentModule === pLink ? 'active' : '';
		}
		return '';
	};

	$scope.openChat = function() {
		$scope.isOpenChat = !$scope.isOpenChat;
	};

	$scope.isActiveChat = function() {
		return $scope.isOpenChat ? 'active-notification' : '';
	};

	/**
	 * listener of changes in the root
	 */
	$rootScope.$on('changeURL', function (event, args) {
		$scope.isDashboard = $location.$$path==='/dashboard' ? true : false;
	});

	$rootScope.$on('loginSuccess', function (event, args) {
		createSession(args);
	});

	/**
	 * Initialization Routine
	 */
	var init = function() {
		getCurrentUser();
	};

	init();
  });
