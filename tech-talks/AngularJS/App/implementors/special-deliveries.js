/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: special-deliveries.js
 */

var Q = require('q');
var mustache = require('mustache');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var specialDeliveriesModel = app.models['special-deliveries'];
	var clientModel = app.models['clients'];
	var sectorModel = app.models['sectors'];
	var articlesModel = app.models['articles'];
	var tagModel = app.models['tags'];
	var templatesModel = app.models['templates'];
	var spacesModel = app.models['spaces'];

	var DEFAULT_COLOR = '#F26522';
	var WEB_FILE_TYPE = app.constants.WEB_FILE_TYPE;
	var VIDEO_FILE_TYPE = app.constants.VIDEO_FILE_TYPE;
	var IMAGE_FILE_TYPE = app.constants.IMAGE_FILE_TYPE;
	var AUDIO_FILE_TYPE = app.constants.AUDIO_FILE_TYPE;
	
	var MONTH_NAMES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
	var MONTH_COMPLETES_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
	var DAYS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
	var EDITION = app.constants.EDITION;

	var configuration = app.configuration;
	var sendgrid = app.sendgrid;
	var dirname = app.dirname;

	var sortByType = function(pObjectA, pObjectB) {
		if(pObjectA.type < pObjectB.type) return -1;
		if(pObjectA.type > pObjectB.type) return 1;
		return 0;
	};

	/**
 	 * process the tags of trademarks presents in an article
	 * @param  {Array} pTags - array of tags
	 * @return {Object} - promise with the info of the trademark or the error
	 */
	/**
	 * process the tags of trademarks presents in an article
	 * @param  {Array} pTags - array of tags
	 * @return {Object} - promise with the info of the trademark or the error
	 */
	var porcessTagsTrademarks = function(pArticle, pTrademarksTags, pTagSectors) {
		var getClientsFunc = Q.nbind(clientModel.find, clientModel);
		var getSectors = Q.nbind(sectorModel.find, sectorModel);

		var deferred = Q.defer();

		var trademarksToReturn = [];
		var trademarksAssigned = 0;
		var trademarksrelatedAssigned = 0;
		var findTrademark = false;
		var findRelatedTrademark = false;

		//Si no hay tags de marcas, por lo tanto existirian solo sectores en el articulo (no habran tags relacionados)
		if (pArticle.clientsTags.length===0) {
			var findSector = false;
			pArticle.sectorsTags.forEach(function(pTagInArticle, pIndexTag) {
				pTagSectors.forEach(function(pTag) {
					if((pTagInArticle===pTag)&&(!findSector)) {
						findSector=true;
						trademarksToReturn.push({
							tag:pTagInArticle, 
							trademark:false, 
							Object: {
								tag: pTagInArticle,
								detail: pArticle.sectorsNames[pIndexTag]
							}
						});
						deferred.resolve(trademarksToReturn);
					}
				});
			});
			//La nota viene vacia
			if(!findSector) {
				deferred.resolve(trademarksToReturn);
			}
		} else {
			pArticle.clientsTags.forEach(function(pTagTrademark) {
				if (pTrademarksTags.indexOf(pTagTrademark) != -1) {
					findTrademark = true;

					var query = tagModel.find({'tag':pTagTrademark});
					Q(query.exec())
					.then(function(pTag) {
						if (pTag.length < 1) {			
							trademarksAssigned++;
							if (trademarksAssigned === pArticle.clientsTags.length) {
								deferred.resolve(trademarksToReturn);
							}
						} else {
							if (pTag[0].codeCollection==='clients') {
								getClientsFunc({'tag': pTag[0].tag})
								.then(function(pClient) {
									var object = pClient[0].toJSON();
									object.isCompetency = false;
									trademarksToReturn.push({tag:pClient[0].tag, trademark:true, Object: object});

									trademarksAssigned++;
									if (trademarksAssigned === pArticle.clientsTags.length) {
										deferred.resolve(trademarksToReturn);
									}
								})
								.catch(function(pError) {
									console.log('AQUI...');
									console.log(pError);
									exceptionsLogger.logError(app, pError);
									throw utils.createError(app.constants.CODE_SERVER_ERROR, 
										pError);
								});
							} else {
								if (pTag[0].codeCollection==='trademarks') {
									getClientsFunc({'trademarks.tag': pTag[0].tag})
									.then(function(pClients) {
										//pClients.forEach(function(pClient) {
											//if(pClient.tag===pClientTag) {
												pClients[0].trademarks.forEach(function(pTrademark) {
													if (pTrademark.tag === pTag[0].tag) {
														trademarksToReturn.push({tag:pTrademark.tag, trademark:true, Object: pTrademark});

														trademarksAssigned++;
														if (trademarksAssigned === pArticle.clientsTags.length) {
															deferred.resolve(trademarksToReturn);
														}
													}
												});
											//}
										//});
									})
									.catch(function(pError) {
										console.log('AQUI.....');
										console.log(pError);
										exceptionsLogger.logError(app, pError);
										throw utils.createError(app.constants.CODE_SERVER_ERROR, 
											pError);
									});
								} else {
									if (pTag[0].codeCollection==='products') {
										getClientsFunc({'trademarks.products.tag': pTag[0].tag})
										.then(function(pClients) {
											//pClients.forEach(function(pClient) {
												//if(pClient.tag===pClientTag) {
													pClients[0].trademarks.forEach(function(pTrademark) {
														pTrademark.products.forEach(function(pProduct){
															if (pProduct.tag === pTag[0].tag) {
																trademarksToReturn.push({tag:pProduct.tag, trademark:true, Object: pProduct});
																
																trademarksAssigned++;
																if (trademarksAssigned === pArticle.clientsTags.length) {
																	deferred.resolve(trademarksToReturn);
																}
															}
														});
													});
												//}
											//});
										})
										.catch(function(pError) {
											console.log('AQUI.......');
											console.log(pError);
											exceptionsLogger.logError(app, pError);
											throw utils.createError(app.constants.CODE_SERVER_ERROR, 
												pError);
										});
									}
								}
							}
						}
					});
				} else {
					trademarksAssigned++;
					if (trademarksAssigned === pArticle.clientsTags.length) {
						deferred.resolve(trademarksToReturn);
					}
				}
			});

			//si no encontro el trademark en los tags directos, hay que comprobar en los tags de los sectores
			if (!findTrademark) {
				var findSector = false;
				pArticle.sectorsTags.forEach(function(pTagInArticle, pIndexTag) {
					pTagSectors.forEach(function(pTag) {
						if((pTagInArticle===pTag)&&(!findSector)) {
							findSector=true;

							trademarksToReturn.push({
								tag:pTagInArticle, 
								trademark:false, 
								Object: {
									tag: pTagInArticle,
									detail: pArticle.sectorsNames[pIndexTag]
								}
							});

							deferred.resolve(trademarksToReturn);
						}
					});
				});
			}
		}

		return deferred.promise;
	};
	
	/**
	 * process article, call a method to process the tags of the article
	 * @param  {Object} pArticle - Article to process
	 * @return {Object} - promise to return
	 */
	var processArticles = function(pArticle, pTrademarksTags, pTagSectors, pIdArticle) {
		var deferred = Q.defer();

		porcessTagsTrademarks(pArticle, pTrademarksTags, pTagSectors)
		.then(function(pTrademark) {
			deferred.resolve(pTrademark);
		})
		.catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			console.log(pError);
			throw pError;
		});

		return deferred.promise;
	};

	/**
	 * get emails to send to a user
	 * @param  {String} pEmail - user email to send emails
	 * @param  {String} pIdSchedule - id of the schedule to find emails
	 * @return {Object} - Promise object to return
	 */
	var getEmailsHashByEmail = function (pEmail, pArticles, pSectors, pTrademarks, pClientTag) {
		var cachedArticles = {};
		var articlesAssigned = 0;
		var articlesToReturn = [];
		var filesTypes = [];

		var deferred = Q.defer();
		pArticles.forEach(function(pArticle, pIndex) {
			var country;
			var note = {
				idArticle: pArticle._id,
				datetime: pArticle.date
			};

			if (pArticle.attachType) {
				if (filesTypes.indexOf(pArticle.attachType)=== -1) {
					filesTypes.push(pArticle.attachType);
				}
			}

			var findSpace = Q.nbind(spacesModel.find, spacesModel);
			findSpace({tag: pArticle.tagSpace}, 'country')
			.then(function(pSpace) {
				country = pSpace[0].country;

				var trademarks;
				var sectors;
				if((pTrademarks.length==0)&&(pSectors.length==0)) {
					trademarks = pArticle.clientsTags;
					sectors = pArticle.sectorsTags;
				} else {
					trademarks = pTrademarks;
					sectors = pSectors;
				}

				if (pClientTag === '#cliente') {
					processArticles(pArticle, trademarks, sectors)
					.then(function(pTrademarks) {

						note.trademarksArray = pTrademarks;
						note.note = pArticle;
						note.note.country = country;

						articlesToReturn.push(note);
						articlesAssigned++;

						if (articlesAssigned === pArticles.length) {
							deferred.resolve({
								email:pEmail, 
								articles: articlesToReturn,
								filesTypes: filesTypes
							});
						}
					}).catch(function(pError) {
						exceptionsLogger.logError(app, pError);
						console.log('ERROR');
						console.log(pError);
						deferred.reject(pError);
					});
				} else {
					utils.processArticles(pArticle, trademarks, sectors, pClientTag, app)
					.then(function(pTrademarks) {

						note.trademarksArray = pTrademarks;
						note.note = pArticle;
						note.note.country = country;

						articlesToReturn.push(note);
						articlesAssigned++;

						if (articlesAssigned === pArticles.length) {
							deferred.resolve({
								email:pEmail, 
								articles: articlesToReturn,
								filesTypes: filesTypes
							});
						}
					}).catch(function(pError) {
						exceptionsLogger.logError(app, pError);
						console.log('ERROR');
						console.log(pError);
						deferred.reject(pError);
					});
				}
			})
			.catch(function(pError) {
				exceptionsLogger.logError(app, pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		});

		return deferred.promise;
	};

	var updateArticles =  function(pObject) {
		var articles = [];

		pObject.allNotes.forEach(function(pArticle) {
			articlesModel.findByIdAndUpdate(pArticle.note._id, { $set: {sendedAlmostOnce: true}}, function (err, articleUpdate) {
				if (err) {
					console.log(err);
				}
			});
		});
	};

	/**
	 * send emails to the clients
	 * @param  {Object} pHTMLEmail - object with the info of the articles to send and the html rendered
	 * @param  {String} pIdSupervisorControl - id of the supervisor control
	 */
	var sendEmails = function(pHTMLEmail) {
		var deferred = Q.defer();
		//console.log(pHTMLEmail);
		try {
			for(var htmlEmail in pHTMLEmail) {
				var to = htmlEmail;
				
				var email      = new sendgrid.Email();
				email.addTo(to);
				email.setFrom(app.constants.FROM);
				email.setSubject(app.constants.SUBJECT);

				/*email.addFile({
					cid: 'the_logo_coes',
					path:  dirname + '/public/images/Coes_logo.png'
				});
				
				if (pHTMLEmail[htmlEmail].filesTypes.indexOf(VIDEO_FILE_TYPE)!=-1) {
					email.addFile({
						cid: 'image_video',
						path: dirname + '/public/images/mail_video.png'
					});
				}
				if (pHTMLEmail[htmlEmail].filesTypes.indexOf(AUDIO_FILE_TYPE)!=-1) {
					email.addFile({
						cid: 'image_audio',
						path: dirname + '/public/images/mail_audio.png'
					});
				}*/

				//Attach images of articles
				/*pHTMLEmail[htmlEmail].images_attach.forEach(function(pImageToAttach) {
					//console.log(pImageToAttach);
					email.addFile(pImageToAttach);
				});

				//Attach images of trademarks/products
				for(key in pHTMLEmail[htmlEmail].imagesToSend) {
					email.addFile(pHTMLEmail[htmlEmail].imagesToSend[key]);
				}*/

				email.setHtml(pHTMLEmail[htmlEmail].html);

				email.addHeader('X-Sent-Using', 'SendGrid-API');
				email.addHeader('X-Transport', 'web');

				sendgrid.send(email, function(err, json) {
					if (err) {
						console.error(err);
						deferred.reject();
					}
					deferred.resolve();
					console.log(json);
				});

				updateArticles(pHTMLEmail[htmlEmail]);
			}
		} catch(err) {
		    console.log(err);
		    deferred.reject(err);
		}

		return deferred.promise;
	};

	/**
	 * function to render with the templates the notes to send
	 * @param  {Object} pEmails - object of notes to send
	 */
	var renderEmails = function (pEmail, pObject) {
		//console.log(pEmails);
		var deferred = Q.defer();

		var emailsToSend = {};
		var index = 0;
		var haveEmails = false;
		
		var templateSummary;
		var templateNotes;


		var getTemplates = Q.nbind(templatesModel.find, templatesModel);
		getTemplates({ tag: '#summary-default' })
		.then(function(pTemplates) {
			templateSummary = pTemplates[0].html;

			var getTemplates = Q.nbind(templatesModel.find, templatesModel);
			getTemplates({ tag: '#emails-default' })
			.then(function(pTemplates) {
				templateNotes = pTemplates[0].html;

				pObject.imagesToSend = {};
				pObject.filesTypes = [];
				pObject.images_attach = [];
				pObject.idEmailHash = [];
				pObject.idSchedule = [];
				pObject.allNotes = [];

				pObject.clients = [];

				for (var key in pObject) {
					if (key[0]==='#') {

						/**
						 * PLANTILLA ERWIN/
						 */
						pObject = utils.createObjectToTemplate(pObject, key, EDITION, app.configuration.getSetting('urlServer'));
						/**
						 * /PLANTILLA ERWIN
						 */

						if(pObject[key].quantityArticles>0) {

							pObject[key].filesTypes.forEach(function (pFileType) {
								if (pObject.filesTypes.indexOf(pFileType)===-1) {
									pObject.filesTypes.push(pFileType);
								}
							});

							pObject[key].images_attach.forEach(function (pImage) {
								pObject.images_attach.push(pImage);
							});

							pObject[key].formatPublicity = (Math.round(pObject[key].totalPublicity) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
							pObject[key].formatScope = (Math.round(pObject[key].totalScope) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

							pObject[key].color_default = DEFAULT_COLOR;
						}

						//var summary = mustache.render(templateSummary, pEmails[email]);
						var notes = mustache.render(templateNotes, pObject);

						emailsToSend[pEmail] = {
							html: notes,//summary + notes,					
							//notesGroupByTagArray: pEmails[email].notesGroupByTagArray,
							//notesGroupBySectorArray: pEmails[email].notesGroupBySectorArray,
							allNotes: pObject.allNotes,
							filesTypes: pObject.filesTypes,
							images_attach: pObject.images_attach,
							imagesToSend: pObject.imagesToSend,
							email: pEmail
						};
					}
				}

				sendEmails(emailsToSend)
				.then(function(pResult) {
					deferred.resolve();
				}).catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					console.log('Error');
					console.log(pError);
					deferred.reject(pError);
				});
			})
			.catch(function(pError) {
				exceptionsLogger.logError(app, pError);
				console.log('Error al obtener las plantillas');
				console.log(pError);
				deferred.reject(pError);
			});
		})
		.catch(function(pError) {
			exceptionsLogger.logError(app, pError);
			console.log('Error al obtener las plantillas');
			console.log(pError);
			deferred.reject(pError);
		});

		return deferred.promise;
	};

	var generateEmails = function(pEmails, pArticles, pSectors, pClient, pTrademarks) {
		var deferred = Q.defer();

		var emails = {};

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth();
		var yyyy = today.getFullYear();
		var trademarkHaveImage;

		if(dd<10) {
			dd='0'+dd
		}

		var emailsProcessed = 0;
		pEmails.forEach(function(pEmail) {

			//var email = pEmail;

	        if (!emails[pEmail]) {
				emails[pEmail] = {
					idSchedule: [],
					mediaTypes: [],
					date: dd+' '+MONTH_NAMES[mm]+' '+yyyy
				};
			}
			if (!emails[pEmail][pClient.tag]) {
				emails[pEmail][pClient.tag] = {};
			}

	        emails[pEmail][pClient.tag] = {
	        	competencies: 0,
	        	quantityArticles: 0,
	        	totalPublicity: 0,
	        	totalScope: 0,
	        	feelings: {
	        		'Positivo': 0,
	        		'Negativo': 0,
	        		'Neutro': 0
	        	},
	        	notesGroupByType: {},
	        	images_attach: [],
	        	name_client: pClient.name,
	        	color_client: pClient.color,
	        	tag_client: pClient.tag,
	        	image_client: encodeURI(pClient.logo)
	        };

	        //Obtener un json con los los articulos a enviar para dicho email
			getEmailsHashByEmail(pEmail,pArticles,pSectors,pTrademarks,pClient.tag)
			.then(function(pTrademarks) {		

				if(pTrademarks.articles){

					emails[pEmail][pClient.tag].quantityArticles = pTrademarks.articles.length;
					pTrademarks.articles.forEach(function(pNote, pIndex) {

			            var article = pNote.note;

			            if ((article.attachType)&&(article.attachType != WEB_FILE_TYPE)) {
			            	article.image_attach = 'image_' + article.attachType;
			            	article.haveImage = true;
			            } else {
			            	article.image_attach = '';
			            }

		            	 if (article.image_attach == 'image_image') {
			            	article.image_attach = 'image_' + article._id.toString();
			            	emails[pEmail][pClient.tag].images_attach.push({
			            		cid: 'image_' + article._id.toString(),
								path: __dirname + '/public/' + article.link
			            	});
		            	}
			            
			            article.CoesLink = configuration.getSetting('urlClient') + 'article/' + article._id;

			            article.formatPublicity = (Math.round(article.publicity) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			            article.formatAlcance = article.Alcance ? (Math.round(article.Alcance)+ "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : 0;

			            emails[pEmail][pClient.tag].feelings[article.Sentimiento]++;
			            emails[pEmail][pClient.tag].totalScope += article.Alcance ? article.Alcance : 0;
			            emails[pEmail][pClient.tag].totalPublicity += article.publicity;
			            emails[pEmail][pClient.tag].filesTypes = pTrademarks.filesTypes;

						/**
			           	 * AGRUPAR POR TIPO DE NOTA
			           	 */

			           	pNote.note = article;
			            pNote.trademarksArray.forEach(function(pTrademark) {
			            	emails[pEmail][pClient.tag].competencies += pTrademark.Object.isCompetency ? 1 : 0;

			            	if(!emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType]) {
		            			emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType] = {
		            				notesGroupByCountry: {}
		            			};
		            		}

		            		if(!emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country]) {
		            			emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country] = {
		            				notesGroupByTag: {},
		            				notesGroupByTagSector: {},
		            				notesGroupByCompetencies: {}
		            			};
		            		}

			            	if ((pTrademark.trademark)&&(!pTrademark.Object.isCompetency)) {
			            		if (emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country].notesGroupByTag[pTrademark.tag] == null) {
			            			trademarkHaveImage = pTrademark.Object.logo ? true : false;
			            			emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country].notesGroupByTag[pTrademark.tag] = { trademark: pTrademark.Object, haveImage: trademarkHaveImage, articles: [pNote] };
			            		} else {
			            			emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country].notesGroupByTag[pTrademark.tag].articles.push(pNote);
			            		}
			            	} else {
			            		if (emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country].notesGroupByTagSector[pTrademark.tag] == null) {
			            			emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country].notesGroupByTagSector[pTrademark.tag] = { trademark: pTrademark.Object, articles: [pNote] };
			            		} else {
			            			emails[pEmail][pClient.tag].notesGroupByType[pNote.note.noticeType].notesGroupByCountry[pNote.note.country].notesGroupByTagSector[pTrademark.tag].articles.push(pNote);
			            		}
			            	}
			            });

			            var date = new Date(pNote.note.date);
			            var dayName = date.getDay();
			            var day = date.getDate();
			            var month = date.getMonth();
			            var year = date.getFullYear();

			            pTrademarks.articles[pIndex].note.fancyDate = DAYS[dayName]+', '+day+' de '+MONTH_COMPLETES_NAMES[month]+' del '+year;
			        });

					//emailsProcessed++;
					//if(emailsProcessed===pEmails.length) { 
						renderEmails(pEmail, emails[pEmail])
						.then(function(pResult) {
							deferred.resolve();
						}).catch(function(pError) {
							exceptionsLogger.logError(app, pError);
							console.log('Error');
							console.log(pError);
							deferred.reject(pError);
						});
					//}
				} else {

					//emailsProcessed++;
					//if(emailsProcessed===pSubscriptionDelivery.email.length) {
						renderEmails(pEmail, emails[pEmail])
						.then(function(pResult) {
							deferred.resolve();
						}).catch(function(pError) {
							exceptionsLogger.logError(app, pError);
							console.log('Error');
							console.log(pError);
							deferred.reject(pError);
						});
					//}
				}
			}).catch(function(pError) {
				exceptionsLogger.logError(app, pError);
				console.log('Error');
				console.log(pError);
				deferred.reject(pError);
			});		
		});

		return deferred.promise;
	};

	return {

		/**
		 * READ a list of special deliveries
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSpecialsDeliveries: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var specialsDeliveries = Q.nbind(specialDeliveriesModel.find, specialDeliveriesModel);
				return specialsDeliveries()
				.then(function(pSpecialDeliveries) {
					return new Response(pSpecialDeliveries);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a special delivery
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createSpecialDelivery: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return generateEmails(pRequest.body.emailsToSend, pRequest.body.articles, pRequest.body.sectors, pRequest.body.client, pRequest.body.trademarks)
				.then(function(pResult) {
					var specialDelivery;
					var articlesIds = [];
					pRequest.body.articles.forEach(function(pArticle) {
						articlesIds.push(pArticle._id);
					});

					var currentDatetime = new Date();
					specialDelivery = new specialDeliveriesModel({
						userEmail: pRequest.body.userEmail,
						datetime: currentDatetime,
						emailsToSend: pRequest.body.emailsToSend,
						articlesIds: articlesIds
					});
					return Q.when(specialDelivery.save())
					.then(function(pResult) {
						return new Response(specialDelivery);
					})
					.catch(function(pError) {
						if (pError.http_code) {
							return new Response(pError.message, pError.http_code);
						} else {
							exceptionsLogger.logError(app, pError);
							return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
						}
					});
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};