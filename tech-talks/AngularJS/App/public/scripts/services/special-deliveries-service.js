/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: special-deliveries-service.js
 */

'use strict';

angular.module('CoesApp').service('SpecialDeliveriesService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var specialDeliveryURL = baseUrl + '/api/specialdeliveries/';

	/**
	 * get all the special deliveries
	 * @return {Object} - Promise to return
	 */
	this.getAllSpecialDeliveries = function() {
		return request.get(specialDeliveryURL);
	};

	this.sendSpecialDelivery = function(pUser, pEmails, pArticles, pSectors, pClient, pTrademarks) {
		var specialDelivery = {
			userEmail: pUser,
			emailsToSend: pEmails,
			articles: pArticles,
			sectors: pSectors,
			client: pClient,
			trademarks: pTrademarks
		};
		return request.post(specialDeliveryURL, specialDelivery);
	};
});