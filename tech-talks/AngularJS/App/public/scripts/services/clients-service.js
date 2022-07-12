/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: clients-service.js
 */

'use strict';

angular.module('CoesApp').service('ClientsService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var clientsURL = baseUrl + '/api/clients/';
	var subscriptionsURL = baseUrl + '/api/subscriptions/';
	var subscriptionsDeliveriesURL = baseUrl + '/api/subscription-deliveries/';
	var schedulesURL = baseUrl + '/api/schedules/';
	var sectorsURL = baseUrl + '/api/sectors';

	this.getClients = function() {
		return request.get(clientsURL);
	};

	this.getClient = function(pClientTag) {
		return request.get(clientsURL+encodeURIComponent(pClientTag));
	};

	this.saveClient = function(pClient) {
		return request.post(clientsURL, pClient);
	};

	this.updateClient = function(pClient) {
		return request.save(clientsURL + pClient._id, pClient);
	};

	this.saveTrademark = function(pClientId, pTrademark) {
		// Save new trademark enpoint: /api/clients/:id/trademarks
		return request.post(clientsURL+pClientId+'/trademarks', pTrademark);
	};

	this.saveProduct = function(pClientId, pTrademarkTag, pProduct) {
		// Save new product /api/clients/:id/trademarks/:tag/products
		var encodedUrl = clientsURL+pClientId+'/trademarks/'+encodeURIComponent(pTrademarkTag)+'/products';
		return request.post(encodedUrl, pProduct);
	};

	this.getSubscriptions = function(pClientId) {
		return request.get(subscriptionsURL+pClientId);
	};

	this.saveSubscription = function(pSubscription) {
		return request.post(subscriptionsURL, pSubscription);
	};

	this.getSchedules = function() {
		return request.get(schedulesURL);
	};

	this.getSubscriptionsDeliveries = function(pIdSubscription) {
		return request.get(subscriptionsDeliveriesURL + pIdSubscription);
	};

	this.updateSubscriptionDelivery = function(pSubscriptionDelivery, pId) {
		return request.save(subscriptionsDeliveriesURL + pId, pSubscriptionDelivery);
	};

	this.saveSubscriptionDelivery = function(pSubscriptionDelivery) {
		return request.post(subscriptionsDeliveriesURL, pSubscriptionDelivery);
	};

	this.getSectors = function() {
		return request.get(sectorsURL);
	};

	this.updateSubscription = function(pSubscription, pClientTag) {
		pSubscription.clientTag = pClientTag;
		return request.save(subscriptionsURL, pSubscription);
	};

	this.updateTrademark = function(pClientId, pTrademark) {
		return request.save(clientsURL+pClientId+'/trademarks/'+encodeURIComponent(pTrademark.tag), pTrademark);
	};

	this.updateProduct = function(pClientId, pTrademarkTag, pProduct) {
		return request.save(
			clientsURL+pClientId+'/trademarks/'+encodeURIComponent(pTrademarkTag)+'/products/'+encodeURIComponent(pProduct.tag),
			pProduct);
	};
});

