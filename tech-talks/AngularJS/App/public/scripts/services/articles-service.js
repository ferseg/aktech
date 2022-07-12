/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: articles-service.js
 */

angular.module('CoesApp').service('ArticlesService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var articlesURL = baseUrl + '/api/articles/';
	var articlesByStateURL = baseUrl + '/api/articlesByState/';

	this.getArticlesById = function(pIdArticle) {
		return request.get(articlesURL + pIdArticle);
	};

	this.getArticles = function() {
		return request.get(articlesURL);
	};

	this.getArticlesByState = function(pState) {
		return request.get(articlesByStateURL+encodeURIComponent(pState));
	};

	this.saveArticle = function(pArticle) {
		return request.post(articlesURL, pArticle);
	};

	this.updateArticle = function(pArticle) {
		return request.save(articlesURL+pArticle._id, pArticle);
	};
});