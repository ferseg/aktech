/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: fileread.js
 */

angular.module('CoesApp').directive('fileread', function () {
	return {
        scope: {
            fileread: '='
        },
        link: function($scope, element, attributes) {
        	element.bind("change", function (changeEvent) {
                $scope.$apply(function () {
                    $scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    };
});