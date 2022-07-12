/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: request.js
 */

'use strict';

//Factory to manage the users operations to the web server
angular.module('CoesApp').factory('request', ['$http', '$q', function($http, $q) {
	return {
		/**
		 * function to get response from the url pass by parameter
		 * @param  {String} pUrl - Url to make the request
		 * @return {Object} Return the promise object
		 */
		get: function(pUrl){
			var deferred = $q.defer();

			$http({
				url: pUrl,
				method: 'GET',
				withCredentials: true
			}).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(status, data);
			});
			//return the pormise object
			return deferred.promise;
		},
		/**
		 * function to post a new document in the database
		 * @param  {String} pUrl - url available to make a post
		 * @param  {Object} pData - Object to save in the database
		 * @return {Object} Return the promise object
		 */
		post: function(pUrl, pData){
			var deferred = $q.defer();

			$http({
				url: pUrl,
				method: 'POST',
				withCredentials: true,
				data: pData
			}).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(data, status);
			});
			//return the pormise object
			return deferred.promise;
		},
		/**
		 * function to update document of collection in the database via request
		 * @param  {String} pUrl - url available ti make the put request
		 * @param  {Object} pData - object to update the document in the collection
		 * @return {Object} Return the promise object
		 */
		save: function(pUrl, pData) {
			var deferred = $q.defer();

			$http({
				url: pUrl,
				method: 'PUT',
				withCredentials: true,
				data: pData
			}).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(data, status);
			});
			//return the pormise object
			return deferred.promise;
		},
		/**
		 * function to delete document form collection in the database via request
		 * @param  {String} pUrl - url available to delete document from db
		 * @return {Object} Return the promise object
		 */
		delete: function(pUrl){
			var deferred = $q.defer();

			$http({
				url: pUrl,
				method: 'DELETE',
				withCredentials: true
			}).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(data, status);
			});
			//return the pormise object
			return deferred.promise;
		}
		/*
		query: function() {
			return $http.get(baseUrl); 
		},
		charge: function(card) {
			return $http.post(baseUrl + '/' + card.id, card, {params: {charge: true}});
		} */
	};
}]);