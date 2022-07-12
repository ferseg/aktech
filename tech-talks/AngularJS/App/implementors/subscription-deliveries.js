/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: subscription-deliveries.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var subscriptionDeliveriesModel = app.models['subscription-deliveries'];
	var emailsHashModel = app.models['emailsHash'];
	var supervisorControlModel = app.models['supervisor-control'];
	return {

		/**
		 * READ a list of subcription deliveries of a subscription
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSubscriptionsDeliveries: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var subscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
				return subscriptionsDeliveries({ subscriptionId: pRequest.params.idSubscripcion }, 
						null, {
							sort: { 'enabled':-1, 'email':1 }
						})
				.then(function(pSubscriptionDeliveries) {
					return new Response(pSubscriptionDeliveries);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a single subcription delivery by ID
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSubscriptionDeliveryById: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSubscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
				return getSubscriptionsDeliveries({ _id: pRequest.params.id })
				.then(function(pSubscriptionDeliveries) {
					return new Response(pSubscriptionDeliveries);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single subscriptions delivery
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createSubscriptionDelivery: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var subscriptionsDelivery;
				subscriptionsDelivery = new subscriptionDeliveriesModel({
					subscriptionId: pRequest.body.subscriptionId,
					email: pRequest.body.email,
					tagMediaType: pRequest.body.tagMediaType,
					scheduleId: pRequest.body.scheduleId,
					tagSectors: pRequest.body.tagSectors,
					tagsTrademarks: pRequest.body.tagsTrademarks,
					tagsCountries: pRequest.body.tagsCountries,
					enabled: pRequest.body.enabled
				});
				return Q.when(subscriptionsDelivery.save())
				.then(function(pResult) {
					return new Response(subscriptionsDelivery);
				})
				.catch(function(pError) {
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(app, pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},

		/**
		 * UPDATE a single subscriptions delivery
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateSubscriptionDelivery: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var subscriptionsDelivery = new subscriptionDeliveriesModel({
					subscriptionId: pRequest.body.subscriptionId,
					email: pRequest.body.email,
					tagMediaType: pRequest.body.tagMediaType,
					scheduleId: pRequest.body.scheduleId,
					tagSectors: pRequest.body.tagSectors,
					tagsTrademarks: pRequest.body.tagsTrademarks,
					tagsCountries: pRequest.body.tagsCountries,
					enabled: pRequest.body.enabled
				});
				return Q.when(subscriptionDeliveriesModel.update({ _id : pRequest.params.id }, 
					{$set: {enabled: false, modifiedBy: pRequest.user.username, modifiedDate: new Date()}}).exec())
				.then(function(pResult){
					return Q.when(subscriptionsDelivery.save())
					.then(function(err, deliverySaved, count) {

						//update supervisor controls 
						supervisorControlModel.find(
						    {"idsSubscriptionsDeliveries": pRequest.params.id, cancel: false, aprooved: false, sended: false},
						    '_id',
						    function(err, pSupervisors){
						        pSupervisors.forEach(function(pSupervisor){
						        	supervisorControlModel.update(
						        		{"_id": pSupervisor.id, "idsSubscriptionsDeliveries": pRequest.params.id}, 
						        		{$set: {"idsSubscriptionsDeliveries.$": subscriptionsDelivery.id}},
						        		function(err){
						        			if(err) {
						        				exceptionsLogger.logError(app, err);
												console.log(err);
											}
						        		}
						        	);
						        });
						    }
						);

						if(pRequest.body.enabled) {
							//Update email hashes 
							emailsHashModel.find(
								{"schedules.idSchedule": pRequest.params.id},
								'_id',
								function(err, pHashes){
									pHashes.forEach(function(pHash){
										emailsHashModel.update(
											{"_id": pHash.id, "schedules.idSchedule": pRequest.params.id},
											{$set: 	{"schedules.$.idSchedule": subscriptionsDelivery.id,
													 "schedules.$.sectorsTags": subscriptionsDelivery.tagSectors,
													 "schedules.$.trademarksTags": subscriptionsDelivery.tagsTrademarks}},
											function(err){
												if(err) {
							        				exceptionsLogger.logError(app, err);
													console.log(err);
												}
											}
										);
									});
								});
						} else {
							//Delete email hashes 
							emailsHashModel.find(
								{"schedules.idSchedule": pRequest.params.id},
								'_id',
								function(err, pHashes){
									pHashes.forEach(function(pHash){
										emailsHashModel.update(
											{"_id": pHash.id, "schedules.idSchedule": pRequest.params.id},
											{$pull: {"schedules": {"idSchedule": pRequest.params.id}}},
											{ multi: true },
											function(err){
												if(err) {
							        				exceptionsLogger.logError(app, err);
													console.log(err);
												}
											}
										);
									});
								});
						}
						return new Response(subscriptionsDelivery);
					});
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},

		/**
		 * DELETE a single schedule
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {[type]}     [description]
		 */
		deleteSubscriptionDelivery: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var removeSubscriptionDelivery = Q.nbind(subscriptionDeliveriesModel.remove, subscriptionDeliveriesModel);
				return removeSubscriptionDelivery( { _id: pRequest.params.id} )
				.then(function() {
					return new Response(app.constants.SUCCESS_DELETE);
				})
				.catch(function(pError) {
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		}
	};
};