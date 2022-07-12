/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: dynamic-field.js
 */
angular.module('CoesApp').directive('dynamicField', function ($compile) {
    return {
        restrict: "E",
        templateUrl: 'views/common/dynamic-field.html',
        controller: "DynamicFieldController",
        scope: {
            ngModel: '=',
            fieldInformation: '='
        }
    };
});