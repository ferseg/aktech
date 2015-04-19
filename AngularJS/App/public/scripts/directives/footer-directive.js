/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: footer-directive.js
 */

angular.module('CoesApp').directive('coesFooter', function() {
	return {
		templateUrl: 'views/common/footer.html',
		restrict: 'E',
		controller: 'FooterController'
	};
});