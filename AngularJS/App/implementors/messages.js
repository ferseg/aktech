/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: messages.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var messageModel = app.models['messages'];

	return {
		/**
		 * Return all the messages
		 */
		getMessages: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var query = Q.nbind(messageModel.find, messageModel);
				return query()
				.then(function(pMessages) {
					return new Response(pMessages);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * Return all the messages sends to a user
		 */
		getMessagesOfUser: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var query = Q.nbind(messageModel.find, messageModel);
				return query({
					$or: [
						{ 'sender':pRequest.params.tag },
	          			{ $or:[{'receiver':pRequest.params.tag},{'receiver':'#todos'}] }
	          		]
				}, null, {
					sort: { /*'wasRead':-1, */'createdDate':-1 },
					limit: 30
				})
				.then(function(pMessages) {
					return new Response(pMessages);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * Saves a new message
		 */
		createMessage: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var currentdate = utils.getCurrentDateTime();
				var newMessage= new messageModel({
					sender: pRequest.body.sender,
					receiver: pRequest.body.receiver,
					message: pRequest.body.message,
					wasSend: true,
					wasRead: pRequest.body.wasRead,
					createdDate: currentdate
				});
				return Q.when(newMessage.save())
				.then(function() {
					return new Response(newMessage);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single message
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateMessage: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var message = {
					sender: pRequest.body.sender,
					receiver: pRequest.body.receiver,
					message: pRequest.body.message,
					wasSend: pRequest.body.wasSend,
					wasRead: true,
					createdDate: pRequest.body.createdDate
				};
				var updateMessage = Q.nbind(messageModel.findByIdAndUpdate, messageModel);
				return updateMessage(pRequest.params.id, message)
				.then(function() {
					return new Response(message);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};