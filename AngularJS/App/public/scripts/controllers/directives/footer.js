/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: footer.js
 */

'use strict';

angular.module('CoesApp')
  .controller('FooterController', function ($scope, $http, generalSettings) {
    $scope.currentDate = new Date();
  });
