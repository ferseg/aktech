/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: focus-element.js
 */

'use strict';

angular.module('CoesApp').directive('FocusElement', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
        //Enter key
      if(event.which === 13) {
        scope.$apply(function (){
          console.log('asd');
        });
        event.preventDefault();
      }
    });
  };
});
