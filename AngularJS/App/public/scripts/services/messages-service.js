/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: messages-service.js
 */

'use strict';

angular.module('CoesApp').service('MessagesService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var messagesURL = baseUrl + '/api/messages/';

	this.getMessagesOfUser = function(pTag) {
		return request.get(messagesURL + '%23' + pTag.substr(1));
	};

	this.saveMessages = function(pMessage) {
		return request.post(messagesURL, pMessage);
	};

	this.updateMessages = function(pMessage) {
		return request.save(messagesURL + pMessage._id, pMessage);
	};
});