/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: color-picker.js
 */
'use strict';

angular.module('CoesApp').controller('ColorPickerController', function ($scope) {
    $scope.colors = ['#c5a0d1', '#8d32af', '#311d68', '#ff91a9', '#e53838', '#6e1c1c', 
      '#fab67f', '#ff8b3b', '#a15828', '#ffe19c', '#ffcc3b', '#a17e2b', '#ace68b', '#7ece43', '#265b20',
      '#70d7ff', '#1d82d6', '#114772', '#929aa0', '#5d5d5d'];
    $scope.selectedColor = -1;

    $scope.setColor = function(pIndex) {
      $scope.ngModel = $scope.colors[pIndex];
      $scope.selectedColor = pIndex;
    };

    $scope.getSelected = function(pIndex) {
      return $scope.selectedColor == pIndex ? 'selected' : '';
    };

    $scope.getColor = function(pHexColor) {
      return { 'background-color': pHexColor};
    };

    var init = function() {
      if ($scope.ngModel == null) {
        $scope.ngModel = $scope.colors[0];
        $scope.selectedColor = 0;
      }
      $scope.selectedColor = $scope.colors.indexOf($scope.ngModel);
    };

    init();
});