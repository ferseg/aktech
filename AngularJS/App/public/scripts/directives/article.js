/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: article.js
 */

angular.module('CoesApp').directive('article', function () {
	return {
        restrict: "E",
        templateUrl: 'views/common/article-template.html',
        controller: "ArticleDirectiveController",
        scope: {
            article: '=',
            editArticle: '&',
            cloneArticle: '&'
        }
    };
});