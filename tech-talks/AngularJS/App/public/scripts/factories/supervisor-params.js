/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: supervisor-params.js
 */

'use strict';

angular.module('CoesApp').factory('supervisorParams', [function() {
	var idsArticles = [];
	var isFromSupervisor = false;
	return {
		getIdsArticles: function() {
			return idsArticles;
		},

		getIdsArticlesForUrl: function() {
			var result = '';
			idsArticles.forEach(function(pIdArticle, pIndex) {
				if (pIndex===idsArticles.length-1) {
					result += pIdArticle;
				} else {
					result += pIdArticle + ',';
				}
			});

			return result;
		},

		setIdsArticles: function(pIdsArticles) {
			idsArticles = pIdsArticles;
		},

		getIsFromSupervisor: function() {
			return isFromSupervisor;
		},

		setForSupervisor: function() {
			isFromSupervisor = true;
		}
	};
}]);