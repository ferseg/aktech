/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: time-picker.js
 */

angular.module('CoesApp').directive('timePicker', function ($compile) {
        return {
            restrict: 'E',
            templateUrl: 'views/common/time-picker.html',
            controller: 'TimePickerController',
            scope: {
                ngModel: '='
            }
        };
    });