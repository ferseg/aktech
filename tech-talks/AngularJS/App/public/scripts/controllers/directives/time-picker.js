/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: time-picker.js
 */

'use strict';

angular.module('CoesApp').controller('TimePickerController', function ($scope) {
   	/**
	 * calculate the minutes and hours
	 */
	$scope.calculateMinutes = function () {
		if($scope.ngModel.minutes>59){
			$scope.ngModel.hours = Math.floor($scope.ngModel.minutes/60);
			$scope.ngModel.minutes %= 60;
		}
	};

	/**
	 * calculate the seconds and minutes
	 */
	$scope.calculateSeconds = function () {
		if($scope.ngModel.seconds>59){
			$scope.ngModel.hours =0;

			$scope.ngModel.minutes = Math.floor($scope.ngModel.seconds/60);
			$scope.ngModel.seconds %= 60;

			$scope.calculateMinutes();
		}
	};

    var init = function() {
    	if ($scope.ngModel == null) {
    		$scope.ngModel = {
				hours: 0,
				minutes: 0,
				seconds: 0
			};
		}
    };

    init();
});
