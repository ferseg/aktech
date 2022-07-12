/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: deliveries-programming.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var constants = require('../utils/coes-constants.js');
var exceptionsLogger = require('../utils/loggly.js');

var supervisorControlModel;
var emailsToSendModel;
var subscriptionDeliveriesModel;
var app;
var configuration;
var articlesVisibilityModel;

var WEB_FILE_TYPE; //= 'web';
var VIDEO_FILE_TYPE; //= 'video';
var IMAGE_FILE_TYPE; //= 'image';
var AUDIO_FILE_TYPE; //= 'audio';

var MONTH_NAMES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
var MONTH_COMPLETES_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
var DAYS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

/**
 * function to save in the db a hash tag
 * @param  {String} pTag - tag index to save
 * @param  {Array} pEmails - emails to save for the tag index
 * @param  {Object} pTagHashModel - model of mongoose to save in the db
 * @return {Object} - promise object to return
 */
var createTagHash = function (pTag, pEmails, pTagHashModel){
	var findHashTag = Q.nbind(pTagHashModel.find, pTagHashModel);
	var emails = pEmails;

	return findHashTag({tag: pTag})
	.then(function(pHashTag) {
		if(pHashTag.length!==0){
			var hashToUpdate = pHashTag[0];
			emails.forEach(function(pEmail) {
				if (hashToUpdate.emails.indexOf(pEmail) === -1) {
					hashToUpdate.emails.push(pEmail);
				}
			});
			
			return Q.when(pTagHashModel.update({ _id : hashToUpdate._id }, 
				{$set: {emails: hashToUpdate.emails}}).exec());
		} else {

			var tagHash = new pTagHashModel({
				tag: pTag,
				emails: pEmails
			});
			return Q.when(tagHash.save());
		}
	});
};

/**
 * process the tags trademarks for an article
 * @param  {Object} pSubscriptionDeliveriesModel - model of mongoose to query the db
 * @param  {Array} pTags - Tags to find in the db
 * @return {Object} - promise object to return
 */
var processTagsTrademarksArticle = function(pSubscriptionDeliveriesModel, pTags) {
	var emails = [];
	var promises = [];
	var tags = [];
	var deferred = Q.defer();

	pTags.forEach(function(pTag, pIndex){
		var subscriptionsDeliveries = Q.nbind(pSubscriptionDeliveriesModel.find, pSubscriptionDeliveriesModel);
		promises.push(subscriptionsDeliveries({ tagsTrademarks: pTag, enabled: true }, null, {}));
		tags.push(pTag);
	});

	Q.allSettled(promises)
	.then(function (results) {
		results.forEach(function (result) {
			var emailArray = [];
			if (result.state === "fulfilled") {
				var subscriptionDeliveries = result.value;
				subscriptionDeliveries.forEach(function(pSubscriptionDelivery) {
					if (emailArray.indexOf(pSubscriptionDelivery.email) === -1) {
						emailArray.push(pSubscriptionDelivery.email);
					}
				});
				emails.push(emailArray);
				deferred.resolve({emails: emails, tags:tags});
			} else {
				var reason = result.reason;
				console.log('FALLO');
				console.log(reason);
				deferred.reject(new Error(reason));
			}
		});
	});

	return deferred.promise;
};

/**
 * process the tags sectors for an article
 * @param{Object} pSubscriptionDeliveriesModel - model of mongoose to query the db
 * @param  {Array} pTags - Tags to find in the db
 * @return {Object} - promise object to return
 */
var processTagsSectorsArticle = function(pSubscriptionDeliveriesModel, pTags) {
	var emails = [];
	var promises = [];
	var tags = [];
	var deferred = Q.defer();

	pTags.forEach(function(pTag, pIndex){
		var subscriptionsDeliveries = Q.nbind(pSubscriptionDeliveriesModel.find, pSubscriptionDeliveriesModel);
		promises.push(subscriptionsDeliveries({ tagSectors: pTag, enabled: true }, null, {}));
		tags.push(pTag);
	});

	Q.allSettled(promises)
	.then(function (results) {
		results.forEach(function (result) {
			var emailArray = [];
			if (result.state === "fulfilled") {
				var subscriptionDeliveries = result.value;
				subscriptionDeliveries.forEach(function(pSubscriptionDelivery) {
					if (emailArray.indexOf(pSubscriptionDelivery.email) === -1) {
						emailArray.push(pSubscriptionDelivery.email);
					}
				});
				emails.push(emailArray);
				deferred.resolve({emails: emails, tags:tags});
			} else {
				var reason = result.reason;
				console.log('FALLO');
				console.log(reason);
				deferred.reject(new Error(reason));
			}
		});
	});

	return deferred.promise;
};

/**
 * process the tags of media types for an article
 * @param  {Object} pSubscriptionDeliveriesModel - model of mongoose to query the db
 * @param  {Array} pTags - Tags to find in the db
 * @return {Object} - promise object to return
 */
var processTagsTrademarksMediaTypes = function(pSubscriptionDeliveriesModel, pTags) {
	var emails = [];
	var promises = [];
	var tags = [];
	var deferred = Q.defer();

	pTags.forEach(function(pTag, pIndex){
		var subscriptionsDeliveries = Q.nbind(pSubscriptionDeliveriesModel.find, pSubscriptionDeliveriesModel);
		promises.push(subscriptionsDeliveries({ tagMediaType: pTag, enabled: true }, null, {}));
		tags.push(pTag);
	});

	Q.allSettled(promises)
	.then(function (results) {
		results.forEach(function (result) {
			var emailArray = [];
			if (result.state === "fulfilled") {
				var subscriptionDeliveries = result.value;
				subscriptionDeliveries.forEach(function(pSubscriptionDelivery) {
					if (emailArray.indexOf(pSubscriptionDelivery.email) === -1) {
						emailArray.push(pSubscriptionDelivery.email);
					}
				});
				emails.push(emailArray);
				deferred.resolve({emails: emails, tags:tags});
			} else {
				var reason = result.reason;
				console.log('FALLO');
				console.log(reason);
				deferred.reject(new Error(reason));
			}
		});
	});

	return deferred.promise;
};

/**
 * function to build the tags hash in the db
 * @param  {Object} app - reference of the context
 * @param  {Object} pArticle - Article saved in the db
 * @return {Object} - promise object to return
 */
exports.processArticle = function(pApp, pArticle) {
	app = pApp;
	var subscriptionDeliveriesModel = app.models['subscription-deliveries'];
	var spacesModel = app.models['spaces'];
	var mediaTypeModel = app.models['media-types'];
	var tagsHashModel = app.models['tagsHash'];

	var findSpace = Q.nbind(spacesModel.find, spacesModel);
	var findMediaTypeById = Q.nbind(mediaTypeModel.findById, mediaTypeModel);

	var deferred = Q.defer();

	
	processTagsTrademarksArticle(subscriptionDeliveriesModel, pArticle.clientsTags)
	.then(function (pEmails) {
		pEmails.emails.forEach(function(pEmail, pIndex) {
			createTagHash(pEmails.tags[pIndex], pEmail, tagsHashModel);
		});
	})
	.catch(function(pError){
		exceptionsLogger.logError(app, pError);
		console.log('ERROR');
		console.log(pError);
	});

	processTagsSectorsArticle(subscriptionDeliveriesModel, pArticle.sectorsTags)
	.then(function (pEmails) {
		pEmails.emails.forEach(function(pEmail, pIndex) {
			createTagHash(pEmails.tags[pIndex], pEmail, tagsHashModel);
		});

		deferred.resolve(pEmails);
	})
	.catch(function(pError){
		exceptionsLogger.logError(app, pError);
		console.log('ERROR');
		console.log(pError);
	});

	findSpace({ tag: pArticle.tagSpace }, null, {})
	.then(function(pSpace) {
		findMediaTypeById(pSpace[0].mediaType)
		.then(function(pMediaType) {
			processTagsTrademarksMediaTypes(subscriptionDeliveriesModel, [pMediaType.tag])
			.then(function (pEmails) {
				pEmails.emails.forEach(function(pEmail, pIndex) {
					createTagHash(pEmails.tags[pIndex], pEmail, tagsHashModel);
				});
			})
			.catch(function(pError){
				exceptionsLogger.logError(app, pError);
				console.log('ERROR');
				console.log(pError);
			});
		})
		.catch(function(pError){
			exceptionsLogger.logError(app, pError);
			console.log('ERROR');
			console.log(pError);
		});
	})
	.catch(function(pError) {
		exceptionsLogger.logError(app, pError);
		console.log('ERROR DE AFUERA');
		console.log(pError);
	});

	return deferred.promise;
};

updateEmailsToSend = function (pSupervisorControl, pEmails, pIdEmailsToSend) {
	var emailsUpdate = [];
	for (var email in pEmails) {
		pEmails[email].email = email;
		emailsUpdate.push(pEmails[email]);
	}

	var updatedEmailToSend = {
		supervisorControl: pSupervisorControl,
		emails: emailsUpdate,
		sended: false
	};
	Q(emailsToSendModel.update({ _id : pIdEmailsToSend }, { $set: updatedEmailToSend }).exec())
	.then(function(pEmails) {
	}).catch(function(pError) {
		exceptionsLogger.logError(app, pError);
		console.log(pError);
	});;
}

/**
 * update a supervisor control in the db
 * @param  {Array} pSubscriptionDeliveries - subscription devliveries to track in the supervisor control
 * @return {Object} - promise object
 */
var updateSupervisorControl = function(pSupervisorControl, pIdArticle) {
	var deferred = Q.defer();

	supervisorControlModel.update(
		{_id: pSupervisorControl._id, articles: {$ne: pIdArticle.toString()}},
		{$push: { articles :  pIdArticle.toString() }},
		{}, 
		function(err,doc) {
			if(err) {
				exceptionsLogger.logError(app, err);
				console.log(err);
				deferred.reject(err);
			}

			var getSupervisorsControlById = Q.nbind(supervisorControlModel.findById, supervisorControlModel);

			getSupervisorsControlById(pSupervisorControl._id)
			.then(function(pSupervisor) {
				deferred.resolve(pSupervisor);
			}).catch(function(pError) {
				exceptionsLogger.logError(app, pError);
				console.log(pError);
				deferred.reject(pError);
			});
		});

	return deferred.promise;
};

/**
 * calculate the differences between the acutal minute and the schedule minute
 * @param  {Int} pMinutes        the schedule minute
 * @param  {Int} pCurrentMinutes the actual minute
 * @return {Int}                 difference between minutes
 */
getWeigthMinutes = function(pMinutes, pCurrentMinutes) {
	if(pMinutes>pCurrentMinutes) {
		return (pMinutes - pCurrentMinutes)/60;
	} else if (pMinutes<pCurrentMinutes) {
		return ((pMinutes+60) - pCurrentMinutes)/60;
	} else {
		return 0;
	}
};

/**
 * calculate the difference between tha actual hour and the schedule hour
 * @param  {Int} pHour        Schedule hour
 * @param  {Int} pCurrentHour Current hour
 * @return {Int}              difference between hours
 */
getWeigthHour = function(pHour, pCurrentHour) {
	if(pHour>pCurrentHour) {
		return (pHour - pCurrentHour);
	} else if (pHour<pCurrentHour){
		return ((pHour+24) - pCurrentHour);
	} else {
		return 0;
	}
};

/**
 * calculate the weigth of the schedule
 * @param  {Object} pSchedule Schedule object
 * @return {Number}           the min value of the schedule
 */
var getWeigth = function(pSchedule) {
	var min;

	var currentdate = new Date();
	var currentDay = DAYS[currentdate.getDay()];

	pSchedule.programming.forEach(function(pDay){
		var weight = 0;
		var indexDay = DAYS.indexOf(pDay.day);

		var tokens = pDay.hour.split(":");
		var hour = parseInt(tokens[0]);
		var minutes = parseInt(tokens[1]);

		//si existe el dia en modo texto
		if(indexDay!==-1) {
			//si es el mismo dia
			if (indexDay === currentdate.getDay()) {
				weight += 0;
				weight += getWeigthHour(hour, currentdate.getHours());
				weight += getWeigthMinutes(minutes, currentdate.getMinutes());
				if((hour===currentdate.getHours())&&(currentdate.getMinutes()>minutes)) {
					weight += 24;
				}
			//si es un/unos dias despues en orden de semana
			} else if (currentdate.getDay() < indexDay) {
				weight += (indexDay - currentdate.getDay())*24;
				weight += getWeigthHour(hour, currentdate.getHours());
				weight += getWeigthMinutes(minutes, currentdate.getMinutes());
			//si es un/unos dias "antes" en orden de semana
			} else {
				weight += ((indexDay+7) - currentdate.getDay())*24;
				weight += getWeigthHour(hour, currentdate.getHours());
				weight += getWeigthMinutes(minutes, currentdate.getMinutes());
			}
		//el dia es numerico o caso especial de fin de mes
		} else {
			//si es fin de mes
			if (pDay.day === '#fin-de-mes') {
				var lastDay = new Date(currentdate.getFullYear(), currentdate.getMonth()+1, 0).getDate();
				//si es el mismo dia
				if(currentdate.getDate()===lastDay) {
					weight +=0;
					weight += getWeigthHour(hour, currentdate.getHours());
					weight += getWeigthMinutes(minutes, currentdate.getMinutes());
					if((hour===currentdate.getHours())&&(currentdate.getMinutes()>minutes)) {
						weight += 24;
					}
				//si no, pues debe ser menor, ya que se comparo contra el ultimo dia del mes
				} else {
					weight += (lastDay - currentdate.getDate())*24;
					weight += getWeigthHour(hour, currentdate.getHours());
					weight += getWeigthMinutes(minutes, currentdate.getMinutes());
				}
			//es numerico
			} else {
				var dayNumber = parseInt(pDay.day);
				//si es el mismo dia
				if(dayNumber===currentdate.getDate()) {
					weight +=0;
					weight += getWeigthHour(hour, currentdate.getHours());
					weight += getWeigthMinutes(minutes, currentdate.getMinutes());
					if((hour===currentdate.getHours())&&(currentdate.getMinutes()>minutes)) {
						weight += 24;
					}
				//si es un/unos dias despues
				} else if (currentdate.getDate() < dayNumber) {
					weight += (currentdate.getDate() - dayNumber)*24;
					weight += getWeigthHour(hour, currentdate.getHours());
					weight += getWeigthMinutes(minutes, currentdate.getMinutes());
				//si es un/unos dias "antes" en orden de semana
				} else {
					weight += ((dayNumber+7) - currentdate.getDate())*24;
					weight += getWeigthHour(hour, currentdate.getHours());
					weight += getWeigthMinutes(minutes, currentdate.getMinutes());
				}
			}
		}

		if(!min) {
			min = weight;
		} else if(min>weight) {
			min = weight;
		}
	});

	return min;
};

/**
 * get the next schedule to send to specific user
 * @param  {Object} pEmail Object with email, subscription
 * @return {Object}        return the nearest delivery for the email
 */
var getNextSchedule = function (pEmail) { 
	var deferred = Q.defer();

	var min;
	var nextSchedule;

	var schedulesProcessed = 0;
	
	pEmail.schedules.forEach(function(pSchedule) {
		//check for pending controls
		var getSupervisorsControl = Q.nbind(supervisorControlModel.find, supervisorControlModel);
		getSupervisorsControl({sended: false, cancel: false, idsSubscriptionsDeliveries: pSchedule.idSchedule})
		.then(function(pSupervisor) {
			//if is pending a supervisor control
			if (pSupervisor.length!==0) {
				min = -1;
				nextSchedule = pSchedule;
				deferred.resolve(nextSchedule);
			} else {
				pSchedule.weight = getWeigth(pSchedule);
				if(!min) {
					min = pSchedule.weight;
					nextSchedule = pSchedule;
				} else if(min>pSchedule.weight) {
					min = pSchedule.weight;
					nextSchedule = pSchedule;
				}
			}

			schedulesProcessed++;
			if(schedulesProcessed===pEmail.schedules.length) {
				deferred.resolve(nextSchedule);
			}
		}).catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			console.log(pError);
			deferred.reject(pError);
		});
	});

	return deferred.promise;
};

/**
 * EMAIL HASH
 */
/**
 * function to save in the db a hash email
 * @param  {String} pEmail - email index to save
 * @param  {Object} pArticle - article saved in the db
 * @param  {Object} pEmailHashModel - model of mongoose to save in the db
 * @return {Object} - promise object to return
 */
var createEmailHash = function (pEmail, pEmailHashModel, pIdArticle, pIsEdit, pArticleState) {
	var findHashEmail = Q.nbind(pEmailHashModel.find, pEmailHashModel);

	return getNextSchedule(pEmail)
	.then(function(pNextSchedule) {

		//Get emailHash from DB
		//var now = Date.now();
		findHashEmail({email: pEmail.email}, '_id email')
		.then(function(pHashEmail) {
			//console.log('---- Create Email Hash ----: Get Email Hash '+pEmail.email+': ' + ((Date.now() - now) / 1000));
			if(pHashEmail.length!==0){
				var hashToUpdate = pHashEmail[0];
				//forEach pEmail.schedules, find the same schedule in the emailHash from db
				//pEmail.schedules.forEach(function(pNewSchedule) {

					//Remove the note from the schedule if it exists 
					if (pIsEdit){
						//Get un ID array de las notas que se van a meter.
						var notesIds = [];
						for (var i = pNextSchedule.notes.length - 1; i >= 0;i--) {
							notesIds.push(pNextSchedule.notes[i].idArticle);
						};

						//var now1 = Date.now();
						pEmailHashModel.update(
							{_id: hashToUpdate._id, 'schedules.idSchedule': pNextSchedule.idSchedule},
							{$pull: { "schedules.$.notes": { "idArticle": {$in: notesIds} }}},
							{multi: true},
							function(err, numAffected){
								//console.log('---- Create Email Hash ----: Update Email Hash '+ hashToUpdate._id +' - Schedule: '+ pNextSchedule.idSchedule +', PULL note: ' + ((Date.now() - now1) / 1000));
								//Add the note to the hash model
								if(pArticleState!==app.constants.STATE_DASHBOARD) {
									addArticleToEmailHash(pEmailHashModel, hashToUpdate._id, pNextSchedule);
								}
							});
					}
					else {
						if(pArticleState!==app.constants.STATE_DASHBOARD) {
							addArticleToEmailHash(pEmailHashModel,hashToUpdate._id, pNextSchedule);
						}
					}
					
					//var now4 = Date.now();
					//Update Supervisor Controls
					if(pArticleState!==app.constants.STATE_DASHBOARD) {
						supervisorControlModel.update(
							{sended: false, cancel: false, idsSubscriptionsDeliveries: pNextSchedule.idSchedule, articles: {$nin: [pIdArticle]}}, //Condition
							{$push: {articles: pIdArticle}}, //Update
							{}, //Options
							function(err, numAffected){
								//console.log('---- Create Email Hash ----: Update SupervisorControl: ' + ((Date.now() - now4) / 1000));
								if(err) {
									exceptionsLogger.logError(app, err);
									console.log(err);
								}
							});
					}
				//});

				//Insert the orderArticles in the articlesVisibility 
				pEmail.orderArticles.forEach(function(pOrderArticle){
					var newArticlesVisibility = new articlesVisibilityModel({
					    email: hashToUpdate.email,
					    idArticle: pOrderArticle.idArticle,
					    dateArticle: pOrderArticle.dateArticle,
					    clientTag: pOrderArticle.clientTag
					});
					newArticlesVisibility.save();
				});


			} else {
				//Ya no va con el email hash, si no que es aparte
				if(pArticleState!==app.constants.STATE_DASHBOARD) {
					var emailHash = new pEmailHashModel({
						email: pEmail.email,
						schedules: [pNextSchedule]
						//orderArticles: pEmail.orderArticles
					});
				}

				pEmail.orderArticles.forEach(function(pOrderArticle){
					var newArticlesVisibility = new articlesVisibilityModel({
					    email: pEmail.email,
					    idArticle: pOrderArticle.idArticle,
					    dateArticle: pOrderArticle.dateArticle,
					    clientTag: pOrderArticle.clientTag
					});
					newArticlesVisibility.save();
				});

				return Q.when(emailHash.save());
			}
		});
	}).catch(function(pError) {
		exceptionsLogger.logError(app, pError);
		console.log(pError);
	});
};

var addArticleToEmailHash = function (pEmailHashModel, pHashId, pNewSchedule){
	//var now2 = Date.now();
	//Add the note to the hash model
	pEmailHashModel.update(
		{_id: pHashId, 'schedules.idSchedule': pNewSchedule.idSchedule},
		{
			$push: { 'schedules.$.notes' : { $each: pNewSchedule.notes } }
		},
		{},
		function(err, numAffected){
			//console.log('---- Create Email Hash ----: Update Email Hash '+ pHashId +' - Schedule: '+ pNewSchedule.idSchedule +', push note: ' + ((Date.now() - now2) / 1000));
			if(err) {
				exceptionsLogger.logError(app, err);
				console.log(err);
			}
			//Aqui, if numAffected = 0 quiere decir que ese schedule no existe, entonces: 
			if(!numAffected) {
				//var now3 = Date.now();
				pEmailHashModel.update(
					{_id: pHashId},
					{$push: { schedules : pNewSchedule }}, 
					{},
					function(err) {
						//console.log('---- Create Email Hash ----: Create Email Hash Schedule: ' + ((Date.now() - now3) / 1000));
						if(err) {
							exceptionsLogger.logError(app, err);
							console.log(err);
						}
					});
			}
		});
}

/**
 * function to build the emails hash in the db
 * @param  {Object} app - reference of the context
 * @param  {Object} pArticle - Article saved in the db
 * @return {Object} - promise object to return
 */
exports.processArticleEmails = function(pApp, pArticle, pIsEdit) {
	app = pApp;

	subscriptionDeliveriesModel = app.models['subscription-deliveries'];
	var spacesModel = app.models['spaces'];
	var mediaTypeModel = app.models['media-types'];
	var emailsHashModel = app.models['emailsHash'];
	var subscriptionModel = app.models['subscriptions'];
	var clientModel = app.models['clients'];
	var scheduleModel = app.models['schedules'];

	supervisorControlModel = app.models['supervisor-control'];
	emailsToSendModel = app.models['emailsToSend'];
	articlesVisibilityModel = app.models['articlesVisibility'];

	WEB_FILE_TYPE = app.constants.WEB_FILE_TYPE;
	VIDEO_FILE_TYPE = app.constants.VIDEO_FILE_TYPE;
	IMAGE_FILE_TYPE = app.constants.IMAGE_FILE_TYPE;
	AUDIO_FILE_TYPE = app.constants.AUDIO_FILE_TYPE;

	configuration = app.configuration;

	var findSpace = Q.nbind(spacesModel.find, spacesModel);
	var findMediaTypeById = Q.nbind(mediaTypeModel.findById, mediaTypeModel);
	var findSubscriptionById = Q.nbind(subscriptionModel.findById, subscriptionModel);
	var findScheduleById = Q.nbind(subscriptionModel.findById, subscriptionModel);
	var findClientById = Q.nbind(clientModel.findById, clientModel);
	var findScheduleById = Q.nbind(scheduleModel.findById, scheduleModel);

	var emails = {};
	var subscriptionsDeliveriesProcessed = {};
	var promises = [];
	var deferred = Q.defer();
	var country;

	var subscriptionsProcesses = 0;
	var totalSubscriptionDeliveries = 0;

	findSpace({ tag: pArticle.tagSpace }, null, {})
	.then(function(pSpace) {
		country = pSpace[0].country;
		findMediaTypeById(pSpace[0].mediaType)
		.then(function(pMediaType) {
			pArticle.clientsTags.forEach(function(pTag){
				var subscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
				promises.push(subscriptionsDeliveries({ tagsTrademarks: pTag, tagMediaType: pMediaType.tag, tagsCountries: country, enabled: true }, null, {}));
			});

			var relatedClientsTags = pArticle.relatedClientsTags ? pArticle.relatedClientsTags : pArticle._doc.relatedClientsTags;
			relatedClientsTags.forEach(function(pTag){
				var subscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
				promises.push(subscriptionsDeliveries({ tagsTrademarks: pTag, tagMediaType: pMediaType.tag, tagsCountries: country, enabled: true }, null, {}));
			});

			pArticle.sectorsTags.forEach(function(pTag){
				var subscriptionsDeliveries = Q.nbind(subscriptionDeliveriesModel.find, subscriptionDeliveriesModel);
				promises.push(subscriptionsDeliveries({ tagSectors: pTag, tagMediaType: pMediaType.tag, tagsCountries: country, enabled: true }, null, {}));
			});

			//Add Logs to database calls
			//var now = Date.now();
			Q.allSettled(promises)
			.then(function (results) {
				//console.log('---- Save Article ----: Find Deliveries: ' + ((Date.now() - now) / 1000));
				results.forEach(function (result) {
					if (result.state === "fulfilled") {
						totalSubscriptionDeliveries += result.value.length;
					}
				});
				results.forEach(function (result) {
					if (result.state === "fulfilled") {
						var subscriptionDeliveries = result.value;
						subscriptionDeliveries.forEach(function(pSubscriptionDelivery) {

							if(!subscriptionsDeliveriesProcessed[pSubscriptionDelivery._id.toString()]) {

								subscriptionsDeliveriesProcessed[pSubscriptionDelivery._id.toString()] = true;

								findScheduleById(pSubscriptionDelivery.scheduleId)
								.then(function(pRealSchedule) {

									//var now1 = Date.now();
									findSubscriptionById(pSubscriptionDelivery.subscriptionId)
									.then(function(pSubscription) {
										//console.log('---- Save Article ----: Get Subscription: ' + ((Date.now() - now1) / 1000));

										//console.log('GET the subscription');
										//console.log(pSubscription);
										var noticeType = pArticle.noticeType ? pArticle.noticeType : pArticle._doc.noticeType;
										var isValidSubscription = false;
										if ((noticeType===constants.NOTICE)&&(pSubscription.tagNews.indexOf(pMediaType.tag)!==-1)) {
											isValidSubscription = true;
										} else if ((noticeType===constants.PUBLICITY)&&(pSubscription.tagPublicity.indexOf(pMediaType.tag)!==-1)) {
											isValidSubscription = true;
										} else if ((noticeType===constants.SOCIAL)&&(pSubscription.tagSocialNetwork.indexOf(pMediaType.tag)!==-1)) {
											isValidSubscription = true;
										}

										if(isValidSubscription) {
											//var now2 = Date.now();
											findClientById(pSubscription.clientID)
											.then(function(pClient) {
												//console.log('---- Save Article ----: Get Client: ' + ((Date.now() - now2) / 1000));
												//console.log('GET the client');
												//console.log(pClient);
												//console.log(emails[pSubscriptionDelivery.email]
												pSubscriptionDelivery.email.forEach(function(pEmail) {
													if (!emails[pEmail]) {

														var currentdate = utils.getCurrentDateTime();
														emails[pEmail] = {
															email:pEmail, 
															schedules: [{
																idSchedule: pSubscriptionDelivery._id,
																trademarksTags: pSubscriptionDelivery.tagsTrademarks,
																sectorsTags: pSubscriptionDelivery.tagSectors,
																notes:[{
																	idArticle: pArticle._id, 
																	dateTime:currentdate, 
																	supervisor:'', 
																	sended: false,
																	country: country,
																	note: pArticle
																}],
																programming: pRealSchedule.programming,
																clientTag: pClient.tag,
																clientName: pClient.name,
																clientColor: pClient.color,
								        						clientLogo: pClient.logo
															}],
															orderArticles: [{
																idArticle: pArticle._id,
																dateArticle: pArticle.date,
																clientTag: pClient.tag
															}]
														};
													} else {
														var findSchedule = false;
														emails[pEmail].schedules.forEach(function(pSchedule){
															if(pSchedule.idSchedule.toString()==pSubscriptionDelivery._id.toString()) {
																findSchedule = true;
															}
														});
														if (!findSchedule) {
															var currentdate = utils.getCurrentDateTime();
															emails[pEmail].schedules.push({
																idSchedule: pSubscriptionDelivery._id,
																trademarksTags: pSubscriptionDelivery.tagsTrademarks,
																sectorsTags: pSubscriptionDelivery.tagSectors,
																notes:[{
																	idArticle: pArticle._id, 
																	dateTime:currentdate, 
																	supervisor:'', 
																	sended: false,
																	country: country,
																	note: pArticle
																}],
																programming: pRealSchedule.programming,
																clientTag: pClient.tag,
																clientName: pClient.name,
																clientColor: pClient.color,
								        						clientLogo: pClient.logo
															});
														}
													}
												});

												subscriptionsProcesses++;
												if(subscriptionsProcesses===totalSubscriptionDeliveries) {
													
													if (result.value.length!==0) {
														for (var key in emails) {
															var obj = emails[key];
															//console.log('CREAR LOS EMAIL HASH');
															createEmailHash(obj, emailsHashModel, pArticle._id, pIsEdit, pArticle.state);
														}
													}

													//console.log('Retorno');
													//deferred.resolve(emails);
												}
											}).catch(function(pError) {
												exceptionsLogger.logError(app, pError);
												console.log(pError);
												throw pError;
											});
										} else {
											subscriptionsProcesses++;
											if(subscriptionsProcesses===totalSubscriptionDeliveries) {
												if (result.value.length!==0) {
													for (var key in emails) {
														var obj = emails[key];
														createEmailHash(obj, emailsHashModel, pArticle._id, pIsEdit, pArticle.state);
													}
												}
											}
										}
									}).catch(function(pError) {
										exceptionsLogger.logError(app, pError);
										console.log(pError);
										throw pError;
									});
								}).catch(function(pError) {
									exceptionsLogger.logError(app, pError);
									console.log(pError);
									throw pError;
								});
							} else {
								subscriptionsProcesses++;
								if(subscriptionsProcesses===totalSubscriptionDeliveries) {
									if (result.value.length!==0) {
										for (var key in emails) {
											var obj = emails[key];
											createEmailHash(obj, emailsHashModel, pArticle._id, pIsEdit, pArticle.state);
										}
									}
								}
							}
						});
						/*if (result.value.length!==0) {
							for (var key in emails) {
								var obj = emails[key];
								createEmailHash(obj, emailsHashModel);
							}
						}*/
					} else {
						var reason = result.reason;
						console.log('FALLO');
						console.log(reason);
						exceptionsLogger.logError(app, reason);
						deferred.reject(new Error(reason));
					}
				});
			});
		}).catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			deferred.reject(new Error(pError));
		});
	})
	.catch(function(pError) {
		exceptionsLogger.logError(app, pError);
		deferred.reject(new Error(pError));
	});

	return deferred.promise;
};

/**
 * function to build the emails hash in the db
 * @param  {Object} app - reference of the context
 * @param  {Object} pArticle - Article saved in the db
 * @return {Object} - promise object to return
 */
exports.removeArticleForClients = function(pApp, pArticle) {
	app = pApp;
	var articlesVisibilityModel = app.models['articlesVisibility'];
	var deferred = Q.defer();
	articlesVisibilityModel.remove({idArticle: pArticle._id}, function(pError, removed){
		if (pError){
			console.log(pError);
			exceptionsLogger.logError(app, pError);
			deferred.reject(new Error(pError));
		}
		else {
			deferred.resolve('Success');
		}
	});
	return deferred.promise;
};