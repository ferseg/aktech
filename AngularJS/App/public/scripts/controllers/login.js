/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: login.js
 */

'use strict';

//Controller for login page
angular.module('CoesApp').controller('LoginCtrl',
	function userLogin($scope, $location, generalSettings, request, logClass, sessionService) {
		//url of the web server
		var url = generalSettings.getSetting('serviceURL');
		var log;
		var logWithExtraInfo;
		
		$scope.isHide = true;

		/**
		 * function to trigger in the login event
		 */
		$scope.loginUser = function () {
			//get the promise object
			var promise = request.post(url+'/api/login', $scope.user);

			//if the reponse success
			promise.then(function(pUser){
				$scope.message = 'Inicio de sesion correcto';
				$scope.user = pUser;
				$scope.isHide = true;

				log = new logClass.log('LOGIN','INFORMATION','Login success', pUser._id);
				logClass.post(url+'/api/logs/', log);

				$location.path('/users');
				sessionService.authSuccess(pUser);
			//if the response failed
			}, function(pError){
				$scope.message = 'Email o password incorrectos';
				$scope.isHide = false;

				logWithExtraInfo = new logClass.log('LOGIN FAILED','ERROR','The request for login failed', pError);
				logClass.post(url+'/api/logs/', logWithExtraInfo);
				sessionService.authFailed();
			});
		};
	});