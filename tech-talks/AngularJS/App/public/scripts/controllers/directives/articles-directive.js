/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: articles-directive.js
 */

angular.module('CoesApp').controller('ArticleDirectiveController', function ($scope, generalSettings, constants) {

 	var MAX_CHARS_NUMBER = 170,
 		MORE = '...';

 	$scope.url = generalSettings.getSetting('currentURL');
 	var titleWords = generalSettings.getSetting('articleTitleMaxLength');
 	var descriptionWords = generalSettings.getSetting('articleDescriptionMaxLength');
 	$scope.state = {
 		complete: false,
 		incomplete: false,
 		noSend: false
 	};

 	/**
 	 * Scope constants
 	 */
 	$scope.FEELING = constants.FEELING;

 	$scope.getFeeling = function() {
 		return $scope.article[constants.FEELING];
 	};

 	$scope.getDescription = function() {
 		var tempDescription = cut($scope.article.description, descriptionWords);
 		if (tempDescription > MAX_CHARS_NUMBER) {
 			return cutDescription(tempDescription);
 		}
 		return tempDescription;
 	};

 	$scope.getTitle = function() {
 		getColor();
 		return cut($scope.article.title, titleWords);
 	};

 	var cut = function(pText, pMaxWords) {
 		var words = pText.split(' ');
 		var result = '';2
 		if (words.length > pMaxWords) {
 			result = words.slice(0, pMaxWords).join(' ') + MORE;
 		} else {
 			result = $scope.article.title;
 		}
 		return result;
 	};

 	var cutDescription = function(pDescription) {
 		var indexOfDot = pDescription.indexOf('.');
 		if (indexOfDot > MAX_CHARS_NUMBER) {
 			return pDescription.substring(0, MAX_CHARS_NUMBER - 5) + MORE;
 		} else {
 			return pDescription.substring(0, indexOfDot+1);
 		}
 	};

 	var getColor = function() {
 		switch($scope.article.state) {
		    case 'Completo':
		    	$scope.state.complete = true;
		    	break;
		    case 'Incompleto':
		        $scope.state.incomplete = true;
		        break;
		    default:
		        $scope.state.noSend = true;
		}
 	};
});