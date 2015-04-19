/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: emailshash-service.js
 */

'use strict';

angular.module('CoesApp').service('EmailsHashService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var emailsHashURL = baseUrl + '/api/emailsHash/';

	/**
	 * get all the articles limit by number
	 * @return {Object} - Promise to return
	 */
	this.getAllArticles = function(pQuantity) {
		return request.get(emailsHashURL + pQuantity);
	};

	/**
	 * get all the articles between two dates
	 * @return {Object} - Promise to return
	 */
	this.getAllArticlesBetweenDates = function(pStartDate, pEndDate) {
		var date = new Date();
		var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
		if (lastDay.getDate()===pEndDate.getDate()) {
			var startDate = (pStartDate.getMonth() + 1) + '%2F' + pStartDate.getDate() + '%2F' + pStartDate.getFullYear();
			var endDate = (pEndDate.getMonth() + 2) + '%2F' + '01' + '%2F' + pEndDate.getFullYear();
		} else {
			var startDate = (pStartDate.getMonth() + 1) + '%2F' + pStartDate.getDate() + '%2F' + pStartDate.getFullYear();
			var endDate = (pEndDate.getMonth() + 1) + '%2F' + (pEndDate.getDate() + 1) + '%2F' + pEndDate.getFullYear();
		}
		//http://localhost:4242/api/emailsHash/05%2F20%2F2014/05%2F24%2F2014
		return request.get(emailsHashURL + startDate + '/' + endDate);
	};

	/**
	 * get the articles by email and limit by number
	 * @return {Object} - Promise to return
	 */
	this.getArticlesByEmail = function(pEmail, pQuantity) {
		return request.get(emailsHashURL + pEmail + '/' + pQuantity);
	};

	/**
	 * get articles by email and client between two dates
	 * @return {Object} - Promise to return
	 */
	this.getArticlesByEmailAndClientBetweenDates = function(pEmail, pClientTag, pStartDate, pEndDate) {
		var date = new Date();
		var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
		if (lastDay.getDate()===pEndDate.getDate()) {
			var startDate = (pStartDate.getMonth() + 1) + '%2F' + pStartDate.getDate() + '%2F' + pStartDate.getFullYear();
			var endDate = (pEndDate.getMonth() + 2) + '%2F' + '01' + '%2F' + pEndDate.getFullYear();
		} else {
			var startDate = (pStartDate.getMonth() + 1) + '%2F' + pStartDate.getDate() + '%2F' + pStartDate.getFullYear();
			var endDate = (pEndDate.getMonth() + 1) + '%2F' + (pEndDate.getDate() + 1) + '%2F' + pEndDate.getFullYear();
		}
		
		return request.get(emailsHashURL + pEmail + '/%23' + pClientTag.substring(1, pClientTag.length) + '/' + startDate + '/' + endDate);
	};

	/**
	 * get articles by email and between two dates
	 * @return {Object} - Promise to return
	 */
	this.getArticlesByEmailBetweenDates = function(pEmail, pStartDate, pEndDate) {
		var date = new Date();
		var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
		if (lastDay.getDate()===pEndDate.getDate()) {
			var startDate = (pStartDate.getMonth() + 1) + '%2F' + pStartDate.getDate() + '%2F' + pStartDate.getFullYear();
			var endDate = (pEndDate.getMonth() + 2) + '%2F' + '01' + '%2F' + pEndDate.getFullYear();
		} else {
			var startDate = (pStartDate.getMonth() + 1) + '%2F' + pStartDate.getDate() + '%2F' + pStartDate.getFullYear();
			var endDate = (pEndDate.getMonth() + 1) + '%2F' + (pEndDate.getDate() + 1) + '%2F' + pEndDate.getFullYear();
		}
		
		return request.get(emailsHashURL + pEmail + '/' + startDate + '/' + endDate);
	};

	this.getArticlesByIds = function(pIdsArticles) {
		return request.get(baseUrl + '/api/articlesById/' + pIdsArticles);
	};
});