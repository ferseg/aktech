/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: common-functions.js
 */

'use strict';

var Q = require('q');
var exceptionsLogger = require('../utils/loggly.js');
var app;
var clientModel;
var sectorModel;
var tagModel;

var COUNTRIES_ORDER = ["Costa Rica", "Guatemala", "El Salvador", "Honduras", "Nicaragua", "Panamá"];

/**
 * private funtion to know is object is empty
 * @param  {Object}  pObject object to evaluate	
 * @return {Boolean}         true is Empty, false is not
 */
var isEmptyObject = function(pObject) {
	for(var key in pObject) {
		if (pObject.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

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
var porcessTagsTrademarks = function(pArticle, pTrademarksTags, pTagSectors, pClientTag) {
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
								object.isCompetency = pClientTag===object.tag ? false : true;
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
									pClients.forEach(function(pClient) {
										if(pClient.tag===pClientTag) {
											pClient.trademarks.forEach(function(pTrademark) {
												if (pTrademark.tag === pTag[0].tag) {
													trademarksToReturn.push({tag:pTrademark.tag, trademark:true, Object: pTrademark});

													trademarksAssigned++;
													if (trademarksAssigned === pArticle.clientsTags.length) {
														deferred.resolve(trademarksToReturn);
													}
												}
											});
										}
									});
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
										pClients.forEach(function(pClient) {
											if(pClient.tag===pClientTag) {
												pClient.trademarks.forEach(function(pTrademark) {
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
											}
										});
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

		//si no encontro el trademark en los tags directos, hay que comprobar en los tags relacionados
		if (!findTrademark) {

			var relatedClientsTags = pArticle.relatedClientsTags ? pArticle.relatedClientsTags : pArticle._doc.relatedClientsTags;
			relatedClientsTags.forEach(function(pTagTrademark) {
				if (pTrademarksTags.indexOf(pTagTrademark) != -1) {
					findRelatedTrademark = true;

					var query = tagModel.find({'tag':pTagTrademark});
					Q(query.exec())
					.then(function(pTag) {
						if (pTag.length < 1) {			
							trademarksrelatedAssigned++;
							if (trademarksrelatedAssigned === relatedClientsTags.length) {
								deferred.resolve(trademarksToReturn);
							}
						} else {
							if (pTag[0].codeCollection==='clients') {
								getClientsFunc({'tag': pTag[0].tag})
								.then(function(pClient) {
									var object = pClient[0].toJSON();
									
									object.isCompetency = false;
									pArticle.clientsTags.forEach(function(pClientTagInArticle) {
										object.trademarks.forEach(function(pTrademark) {
											if(pTrademark.tag===pClientTagInArticle) {
												object.isCompetency = pTrademark.isCompetency;
											}
											pTrademark.products.forEach(function(pProduct) {
												if(pProduct.tag===pClientTagInArticle) {
													object.isCompetency = pProduct.isCompetency;
												}
											});
										});
									});

									trademarksToReturn.push({tag:pClient[0].tag, trademark:true, Object: object});

									trademarksrelatedAssigned++;
									if (trademarksrelatedAssigned === relatedClientsTags.length) {
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
										pClients.forEach(function(pClient) {
											if(pClient.tag===pClientTag) {
												pClient[0].trademarks.forEach(function(pTrademark) {
													if (pTrademark.tag === pTag[0].tag) {
														trademarksToReturn.push({tag:pTrademark.tag, trademark:true, Object: pTrademark});

														trademarksrelatedAssigned++;
														if (trademarksrelatedAssigned === relatedClientsTags.length) {
															deferred.resolve(trademarksToReturn);
														}
													}
												});
											}
										});
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
											pClients.forEach(function(pClient) {
												if(pClient.tag===pClientTag) {
													pClient[0].trademarks.forEach(function(pTrademark) {
														pTrademark.products.forEach(function(pProduct){
															if (pProduct.tag === pTag[0].tag) {
																trademarksToReturn.push({tag:pProduct.tag, trademark:true, Object: pProduct});
																
																trademarksrelatedAssigned++;
																if (trademarksrelatedAssigned === relatedClientsTags.length) {
																	deferred.resolve(trademarksToReturn);
																}
															}
														});
													});
												}
											});
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
					if (trademarksrelatedAssigned === relatedClientsTags.length) {
						deferred.resolve(trademarksToReturn);
					}
				}
			});

			//si no encontro tags relacionados, es porque se relaciona por el sector
			if(!findRelatedTrademark) {
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
	}

	return deferred.promise;
};

/**
 * process article, call a method to process the tags of the article
 * @param  {Object} pArticle - Article to process
 * @return {Object} - promise to return
 */
exports.processArticles = function(pArticle, pTrademarksTags, pTagSectors, pClientTag, pApp) {
	app = pApp;
	clientModel = app.models['clients'];
	sectorModel = app.models['sectors'];
	tagModel = app.models['tags'];

	var deferred = Q.defer();

	porcessTagsTrademarks(pArticle, pTrademarksTags, pTagSectors, pClientTag)
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

exports.createError = function(pErrorCode, pErrorMessage) {
	var error = new Error(pErrorMessage);
	error.http_code = pErrorCode;
	return error;
};

/**
 * Returns true if the hashtag is valid and doesnt exist
 * @param  {ExpressApp}		app     [App]
 * @param  {String} 	pTag [Tag to validate]
 * @return {Boolean}	[Value that indicates if the hashtag is valid]
 */
exports.isHashTagValid = function(pApp, pTag) {
	app = pApp;
	var tagsModel = app.models['tags'];
	var query = tagsModel.find({'tag':pTag});
	var deferred = Q.defer();
	if (pTag==null) {
		return Q(false);
	}
	query.exec(function(pError, pTags) {
		if (pError) {
			//TODO: change error to db error
			exceptionsLogger.logError(app, pError);
			deferred.reject(new Error(pError));
		} else {
			if(pTags.length>0) {
				deferred.reject({
					http_code: app.constants.CODE_ERROR,//400, 
					message: app.constants.ERROR_INVALID_HASHTAG_REPEAT//'El tag ya existe, los tags deben ser únicos. Digite un tag distinto'
				});
			}
			// TODO: put regexp as constant			
			deferred.resolve(
				(
					(pTags.length < 1) && (pTag.match(/(^#)((([ñA-Za-z _]+)(.*))*)$/))
					//(pTags.length < 1) && (pTag.match(/(^#)((([ña-zÑA-Z0-9_]+)(-*))*)$/))
				)
			);
		}
	});
	return deferred.promise;
};

/**
 * Returns true if a hashtag exists in a specific collection
 * @param  {model name} pCollection [Collection to look for]
 * @param  {String} pTag        [Tag to look for]
 * @return {Boolean}             [Value that indicates if the hastag exists]
 */
exports.hashTagExists = function(pApp, pCollection, pTag) {
	app = pApp;
	var tagsModel = app.models['tags'];
	var query = tagsModel.find({'tag':pTag, 'codeCollection':pCollection });
	var deferred = Q.defer();
	query.exec(function(pError, pResult) {
		if (pError) {
			//TODO: change error to db error
			exceptionsLogger.logError(app, pError);
			deferred.reject(new Error(pError));
		} else {
			deferred.resolve((pResult.length > 0));	
		}
	});
	return deferred.promise;
};

/**
 * Clone the object pass by parameter
 * @param  {Object} pObject - Object to clone
 * @return {Object} Object cloned
 */
exports.clone = function(pObject) {
    if (null == pObject || 'object' != typeof pObject) {
		return pObject;
    }
    var copy = pObject.constructor();
    for (var attr in pObject) {
		if (pObject.hasOwnProperty(attr)) {
			copy[attr] = pObject[attr];
		}
    }
    return copy;
};

/*
 * function to verify if user are authenticated
 * @param  {Object} pRequest  Request object
 * @param  {Object} pResponse Response object
 * @param  {Object} pNext
 */
exports.auth = function(pRequest, pResponse, pNext){ 
	//console.log('FUNCTION VERIFY AUTH');
	if (!pRequest.isAuthenticated()){
		pResponse.send(401); 
	} else {
		pNext();
	}
};

/**
 * get the current date time in the server side
 * return String with the format dd/mm/yy@hh:mm:ss
 */
exports.getCurrentDateTime = function(){ 
	var currentdate = new Date(); 
	return (currentdate.getMonth()+1) + "/"
		+ currentdate.getDate()  + "/" 
		+ currentdate.getFullYear() + " @ "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();
};

/**
 * get the current date time in the server side
 * return String with the format dd/mm/yy
 */
exports.getCurrentDate = function(){ 
	var currentdate = new Date(); 
	return (currentdate.getMonth()+1) + "/"
		+ currentdate.getDate()  + "/" 
		+ currentdate.getFullYear();
};

exports.isLastDay = function(dt) {
    return new Date(dt.getTime() + 86400000).getDate() === 1;
};


/**
 * object to managa date type covert and compares between dates
 * @type {Object}
 */
var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
};

/**
 * public the dateConvert function to convert data to dates
 * @param  {String, Array, Number, Object} pDate - Data to convert to date
 * @return {Date} - Date data
 */
exports.dateConvert = function(pDate) {
	return dates.convert(pDate);
};

/**
 * public the datesCompare function to Compare to dates
 * @param  {Date} pDate1 - date to compare
 * @param  {Date} pDate2 - date to compare
 * @return {Number} - Return -1 if pDate1<pDate2, 0 if are equals or 1 if pDate1>pDate2
 */
exports.datesCompare = function(pDate1, pDate2) {
	return dates.inRange(pDate1, pDate2);
};

/**
 * public the datesInRange funtion to look if date is between a range of date
 * @param  {Date} pDate - date to evaluate
 * @param  {Date} pStartDate - start date of the range
 * @param  {Date} pEndDate - end date of the range
 * @return {Boolean} - true if pDate is in the range, false if not
 */
exports.datesInRange = function(pDate, pStartDate, pEndDate) {
	return dates.inRange(pDate, pStartDate, pEndDate);
};

/**
 * public funtion to know is object is empty
 * @param  {Object}  pObject object to evaluate	
 * @return {Boolean}         true is Empty, false is not
 */
exports.isEmptyObject = function(pObject) {
	for(var key in pObject) {
		if (pObject.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

/**
 * modify the object to make it for the template
 * @param  {Object} pObject Object with the info to send
 * @return {Object}         Object ready for the template
 */
exports.createObjectToTemplate = function(pObject, pKey, pEdition, pUrlServer) {
	/*if (pObject[pKey].image_client) {
		var tokens = pObject[pKey].image_client.split("trademarks");
		var rootFileFromImages = tokens[tokens.length-1];
		/*pObject.imagesToSend[pObject[pKey].tag_client] = {
			cid: pObject[pKey].tag_client,
			path: __dirname + '/public/images/trademarks' + rootFileFromImages
		};*/
	//}
	//
	var TRADEMARKS_ORDER = [pObject[pKey].name_client];

	var newClient = {
		name_client: pObject[pKey].name_client,
		//image_client: pObject[pKey].image_client,
		tag_client: pObject[pKey].tag_client,
		color_client: pObject[pKey].color_client,
		images_attach: pObject[pKey].images_attach,
		reports_type: []
	};

	var image_url = pObject[pKey].image_client;
	//IF the url NOT contains the DEFAULT icon then set the IMAGE
	if(image_url.indexOf("default-product-icon.png") == -1){
		newClient.image_client = image_url;
	}

	for (var noticeType in pObject[pKey].notesGroupByType) {
		var newNoticeType = {
			type: noticeType,
			countries: []
		};

		for (var country in pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry) {
			var newCountry = {
				country: country,
				quantityArticles: 0,
				mentions: 0,
				competencies: 0,
				feelings: {
					Neutral: 0,
					Negative: 0,
					Positive: 0
				},
				totalScope: 0,
				totalPublicity: 0,
				articles_type: []
			};

			/**
			 * MENCIONES
			 */
			var newArticleType = {
				type: "Menciones",
				totalPublicity: 0,
				formatPublicity: "",
				trademarks: []
			};

			for (var trademark in pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTag) {
				var newTrademark = {
					trademark: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTag[trademark].trademark.name,
					trademark_tag: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTag[trademark].trademark.tag,
					notes: []
				};

				pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTag[trademark].articles.forEach(function (pArticle) {
					var newNote = {
						fancyDate: pArticle.note.fancyDate,
						formatAlcance: pArticle.note.formatAlcance,
						formatPublicity: pArticle.note.formatPublicity,
						Sentiment: pArticle.note.Sentimiento,
						Edition: pArticle.note[pEdition],
						mediaType: pArticle.note.mediaType,
						tagSpace: pArticle.note.tagSpace,
						nameSpace: pArticle.note.nameSpace,
						CoesLink: pArticle.note.CoesLink,
						link: pArticle.note.link,
						image_attach: pArticle.note.images_attach,
						Alcance: pArticle.note.Alcance,
						publicity: pArticle.note.publicity,
						date: pArticle.note.date,
						title: pArticle.note.title,
						shortDescription: pArticle.note.shortDescription,
						creation_date: pArticle.note.userModifications.timestamp,
						attachType: pArticle.note.attachType,
						thumbnail: pUrlServer+pArticle.note.link+'.thumbnail.jpg',
						_id: pArticle.note._id.toString()
					};
					pObject.allNotes.push(pArticle);

					newArticleType.totalPublicity += pArticle.note.publicity;
					newTrademark.notes.push(newNote);

					newCountry.quantityArticles++;
					newCountry.mentions++;
					switch(newNote.Sentiment) {
					    case 'Positivo':
					        newCountry.feelings.Positive++;
					        break;
					    case 'Negativo':
					        newCountry.feelings.Negative++;
					        break;
					    default:
					        newCountry.feelings.Neutral++;
					}
				});

				newArticleType.trademarks.push(newTrademark);
			}

			newArticleType.trademarks.sort( function(a, b){
				var indexA = TRADEMARKS_ORDER.indexOf(a.trademark);
				var indexB = TRADEMARKS_ORDER.indexOf(b.trademark);
				var indexA = indexA < 0? 99: indexA;
				var indexB = indexB < 0? 99: indexB;
				if(indexA == indexB )
					return a.trademark.localeCompare(b.trademark);
				else
					return indexA - indexB ;
			});

			newCountry.totalPublicity += newArticleType.totalPublicity;
			newArticleType.formatPublicity = (Math.round(newArticleType.totalPublicity) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			newCountry.articles_type.push(newArticleType);

			/**
			 * COMPETENCIAS
			 */
			if(!isEmptyObject(pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByCompetencies)) {
				var newArticleType = {
					type: "Competencia",
					totalPublicity: 0,
					formatPublicity: "",
					trademarks: []
				};

				for (var trademark in pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByCompetencies) {
					var newTrademark = {
						trademark: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByCompetencies[trademark].trademark.name,
						trademark_tag: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByCompetencies[trademark].trademark.tag,
						notes: []
					};

					pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByCompetencies[trademark].articles.forEach(function (pArticle) {
						var newNote = {
							fancyDate: pArticle.note.fancyDate,
							formatAlcance: pArticle.note.formatAlcance,
							formatPublicity: pArticle.note.formatPublicity,
							Sentiment: pArticle.note.Sentimiento,
							Edition: pArticle.note[pEdition],
							mediaType: pArticle.note.mediaType,
							tagSpace: pArticle.note.tagSpace,
							nameSpace: pArticle.note.nameSpace,
							CoesLink: pArticle.note.CoesLink,
							link: pArticle.note.link,
							image_attach: pArticle.note.images_attach,
							Alcance: pArticle.note.Alcance,
							publicity: pArticle.note.publicity,
							date: pArticle.note.date,
							title: pArticle.note.title,
							shortDescription: pArticle.note.shortDescription,
							creation_date: pArticle.note.userModifications.timestamp,
							attachType: pArticle.note.attachType,
							thumbnail: pUrlServer+pArticle.note.link+'.thumbnail.jpg',
							_id: pArticle.note._id.toString(),
						};
						pObject.allNotes.push(pArticle);

						newArticleType.totalPublicity += pArticle.note.publicity;
						newTrademark.notes.push(newNote);

						newCountry.quantityArticles++;
						newCountry.competencies++;
						switch(newNote.Sentiment) {
					    	case 'Positivo':
						        newCountry.feelings.Positive++;
						        break;
						    case 'Negativo':
						        newCountry.feelings.Negative++;
						        break;
						    default:
						        newCountry.feelings.Neutral++;
						}
					});

					newArticleType.trademarks.push(newTrademark);
				}

				newArticleType.trademarks.sort( function(pObjectA, pObjectB){
					if(pObjectA.trademark < pObjectB.trademark) return -1;
					if(pObjectA.trademark > pObjectB.trademark) return 1;
					return 0;
				});

				newCountry.totalPublicity += newArticleType.totalPublicity;
				newArticleType.formatPublicity = (Math.round(newArticleType.totalPublicity) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				newCountry.articles_type.push(newArticleType);
			}

			/**
			 * SECTORES
			 */
			if(!isEmptyObject(pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTagSector)) {
				
				var sectors = [];
				for (var sector in pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTagSector) {
					var newArticleType = {
						type: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTagSector[sector].trademark.detail,
						//totalPublicity: 0,
						//formatPublicity: "",
						trademarks: []
					};
					var newTrademark = {
						//trademark: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTagSector[sector].trademark.detail,
						//trademark_tag: pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTagSector[sector].trademark.tag,
						notes: []
					};

					pObject[pKey].notesGroupByType[noticeType].notesGroupByCountry[country].notesGroupByTagSector[sector].articles.forEach(function (pArticle) {
						var newNote = {
							fancyDate: pArticle.note.fancyDate,
							formatAlcance: pArticle.note.formatAlcance,
							formatPublicity: pArticle.note.formatPublicity,
							Sentiment: pArticle.note.Sentimiento,
							Edition: pArticle.note[pEdition],
							mediaType: pArticle.note.mediaType,
							tagSpace: pArticle.note.tagSpace,
							nameSpace: pArticle.note.nameSpace,
							CoesLink: pArticle.note.CoesLink,
							link: pArticle.note.link,
							image_attach: pArticle.note.images_attach,
							Alcance: pArticle.note.Alcance,
							publicity: pArticle.note.publicity,
							date: pArticle.note.date,
							title: pArticle.note.title,
							shortDescription: pArticle.note.shortDescription,
							creation_date: pArticle.note.userModifications.timestamp,
							attachType: pArticle.note.attachType,
							thumbnail: pUrlServer+pArticle.note.link+'.thumbnail.jpg',
							_id: pArticle.note._id.toString()
						};
						pObject.allNotes.push(pArticle);

						//newArticleType.totalPublicity += pArticle.note.publicity;
						newTrademark.notes.push(newNote);

						newCountry.quantityArticles++;
						switch(newNote.Sentiment) {
						    case 'Positivo':
						        newCountry.feelings.Positive++;
						        break;
						    case 'Negativo':
						        newCountry.feelings.Negative++;
						        break;
						    default:
						        newCountry.feelings.Neutral++;
						}

						//aqui suma el publicity de la nota al total del pais
						newCountry.totalPublicity += pArticle.note.publicity;
					});

					newArticleType.trademarks.push(newTrademark);

					//newCountry.totalPublicity += newArticleType.totalPublicity;
					//newArticleType.formatPublicity = (newArticleType.totalPublicity + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					sectors.push(newArticleType);
					//newCountry.articles_type.push(newArticleType);
				}

				//sort by sector name
				sectors.sort(sortByType);
				newCountry.articles_type = newCountry.articles_type.concat(sectors);
			}

			newNoticeType.countries.push(newCountry);
		}

		//sort by countries name
		/*newNoticeType.countries.sort(function(a,b) { 
			if(a.country < b.country) return -1;
			if(a.country > b.country) return 1;
			return 0;
		});*/
		newNoticeType.countries.sort(function(a, b){
			var indexA = COUNTRIES_ORDER.indexOf(a.country);
			var indexB = COUNTRIES_ORDER.indexOf(b.country);
			var indexA = indexA < 0? 99: indexA;
			var indexB = indexB < 0? 99: indexB;
			if(indexA == indexB )
				return a.country.localeCompare(b.country);
			else
				return indexA - indexB ;
		});
		newClient.reports_type.push(newNoticeType);
	}

	//sort by noticeType
	newClient.reports_type.sort(sortByType);

	pObject.clients.push(newClient);

	pObject.clients.sort(function(pObjectA, pObjectB) {
		if(pObjectA.name_client < pObjectB.name_client) return -1;
		if(pObjectA.name_client > pObjectB.name_client) return 1;
		return 0;
	});

	return pObject;
};