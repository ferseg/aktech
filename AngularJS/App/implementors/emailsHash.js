/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: emailsHash.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

var cachedMediaTypes = {};

var INT = 'Número entero';
var DECIMAL = 'Número decimal';
var MONEY = 'Moneda';
var DATE = 'Fecha';
var DATETIME = 'Fecha y hora';
var TIME = 'Tiempo';
var STRING = 'Texto';
var STRING_ARRAY = 'Lista de items';

module.exports = function(app){
	var emailsHashModel = app.models['emailsHash'];
	var articlesModel = app.models['articles'];
	var tagModel = app.models['tags'];
	var clientModel = app.models['clients'];
	var sectorModel = app.models['sectors'];
	var subscriptionDeliveriesModel = app.models['subscription-deliveries'];
	var spacesModel = app.models['spaces'];
	var mediaTypeModel = app.models['media-types'];
	var fieldsModel = app.models['fields'];
	var articlesVisibilityModel = app.models['articlesVisibility'];

	/**
	 * process article, call a method to process the tags of the article
	 * @param  {Object} pArticle - Article to process
	 * @return {Object} - promise to return
	 */
	var processArticles = function(pArticle, pSchedules) {

		var deferred = Q.defer();

		for(var key in pSchedules) {

			//porcessTagsTrademarks(pArticle.clientsTags, pSchedules, pArticle.sectorsTags)
			utils.processArticles(pArticle, pSchedules[key].trademarksTags, pSchedules[key].sectorsTags, key, app)
			.then(function(pTrademark) {
				deferred.resolve(pTrademark);
			})
			.catch(function(pError) {
				console.log(pError);
				throw pError;
			});

		}

		return deferred.promise;
	};

	var getMediaType = function(pTagSpace) {
		var findSpaces = Q.nbind(spacesModel.find, spacesModel);
		var findMediaTypeById = Q.nbind(mediaTypeModel.findById, mediaTypeModel);
		
		var mediaTypeAssigned = 0;
		var spacesToReturn = [];
		return findSpaces({tag: pTagSpace})
		.then(function(pSpace) {
			var deferred = Q.defer();
				
			if (cachedMediaTypes[pSpace[0].mediaType.toString()] == null) {
				findMediaTypeById(pSpace[0].mediaType.toString())
				.then(function(pMediaType) {
					cachedMediaTypes[pSpace[0].mediaType.toString()] = pMediaType;
					
					deferred.resolve(pMediaType);
				}).catch(function(pError) {
					throw pError;
				});
			} else {
				deferred.resolve(cachedMediaTypes[pSpace[0].mediaType.toString()]);
			}
			return deferred.promise;
		}).catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
		});
	};

	return {

		/**
		 * READ a list of emailsHash
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getEmailsHash: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var emailsHash = Q.nbind(emailsHashModel.find, emailsHashModel);
				return emailsHash()
				.then(function(pEmailsHash) {
					return new Response(pEmailsHash);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * get articles by email and client between range of dates
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getArticlesByEmailAndClientBetweenDates: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var emailsHash = Q.nbind(emailsHashModel.find, emailsHashModel);
				var findArticleById = Q.nbind(articlesModel.findById, articlesModel);
				var subscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
				var cachedArticles = {};
				var articlesAssigned = 0;
				var articlesToReturn = [];
				var subscriptionsTags = {
					trademarksTags: [],
					sectorsTags: [],
					spacesTags: []
				};

				var topArticles = [];
				var topArticlesCache = {};
				var startDate = utils.dateConvert(pRequest.params.startDate); //MM/DD/YYYY
				var endDate = utils.dateConvert(pRequest.params.endDate);
				var schedules = {};
				var deferred = Q.defer();

				emailsHashModel.find(
					{email: pRequest.params.email, "schedules.clientTag": pRequest.params.clientTag }, //query
					'schedules.clientTag schedules.sectorsTags schedules.trademarksTags', //projection
					function(err, pHashesSchedules){
						if(err) {
							exceptionsLogger.logError(app, err);
							deferred.reject(new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR));
						}

						//Process the schedules just one time
						if(pHashesSchedules != null && pHashesSchedules.length!==0){
							pHashesSchedules.forEach(function(pEmailHash) {
								pEmailHash.schedules.forEach(function(pSchedule){
									if (!schedules[pSchedule.clientTag]) {
										schedules[pSchedule.clientTag] = {
											trademarksTags: [],
											sectorsTags: []
										};
									}

									pSchedule.trademarksTags.forEach(function (pTrademarkTag) {
										if (schedules[pSchedule.clientTag].trademarksTags.indexOf(pTrademarkTag)==-1) {
											schedules[pSchedule.clientTag].trademarksTags.push(pTrademarkTag);
										}
									});

									pSchedule.sectorsTags.forEach(function (pSectorTag) {
										if (schedules[pSchedule.clientTag].sectorsTags.indexOf(pSectorTag)==-1) {
											schedules[pSchedule.clientTag].sectorsTags.push(pSectorTag);
										}
									});
								}); 
							});

							//Instead of getting the emailHashModel, get the visibility
							articlesVisibilityModel.find(
								{dateArticle: {"$gte": startDate, "$lt": endDate}, 
									"clientTag": pRequest.params.clientTag},
								'_id idArticle',
								function(err, pVisibilities){
									if(err) {
										console.log(err);
										exceptionsLogger.logError(app, err);
										deferred.reject(new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR));
									}
									if (pVisibilities != null && pVisibilities.length!==0){
										pVisibilities.forEach(function(pVisibility){
											if (!topArticlesCache[pVisibility.idArticle]) {
												topArticlesCache[pVisibility.idArticle] = pVisibility;
												topArticles.push(pVisibility);
											}
										});

										subscriptionsDeliveries({ email: pRequest.params.email, enabled: true })
										.then(function(pSubscriptionDeliveries) {

											topArticles.forEach(function(pNote, pIndex) {

												var note = pNote._doc ? pNote._doc : pNote;
											
												if (cachedArticles[note.idArticle] == null) {
													findArticleById(note.idArticle)
													.then(function(pArticle) {
														if(!pArticle) {
															articlesAssigned++;
															if (articlesAssigned === topArticles.length) {
																for (var index = 0; index<articlesToReturn.length; index++) {
																	if(!articlesToReturn[index]) {
																		articlesToReturn.splice(index, 1);
																		index--;
																	}
																}
																deferred.resolve(new Response({
																	articles: articlesToReturn,
																	tags: schedules
																}));
															}
														} else {

															cachedArticles[note.idArticle] = pArticle;

															processArticles(pArticle, schedules)
															.then(function(pTrademarks) {

																note.note = pArticle;
																note.trademarksArray = pTrademarks;

																articlesToReturn[pIndex] = note;
																articlesAssigned++;

																if (articlesAssigned === topArticles.length) {
																	for (var index = 0; index<articlesToReturn.length; index++) {
																		if(!articlesToReturn[index]) {
																			articlesToReturn.splice(index, 1);
																			index--;
																		}
																	}
																	deferred.resolve(new Response({
																		articles: articlesToReturn,
																		tags: schedules
																	}));
																}
															}).catch(function(pError) {
																console.log(pError);
																throw pError;
															});
														}
													})
													.catch(function(pError) {
														console.log(pError);
														throw pError;
													});
												} else {
													articlesAssigned++;
													if (articlesAssigned === topArticles.length) {
														for (var index = 0; index<articlesToReturn.length; index++) {
															if(!articlesToReturn[index]) {
																articlesToReturn.splice(index, 1);
																index--;
															}
														}
														deferred.resolve(new Response({
															articles: articlesToReturn,
															tags: schedules
														}));
													}
												}
											});
											return deferred.promise;
										}).catch(function(pError) {
											exceptionsLogger.logError(app, pError);
											return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
										});
									}
									else{
										deferred.resolve(new Response([]));
									}
							});

							
						}
						else{
							deferred.resolve(new Response([]));
						}
					}
				);

				return deferred.promise;
			}
		},

		/**
		 * get articles by ids
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getArticlesByIds: function (pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getArticles = Q.nbind(articlesModel.find, articlesModel);
				var cachedArticles = {};
				var articlesAssigned = 0;
				var articlesToReturn = [];

				var idsArticles = pRequest.params.idsArticles.split(',');

				return getArticles({_id: {$in: idsArticles}},null,{sort: { 'date':-1 }})
				.then(function(pArticles) {

					//console.log(pArticles);

					var deferred = Q.defer();
							
					pArticles.forEach(function(pNote, pIndex) {

						var note = pNote.toJSON();
						
						if (cachedArticles[note._id] == null) {
							
							cachedArticles[note._id] = note;

							articlesToReturn[pIndex] = {
								note:note
							};

							articlesAssigned++;

							if (articlesAssigned === pArticles.length) {
								deferred.resolve(new Response({
									articles: articlesToReturn
								}));
							}
						} else {
							articlesAssigned++;
							if (articlesAssigned === pArticles.length) {
								deferred.resolve(new Response({
									articles: articlesToReturn
								}));
							}
						}
					});
					return deferred.promise;
				})
				.catch(function(pError) {
					console.log('ERROR');
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * get articles between range of dates
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getAllArticlesBetweenDates: function (pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getArticles = Q.nbind(articlesModel.find, articlesModel);
				var cachedArticles = {};
				var articlesAssigned = 0;
				var articlesToReturn = [];

				var startDate = utils.dateConvert(pRequest.params.startDate); //MM/DD/YYYY
				var endDate = utils.dateConvert(pRequest.params.endDate);

				return getArticles({"date": {"$gte": startDate, "$lt": endDate}},null,{sort: { 'date':-1 }})//, limit: pRequest.params.maxNumberNotes})
				.then(function(pArticles) {

					if(pArticles.length!==0) {
						var deferred = Q.defer();
								
						pArticles.forEach(function(pNote, pIndex) {

							var note = pNote.toJSON();
							
							if (cachedArticles[note._id] == null) {
								
								cachedArticles[note._id] = note;

								articlesToReturn[pIndex] = {
									note:note
								};

								articlesAssigned++;

								if (articlesAssigned === pArticles.length) {
									deferred.resolve(new Response({
										articles: articlesToReturn
									}));
								}
							} else {
								articlesAssigned++;
								if (articlesAssigned === pArticles.length) {
									deferred.resolve(new Response({
										articles: articlesToReturn
									}));
								}
							}
						});
						return deferred.promise;
					} else {
						return new Response([]);
					}
				})
				.catch(function(pError) {
					console.log('ERROR');
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single emailHash
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createEmailHash: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var emailHash = new emailsHashModel({
					email: pRequest.body.tag,
					notes: pRequest.body.emails
				});

				return Q.when(emailHash.save())
				.then(function() {
					return new Response(emailHash);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single emailHash
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateEmailHash: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return Q.when(emailsHashModel.update({ email : pRequest.params.email }, 
					{$set: {notes: pRequest.body.notes}}).exec())
				.then(function(pResult){
					return new Response(pResult);
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
		}
	};
};