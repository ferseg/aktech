/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: articles.js
 */


var Q = require('q');

var utils = require('../utils/common-functions.js');
var deliveriesProgramming  = require('../utils/deliveries-programming.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

var fs = require('fs-extra');

var MONTH_COMPLETES_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var WEB_FILE_TYPE;
var	VIDEO_FILE_TYPE;
var IMAGE_FILE_TYPE;
var AUDIO_FILE_TYPE;

module.exports = function(app){
	var articlesModel = app.models['articles'];
	var spacesModel = app.models['spaces'];
	var tagModel = app.models['tags'];

	WEB_FILE_TYPE = app.constants.WEB_FILE_TYPE;
	VIDEO_FILE_TYPE = app.constants.VIDEO_FILE_TYPE;
	IMAGE_FILE_TYPE = app.constants.IMAGE_FILE_TYPE;
	AUDIO_FILE_TYPE = app.constants.AUDIO_FILE_TYPE;

	var validateArticle = function(pArticle) {
		if (pArticle.date == null) {
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_WITH_DATE);
		}
		if (pArticle.title == null || pArticle.title.length < 1 || pArticle.description == null || 
			pArticle.description.length < 1) {
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_TITLE_OR_DESCRIPTION);	
		}
		return true;
	};

	/**
	 * Function to get the link of the article
	 * @param  {Object} pArticle article to save/update
	 * @param  {String} pOldLink the old link if the article will update
	 * @return {String}          the link of the attach (web, video, image, audio)
	 */
	var getLink = function(pArticle, pOldLink) {
		var deferred = Q.defer();

		if ((pArticle.attachType===VIDEO_FILE_TYPE)||(pArticle.attachType===AUDIO_FILE_TYPE)||(pArticle.attachType===IMAGE_FILE_TYPE)) {
			if(pOldLink!==pArticle.link) {
				if(pArticle.link.substring(0, 6)==='files/') {
					deferred.resolve(pArticle.link);
				} else {
					var getSpace = Q.nbind(spacesModel.find, spacesModel);
					getSpace({'tag' : pArticle.tagSpace}, null, {})
					.then(function(pSpace) {
						if(pSpace.length!==0) {

							var mediaType = pArticle.mediaType ? pArticle.mediaType : pArticle._doc.mediaType;
							var date = (!(pArticle.date instanceof Date)) ? 
								new Date(pArticle.date) : 
								pArticle.date;

							var newFileName = pArticle.link.replace(/[^\w\s\.]/gi, '').replace(/[-\s]/g, '_');
							var newPathFile = 'files/'+pSpace[0].country+'/'+date.getFullYear()+'/'+MONTH_COMPLETES_NAMES[date.getMonth()]+'/'+date.getDate()+'/'+mediaType+'/'+pArticle.nameSpace+'/'+newFileName;

							fs.move(app.dirname+'/public/tmp/'+pArticle.link, app.dirname+'/public/'+newPathFile, function(err){
								if (err) {
									exceptionsLogger.logError(app, err);
									deferred.reject(app.constants.ERROR_GETTING_FILE);
								} else {
									deferred.resolve(newPathFile);
								}
							});
						} else {
							console.log('No sector finded');
							exceptionsLogger.logError(app, new Error('No sector finded'));
							deferred.reject('No sector finded');
						}
					}).catch(function(pError) {
						console.log(pError);
						exceptionsLogger.logError(app, pError);
						deferred.reject(app.constants.ERROR_GETTING_DATA);
					});
				}
			} else {
				deferred.resolve(pArticle.link);
			}
		} else {
			deferred.resolve(pArticle.link);
		}

		return deferred.promise;
	};

	return {

		getArticle: function(pRequest) {
			var getArticles = Q.nbind(articlesModel.find, articlesModel);
			return getArticles({_id: pRequest.params.id})
			.then(function(pArticles) {
				return new Response(pArticles, app.constants.CODE_OK);
			})
			.catch(function(pError) {
				console.log(pError.stack);
				exceptionsLogger.logError(app, pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		getArticles: function(pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getArticles = Q.nbind(articlesModel.find, articlesModel);
				var filterByUser = null;
				if ((pRequest.user.permissions.indexOf(app.constants.ADMIN_PERMISSION) < 0)&&(pRequest.user.permissions.indexOf(app.constants.SUPERVISOR_PERMISSION) < 0)) {
					filterByUser = { 'userModifications.tag': pRequest.user.tag, 'sendedAlmostOnce': false };
				}
				return getArticles(filterByUser,null,{sort: { 'userModifications.timestamp':-1 }, limit: 60})
				.then(function(pArticles) {
					pArticles.sort(function(pArticleA, pArticleB) {
						return pArticleA.date.getTime() - pArticleB.date.getTime();
					});
					return new Response(pArticles, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					console.log(pError.stack);
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * get Articles by state
		 * @param  {Object} pRequest Request made
		 * @return {Array}          all the notes with the state in params
		 */
		getArticlesByState: function(pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getArticles = Q.nbind(articlesModel.find, articlesModel);
				var filterByUser = {'state': pRequest.params.state};
				if ((pRequest.user.permissions.indexOf(app.constants.ADMIN_PERMISSION) < 0)&&(pRequest.user.permissions.indexOf(app.constants.SUPERVISOR_PERMISSION) < 0)) {
					filterByUser = {'state': pRequest.params.state, 'userModifications.tag': pRequest.user.tag, 'sendedAlmostOnce': false };
				}
				return getArticles(filterByUser,null,{sort: { 'userModifications.timestamp':-1 }, limit: 60})
				.then(function(pArticles) {
					pArticles.sort(function(pArticleA, pArticleB) {
						return pArticleA.date.getTime() - pArticleB.date.getTime();
					});
					return new Response(pArticles, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					console.log(pError.stack);
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		saveArticle: function(pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				//var deferred = Q.defer();

				var newArticle = new articlesModel(pRequest.body);

				return getLink(newArticle)
				.then(function(pNewLink) {

					newArticle.link = pNewLink;
					return Q.when(newArticle.save())
					.then(function() {
						return validateArticle(pRequest.body);
					})
					.then(function(isValid) {
						if ((newArticle.state===app.constants.STATE_COMPLETE)||(newArticle.state===app.constants.STATE_DASHBOARD)){
							deliveriesProgramming.processArticleEmails(app, newArticle, false)
							.then(function (pEmails) {
								console.log('Ya me retornaron');
								console.log(pEmails);
							}).catch(function(pError) {
								console.log(pError);
								exceptionsLogger.logError(app, pError);
							});
						}
					})
					.then(function() {
						return new Response(newArticle);
					})
					.catch(function(pError) {
						console.log(pError.stack);
						exceptionsLogger.logError(app, pError);
						if (pError.http_code) {
							return new Response(pError.message, pError.http_code);
						}
						return new Response(app.constants.CODE_SERVER_ERROR, app.constants.CODE_SERVER_ERROR);
					});
				}).catch(function(pError) {
					console.log(pError);
					exceptionsLogger.logError(app, pError);
					return new Response({message: pError}, app.constants.CODE_SERVER_ERROR);
				});

				//return deferred.promise;
			}
		},

		updateArticle: function(pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getArticleById = Q.nbind(articlesModel.findById, articlesModel);
				var isStateChange = false;
				var oldLink;
				return getArticleById(pRequest.params.id)
				.then(function(pArticle) {
					var setUpdate;
					if (pArticle) {
						setUpdate = {};
						for (var key in pRequest.body) {
							if (key[0] !== '_') {
								setUpdate[key] = pRequest.body[key];
							}
						}
						if (pArticle.state!==setUpdate.state) {
							isStateChange = true;
							console.log('Cambió el estado del articulo');
						}
						oldLink = pArticle.link;
					} else {
						throw utils.createError(app.constants.CODE_ERROR, app.constants.ERROR_INVALID_ARTICLE);
					}

					return getLink(setUpdate, oldLink)
					.then(function(pNewLink) {
						setUpdate.link = pNewLink;
						return Q.when(articlesModel.update({ _id : pRequest.params.id }, { $set: setUpdate }).exec())
						.then(function() {
							setUpdate._id = pRequest.params.id;

							if (((setUpdate.state===app.constants.STATE_COMPLETE)||(setUpdate.state===app.constants.STATE_DASHBOARD))&&(isStateChange)){
								deliveriesProgramming.processArticleEmails(app, setUpdate, true)
								.then(function (pEmails) {
									console.log('Ya me retornaron');
									console.log(pEmails);
								})
								.catch(function(pError){
									console.log(pError);
									exceptionsLogger.logError(app, pError);
								});
							} else {
								if(isStateChange) {
									deliveriesProgramming.removeArticleForClients(app, setUpdate, true)
									.then(function (pEmails) {
										console.log('Ya me retornaron');
										console.log(pEmails);
									})
									.catch(function(pError){
										console.log(pError);
										exceptionsLogger.logError(app, pError);
									});
								}
							}

							return new Response(setUpdate);
						})
						.catch(function(pError) {
							throw pError;
						});
					}).catch(function(pError) {
						console.log(pError);
						exceptionsLogger.logError(app, pError);
						return new Response({message: pError}, app.constants.CODE_SERVER_ERROR);
					});
				})
				.catch(function(pError) {
					console.log(pError.stack);
					if (pError.http_code) {
						return new Response(pError.message, pError.http_code);
					} else {
						exceptionsLogger.logError(app, pError);
						return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		}
	};
};
