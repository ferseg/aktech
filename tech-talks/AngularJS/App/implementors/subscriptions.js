/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: subscriptions.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var subscriptionModel = app.models['subscriptions'];
	var subscriptionDeliveriesModel = app.models['subscription-deliveries'];
	var emailsHashModel = app.models['emailsHash'];
	var supervisorControlModel = app.models['supervisor-control'];
	return {

		/**
		 * READ a list of subscriptions of a client by idClient
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSubscriptions: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSubscriptions = Q.nbind(subscriptionModel.find, subscriptionModel);
				return getSubscriptions({ clientID: pRequest.params.idClient }, null, {sort: {'dateEnd':-1}})
				.then(function(pSubscriptions) {
					return new Response(pSubscriptions);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return pResponse.send(app.constants.CODE_SERVER_ERROR, pError);
				});
			}
		},

		/**
		 * CREATE a single subscription
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createSubscription: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var subscription;
				subscription = new subscriptionModel({
					dateStart: pRequest.body.dateStart,
					dateEnd: pRequest.body.dateEnd,
					enabled: pRequest.body.enabled,
					tagMediaType: pRequest.body.tagMediaType,
					tagNews: pRequest.body.tagNews,
					tagPublicity: pRequest.body.tagPublicity,
					tagSocialNetwork: pRequest.body.tagSocialNetwork,
					tagSectors: pRequest.body.tagSectors,
					tagsTrademarks: pRequest.body.tagsTrademarks,
					clientID: pRequest.body.clientID
				});
				return Q.when(subscription.save())
				.then(function() {
					return new Response(subscription);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return pResponse.send(app.constants.CODE_SERVER_ERROR, pError);
				});
			}
		},

		/**
		 * Updates a subscription
		 * @param  {Object} pRequest  Express request
		 * @param  {Object} pResponse Express response
		 * @return {Object} Response object
		 */
		updateSubscription: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var updatedSubscription = 
				{
					tagMediaType: pRequest.body.tagMediaType,
					tagNews: pRequest.body.tagNews,
					tagPublicity: pRequest.body.tagPublicity,
					tagSocialNetwork: pRequest.body.tagSocialNetwork,
					tagSectors: pRequest.body.tagSectors ? pRequest.body.tagSectors : [],
					tagsTrademarks: pRequest.body.tagsTrademarks ? pRequest.body.tagsTrademarks : []
				};
				return Q(subscriptionModel.update({ _id : pRequest.body._id }, { $set: updatedSubscription}).exec())
				.then(function(pData) {

					updatedSubscription.tagsTrademarks.push(pRequest.body.clientTag);
					//Update subscriptions deliveries, sectorsTags and trademarksTags
					var getSubscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
					getSubscriptionsDeliveries({ subscriptionId: pRequest.body._id })
					.then(function(pSubscriptionDeliveries) {
						pSubscriptionDeliveries.forEach(function(pSubscriptionDelivery) {
							var updateSubscriptionDelivery = {
								tagsTrademarks: [],
								tagSectors: [],
								tagMediaType: []
							};

							updateSubscriptionDelivery.tagsTrademarks = pSubscriptionDelivery.tagsTrademarks.filter(function(pTag) {
								return updatedSubscription.tagsTrademarks.indexOf(pTag) !== -1;
							});

							updateSubscriptionDelivery.tagSectors = pSubscriptionDelivery.tagSectors.filter(function(pTag) {
								return updatedSubscription.tagSectors.indexOf(pTag) !== -1;
							});

							updateSubscriptionDelivery.tagMediaType = pSubscriptionDelivery.tagMediaType.filter(function(pTag) {
								return updatedSubscription.tagMediaType.indexOf(pTag) !== -1;
							});

							Q.when(subscriptionDeliveriesModel.update({ _id : pSubscriptionDelivery._id }, 
								{$set: updateSubscriptionDelivery}).exec())
							.then(function(pResult){
								//update supervisor controls 
								supervisorControlModel.find(
								    {"idsSubscriptionsDeliveries": pSubscriptionDelivery._id, cancel: false, aprooved: false, sended: false},
								    '_id',
								    function(err, pSupervisors){
								        pSupervisors.forEach(function(pSupervisor){
								        	supervisorControlModel.update(
								        		{"_id": pSupervisor.id, "idsSubscriptionsDeliveries": pSubscriptionDelivery._id}, 
								        		{$set: {"idsSubscriptionsDeliveries.$": pSubscriptionDelivery._id}},
								        		function(err){
								        		}
								        	);
								        });
								    }
								);

								//Update email hashes 
								emailsHashModel.find(
									{"schedules.idSchedule": pSubscriptionDelivery._id},
									'_id',
									function(err, pHashes){
										pHashes.forEach(function(pHash){
											emailsHashModel.update(
												{"_id": pHash.id, "schedules.idSchedule": pSubscriptionDelivery._id},
												{$set: 	{"schedules.$.idSchedule": pSubscriptionDelivery._id,
														 "schedules.$.sectorsTags": pSubscriptionDelivery.tagSectors,
														 "schedules.$.trademarksTags": pSubscriptionDelivery.tagsTrademarks}},
												function(err){
												}
											);
										});
									});
							}).catch(function(pError) {
								exceptionsLogger.logError(app, pError);
								console.log(pError + ' in update subscription deliveries, 1');
							});
						});
					}).catch(function(pError) {
						exceptionsLogger.logError(app, pError);
						console.log(pError + ' in update subscription deliveries, 2');
					});

					return new Response(pData);
				}).catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};