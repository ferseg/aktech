/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: color-picker-directive.js
 */

angular.module('CoesApp').directive('colorPicker', function ($compile) {
        return {
            restrict: "E",
            templateUrl: 'views/common/color-picker.html',
            controller: "ColorPickerController",
            scope: {
                ngModel: '='
            }
        };
    });