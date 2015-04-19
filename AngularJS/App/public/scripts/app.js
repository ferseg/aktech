/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: app.js
 */

'use strict';

var coesApp = angular.module('CoesApp', [
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'ui.sortable',
  'xeditable',
  'scrollable-table',
  'angularSpinner',
  'angular.directives-round-progress',
  'highcharts-ng',
  'angular-svg-round-progress',
  'dialogs.main',
  'angularUtils.directives.dirPagination'
]);

coesApp.config(function ($routeProvider) {
  $routeProvider
  .when('/main', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    access: {
      isFree: true,
      ADM: false,
      SUP: false,
      EDI: false,
      CLI: false
    }
  })
  .when('/users', {
    templateUrl: 'views/users.html',
    controller: 'UsersCtrl',
    access: {
      isFree: false,
      ADM: true,
      SUP: true,
      EDI: false,
      CLI: false
    }
  })
  .otherwise({
    redirectTo: '/main'
  });
});