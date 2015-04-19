/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: ngEnter.js
 */

'use strict';

angular.module('CoesApp').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          //Enter key
          if(event.which === 13) {
            scope.$apply(function (){
              scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
          }
          //Up key
          if(event.which === 38) {
            scope.$apply(function (){
              scope.$eval(attrs.ngUp);
            });
            event.preventDefault();
          }
          //Down key
          if(event.which === 40) {
            scope.$apply(function (){
              scope.$eval(attrs.ngDown);
            });
            event.preventDefault();
          }
          //Tab key
          if(event.which === 9) {
            scope.$apply(function (){
              scope.$eval(attrs.ngTab);
            });
            event.preventDefault();
          }
          //Shift+tab key
          if(event.shiftKey && event.keyCode === 9) {
            scope.$apply(function (){
              scope.$eval(attrs.ngShifttab);
            });
            event.preventDefault();
          }
        });
      };
  });
