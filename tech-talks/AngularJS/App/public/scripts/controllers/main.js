/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: main.js
 */


'use strict';

angular.module('CoesApp')
  .controller('MainCtrl', function ($scope, $http, generalSettings) {
    
    $scope.url = generalSettings.getSetting('serviceURL');
  
    $scope.show_logo = true;

    $scope.teams = ['Real Madrid', 'Barcelona', 'Bayer Munich', 'Chelsea'];

    $scope.teamsObject = [
    	{
    		name: 'Real Madrid',
    		country: 'España'
    	},
    	{
    		name: 'Barcelona',
    		country: 'España'
    	},
    	{
    		name: 'Bayer Munich',
    		country: 'Alemania'
    	},
    	{
    		name: 'Chelsea',
    		country: 'Inglaterra'
    	}
    ];
    
    });
