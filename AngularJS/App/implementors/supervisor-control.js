/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: supervisor-control.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var supervisorControlModel = app.models['supervisor-control'];
	var subscriptionDeliveriesModel = app.models['subscription-deliveries'];
	var scheduleModel = app.models['schedules'];
	var subscriptionModel = app.models['subscriptions'];
	var clientModel = app.models['clients'];

	/**
	 * Updates the supervisor control
	 * @param  {Object} pOldSpace  Old space to update
	 * @param  {Object} pRequest   Express Request object
	 * @return {Object}            Returns a promise that updates the sector
	 */
	var updateASupervisorControl = function(pRequest) {
		var updatedSupervisorControl = 
		{
			datetime: pRequest.body.datetime,
			timeInsertion: pRequest.body.timeInsertion,
			timeAprooved: pRequest.body.timeAprooved,
			supervisor: pRequest.body.supervisor,
			aprooved: pRequest.body.aprooved,
			sended: pRequest.body.sended,
			articles: pRequest.body.articles,
			cancel: pRequest.body.cancel
		};
		return Q(supervisorControlModel.update({ _id : pRequest.params.id }, { $set: updatedSupervisorControl }).exec());
	};

	return {
		
		/**
		 * READ a list of supervisor controls
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSupervisorsControl: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSupervisorsControl = Q.nbind(supervisorControlModel.find, supervisorControlModel);
				var supervisorControl = {};
				var deferred = Q.defer();
				
				getSupervisorsControl({}, null, {sort: {'datetime':-1}, limit: 30})
				.then(function(pSupervisorsControls) {
					//return new Response(pSupervisorsControls);
					if(!pSupervisorsControls.length) {
						deferred.resolve(new Response([]));
					}
					var supervisorsControlProcessed = 0;
					pSupervisorsControls.forEach(function(pSupervisorControl) {
						var actualId = pSupervisorControl._id.toString();
						supervisorControl[actualId] = {
							aprooved: pSupervisorControl.aprooved,
							articles: pSupervisorControl.articles,
							datetime: pSupervisorControl.datetime,
							sended: pSupervisorControl.sended,
							supervisor: pSupervisorControl.supervisor,
							timeInsertion: pSupervisorControl.timeInsertion,
							timeAprooved: pSupervisorControl.timeAprooved,
							cancel: pSupervisorControl.cancel,
							subscriptionsDeliveries: {}
						};

						var subscriptionsDeliveriesProcessed = 0;
						
						if (pSupervisorControl.idsSubscriptionsDeliveries.length===0) {
							supervisorsControlProcessed++;
							if(supervisorsControlProcessed===pSupervisorsControls.length) {
								deferred.resolve(new Response(supervisorControl));
							}
						} else {
							pSupervisorControl.idsSubscriptionsDeliveries.forEach(function(pIdSubscriptionDelivery) {
								var idSubscriptionDelivery = pIdSubscriptionDelivery.toString();

								var getSubscriptionDeliveryById = Q.nbind(subscriptionDeliveriesModel.findById, subscriptionDeliveriesModel);
								getSubscriptionDeliveryById(idSubscriptionDelivery)
								.then(function(pSubscriptionDelivery) {

									var getSchedules = Q.nbind(scheduleModel.findById, scheduleModel);
									getSchedules(pSubscriptionDelivery.scheduleId)
									.then(function(pSchedule) {

										var getSubscription = Q.nbind(subscriptionModel.findById, subscriptionModel);
										getSubscription(pSubscriptionDelivery.subscriptionId)
										.then(function(pSubscription) {

											var getClient = Q.nbind(clientModel.findById, clientModel);
											getClient(pSubscription.clientID)
											.then(function(pClient) {

												//var emails = pSubscriptionDelivery.email.map(function(x){return x.replace(/ /g, '');});
												supervisorControl[actualId].subscriptionsDeliveries[idSubscriptionDelivery] = {
													scheduleName: pSchedule.name,
													emails: pSubscriptionDelivery.email,
													client: pClient
												};

												subscriptionsDeliveriesProcessed++;
												if(subscriptionsDeliveriesProcessed===pSupervisorControl.idsSubscriptionsDeliveries.length) {
													supervisorsControlProcessed++;
													if(supervisorsControlProcessed===pSupervisorsControls.length) {
														deferred.resolve(new Response(supervisorControl));
													}
												}
											}).catch(function(pError) {
												throw utils.createError(app.constants.CODE_SERVER_ERROR, pError);
											});
										}).catch(function(pError) {
											throw utils.createError(app.constants.CODE_SERVER_ERROR, pError);
										});
									}).catch(function(pError) {
										throw utils.createError(app.constants.CODE_SERVER_ERROR, pError);
									});
								}).catch(function(pError) {
									throw utils.createError(app.constants.CODE_SERVER_ERROR, pError);
								});
							});
						}
					});
				})
				.catch(function(pError) {
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});

				return deferred.promise;
			}
		},

		/**
		 * UPDATE a single supervisor control
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateSupervisorControl: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return updateASupervisorControl(pRequest)
				.then(function(pSupervisorControl) {
					return new Response(app.constants.SUCCESS_UPDATE);
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