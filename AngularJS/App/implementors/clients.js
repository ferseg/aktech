/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: clients.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var clientModel = app.models['clients'];
	var tagModel = app.models['tags'];

	/**
	 * Helper method: looks for a trademark. If it doesn't exist, return false
	 * @param  {Object} pClient - Client parent of the trademark to update
	 * @param  {String} pTagTrademark - Tag of the trademark to update
	 * @return {Object} The trademark to update or false if no exists
	 */
	var tagExists = function(pArray, pTagTrademark) {
		var retorno = false;
		pArray.forEach(function(item) {
			if(item.tag.localeCompare(pTagTrademark) == 0) {
				retorno = item;
			}
		});
		return retorno;
	};

	/**
	 * Helper method: looks for a client. If it doesn't exist, throws an error
	 * @param  {String} pID - Id to look for
	 * @return {Object} 		 Found client
	 */
	var clientExists = function(pID) {
		var query = clientModel.findById(pID);
		return Q(query.exec()
		).then(function(pClient) {
			if (!pClient) {
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_INVALID_ID);
			}
			return pClient;
		}, function(pError){
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_INVALID_ID);
		});
	};

	/**
	 * Updates the product
	 * @param  {Object} pClient     The client to update his products
	 * @param  {Object} pTrademark  The trademark to update his products
	 * @param  {Object} pOldProduct Old product to update
	 * @param  {Object} pRequest    Express Request object
	 * @return {Object}             Returns a promise that updates the trademark
	 */
	var updateAProduct = function(pClient, pTrademark, pOldProduct, pRequest) {
		var indexTrademark;
		var indexProduct;
		var updatedProduct = 
		{
			tag : pOldProduct.tag,
			name : pRequest.body.name,
			logo : pRequest.body.logo,
			color : pRequest.body.color,
			enabled : pRequest.body.enabled
		};

		for (index = 0; index < pClient.trademarks.length; ++index) {
			if(pClient.trademarks[index].tag==pTrademark.tag) {
				indexTrademark=index;
		    }
		}
		for (index = 0; index < pClient.trademarks[indexTrademark].products.length; ++index) {
			if(pClient.trademarks[indexTrademark].products[index].tag==pOldProduct.tag) {
				indexProduct=index;
		    }
		}
		pClient.trademarks[indexTrademark].products[indexProduct] = updatedProduct;

		var updateClient = {
			trademarks : pClient.trademarks
		};

		return Q(clientModel.update({ _id : pClient._id }, { $set: updateClient }).exec());
	};

	/**
	 * Updates the trademark
	 * @param  {Object} pClient The client to update his trademarks
	 * @param  {Object} pOldSector Old trademark to update
	 * @param  {Object} pRequest   Express Request object
	 * @return {Object}            Returns a promise that updates the trademark
	 */
	var updateATrademark = function(pClient, pOldTrademark, pRequest) {
		var indexTrademark;
		var updatedTrademark = 
		{
			tag : pOldTrademark.tag,
			products : pOldTrademark.products,
			name : pRequest.body.name,
			logo : pRequest.body.logo,
			color : pRequest.body.color,
			enabled : pRequest.body.enabled
		};
		for (index = 0; index < pClient.trademarks.length; ++index) {
			if(pClient.trademarks[index].tag==pOldTrademark.tag) {
				indexTrademark=index;
		    }
		}
		pClient.trademarks[indexTrademark] = updatedTrademark;

		var updateClient = {
			trademarks : pClient.trademarks
		};
		return Q.when(clientModel.update({ _id : pClient._id }, { $set: updateClient }).exec());
	};

	/**
	 * Updates the client
	 * @param  {Object} pOldClient Old client to update
	 * @param  {Object} pRequest   Express Request object
	 * @return {Object}            Returns a promise that updates the client
	 */
	var updateAClient = function(pOldClient, pRequest) {
		var updatedClient = 
		{
			name : pRequest.body.name,
			logo : pRequest.body.logo,
			slogan : pRequest.body.slogan ? pRequest.body.slogan : '',
			color : pRequest.body.color,
			fields : pRequest.body.fields,
			enabled : pRequest.body.enabled
		};

		return Q(clientModel.update({ _id : pOldClient._id }, { $set: updatedClient }).exec());
	};

	/**
	 * function to save the products of the client
	 * @param  {String} pIdClient - Id of the client to update
	 * @param  {String} pTagTrademark - Tag of the trademark to update
	 * @param  {Object} pTagProduct - Tag to save in the db
	 * @param  {Object} pProduct - Trademark to push in the client array
	 * @return {Object} - Promise object
	 */
	var saveProduct = function(pIdClient, pTagTrademark, pTagProduct, pProduct) {
		var indexTrademark;
		return Q.when(pTagProduct.save()
		).then(function(pResult){
			return Q.when(clientModel.findById(pIdClient).exec()
			).then(function(pClient) {

				for (index = 0; index < pClient.trademarks.length; ++index) {
					if(pClient.trademarks[index].tag==pTagTrademark) {
						indexTrademark=index;
				    }
				}

				var products = utils.clone(pClient.trademarks[indexTrademark].products);
				if (products == null) {
					products = [];
				}
				products[products.length] = pProduct;

				var trademarks = utils.clone(pClient.trademarks);
				trademarks[indexTrademark].products = products; 

				return Q.when(clientModel.update({ _id : pClient._id }, {$set: {trademarks: trademarks}}).exec());
			}, function(pError){
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_DATABASE);
				//console.log("CLIENT FAILED:");
			});
		},function(pError){
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_DATABASE);
			//console.log('SAVE TRADEMARK FAILED');
		});
	};

	/**
	 * function to save the trademarks of the client
	 * @param  {String} pIdClient - Id of the client to update
	 * @param  {Object} pTagTrademark - Tag to save in the db
	 * @param  {Object} pTrademark - Trademark to push in the client array
	 * @return {Object} - Promise object
	 */
	var saveTrademark = function(pIdClient, pTagTrademark, pTrademark) {
		return Q.when(pTagTrademark.save()
		).then(function(pResult){
			return Q.when(clientModel.findById(pIdClient).exec()
			).then(function(pClient) {
				var newTrademark = {
					name: pTrademark.name,
					logo: pTrademark.logo,
					tag: pTrademark.tag,
					isCompetency: false,
					enabled : pTrademark.enabled
					//color: pTrademark.color
				};

				var trademarks = utils.clone(pClient.trademarks);
				trademarks[trademarks.length] = newTrademark;
				return Q.when(clientModel.update({ _id : pClient._id }, {$set: {trademarks: trademarks}}).exec()
				).then(function(pResult){
					//console.log('TRADEMARK SAVE');
					if(pTrademark.products) {
						return pTrademark.products.reduce(function(sequence, product) {
							return sequence.then(function() {
								return utils.isHashTagValid(app, product.tag);
							}).then(function(result) {
								if (result) {
									//console.log(result);
									var newTagProduct = new tagModel({
										tag: product.tag,
										codeCollection: app.constants.PRODUCTS_TAGS
									});
									return saveProduct(pIdClient, pTrademark.tag, newTagProduct, product);
								}
								throw utils.createError(app.constants.CODE_ERROR, 
									app.constants.ERROR_INVALID_HASHTAG_PRODUCT);
							});
						}, Q.resolve());
					}
				},function(pError){
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_DATABASE);
				});
			}, function(pError){
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_DATABASE);
			});
		},function(pErrorGrande){
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_DATABASE);
		});
	};

	/**
	 * function to save a existing trademark in the db
	 * @param  {String} pIdClient - Id of the client to update
	 * @param  {Object} pTrademark - Trademark to push in the client array
	 * @return {Object} - Promise object
	 */
	var saveTrademarkExisting = function(pIdClient, pTrademark) {
		return Q.when(clientModel.findById(pIdClient).exec()
		).then(function(pClient) {
			var newTrademark = {
				name: pTrademark.name,
				logo: pTrademark.logo,
				tag: pTrademark.tag,
				products: pTrademark.products,
				isCompetency: true,
				enabled : pTrademark.enabled
				//color: pTrademark.color
			};

			var trademarks = utils.clone(pClient.trademarks);
			trademarks[trademarks.length] = newTrademark;
			clientModel.update({ _id : pClient._id }, {$set: {trademarks: trademarks}}).exec();
		}, function(pError){
			throw utils.createError(app.constants.CODE_ERROR, 
				app.constants.ERROR_DATABASE);
		});
	};

	/**
	 * function to save the client in the db
	 * @param  {Object} pClient - Client object to save in the database
	 * @param  {Object} pTagClient - Client tag to save in the database
	 * @return {Object} - Promise object
	 */
	var saveClient = function(pClient, pTagClient) {
		return Q.when(pTagClient.save()
			).then(function(pResult){
				Q.when(pClient.save());
			},function(pError){
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_DATABASE);
				//console.log('SAVE CLIENT FAILED');
			});
	};

	return {

		/**
		 * READ a list of clients
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getClients: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getClientsFunc = Q.nbind(clientModel.find, clientModel);
				return getClientsFunc({}, null, {sort:{'name':1}})
				.then(function(pClients) {
					return new Response(pClients);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a client with his data
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getClient: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var query = Q.nbind(clientModel.find, clientModel);
				return query({ 'tag' : pRequest.params.tag})
				.then(function(pClients) {
					return new Response(pClients);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single client
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createClient: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var client;
				var currentdate = utils.getCurrentDate();
				client = new clientModel({
					name: pRequest.body.name,
					tag: pRequest.body.tag,
					logo : pRequest.body.logo,
					slogan: pRequest.body.slogan,
					color: pRequest.body.color,
					createdBy: pRequest.body.createdBy,
					createdDate: currentdate,
					fields: pRequest.body.fields,
					enabled : pRequest.body.enabled
				});

				return utils.isHashTagValid(app, pRequest.body.tag)
				.then(function(result) {
					if (result) {
						var newTagClient = new tagModel({
							tag: pRequest.body.tag,
							codeCollection: app.constants.CLIENTS_TAGS
						});
						return saveClient(client, newTagClient);
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG_CLIENT);
				}).then(function() {
					//CLIENT ARE SAVE AND EVALUATE THE TRADEMARKS
					if(pRequest.body.trademarks) {
						return pRequest.body.trademarks.reduce(function(sequence, trademark) {
							return sequence.then(function() {
								if(trademark.isNew===true) {
									return utils.isHashTagValid(app, trademark.tag);
								} else {
									return true;
								}
							}).then(function(result) {
								if (result) {
									//Si no es un trademark nuevo
									if(result==true){
										return saveTrademarkExisting(client._id, trademark);
									} else {
										var newTagTrademark = new tagModel({
											tag: trademark.tag,
											codeCollection: app.constants.TRADEMARKS_TAGS
										});
										return saveTrademark(client._id, newTagTrademark, trademark);
									}
								}
								throw utils.createError(app.constants.CODE_ERROR, 
									app.constants.ERROR_INVALID_HASHTAG_TRADEMARK);
							});
						}, Q.resolve());
					} else {
						return new Response(client);
					}
				//}).then(function() {
					// All is ok, so find the client in the db and return it!
					//return Q.when(clientModel.findById(client._id).exec());
				}).then(function() {
					//return the client object
					//console.log('BIEN...');
					//console.log(client);
					return new Response(client);
				}).catch(function(pError) {
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
		 * CREATE trademarks
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createTrademark: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return clientExists(pRequest.params.id)
				.then(function(pClient) {
					if(pRequest.body.isNew===true) {
						return utils.isHashTagValid(app, pRequest.body.tag);
					} else {
						return true;
					}
				}).then(function(result) {
					if (result) {
						//Si no es un trademark nuevo
						if(result==true){
							return saveTrademarkExisting(pRequest.params.id, pRequest.body);
						} else {
							var newTagTrademark = new tagModel({
								tag: pRequest.body.tag,
								codeCollection: app.constants.TRADEMARKS_TAGS
							});
							return saveTrademark(pRequest.params.id, newTagTrademark, pRequest.body);
						}
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG_TRADEMARK);
				}).then(function() {
					// All is ok, so find the client in the db and return it!
					return Q.when(clientModel.findById(pRequest.params.id).exec());
				}).then(function(pClient) {
					//return the client object
					return new Response(pClient);
				}).catch(function(pError) {
					console.log(pError.stack);
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
		 * CREATE products
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createProduct: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return clientExists(pRequest.params.id)
				.then(function(pClient) {
					var trademark = tagExists(pClient.trademarks, pRequest.params.tag);
					if (trademark) {
						return pRequest.body.isNew ? utils.isHashTagValid(app, pRequest.body.tag) : true;
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG_TRADEMARK);
				}).then(function(result) {
					if (result) {
						var newTagProduct = new tagModel({
							tag: pRequest.body.tag,
							codeCollection: app.constants.PRODUCTS_TAGS
						});
						
						pRequest.body.isCompetency = result===true? true : false;
						return saveProduct(pRequest.params.id, pRequest.params.tag, newTagProduct, pRequest.body);
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG_PRODUCT);
				}).then(function() {
					// All is ok, so find the client in the db and return it!
					return Q.when(clientModel.findById(pRequest.params.id).exec());
				}).then(function(pClient) {
					//return the client object
					return new Response(pClient);
				}).catch(function(pError) {
					console.log(pError.stack);
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
		 * UPDATE a client data, no update trademarks, no update products
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateClient: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return clientExists(pRequest.params.id)
				.then(function(pClient) {
					if (pClient.tag !== pRequest.body.tag) { // The tag can't be updated
						throw utils.createError(app.constants.CODE_ERROR, 
							app.constants.ERROR_UPDATE_TAG);
					}
					return updateAClient(pClient, pRequest);
				})
				.then(function() {
					return new Response(app.constants.SUCCESS_UPDATE);
				})
				.catch(function(pError) {
					console.log(pError);
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
		 * UPDATE a trademark data, no update products
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateTrademark: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return clientExists(pRequest.params.id)
				.then(function(pClient) {

					var trademark = tagExists(pClient.trademarks, pRequest.params.tag);
					if (trademark) {
						if (trademark.tag !== pRequest.body.tag) {
							// The tag can't be updated
							throw utils.createError(app.constants.CODE_ERROR, 
								app.constants.ERROR_UPDATE_TAG);
						}
						return updateATrademark(pClient, trademark, pRequest);
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG_TRADEMARK);
				})
				.then(function() {
					return new Response(app.constants.SUCCESS_UPDATE);
				})
				.catch(function(pError) {
					console.log('Error')
					console.log(pError);
					//console.log(pError.stack);
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
		 * UPDATE a product data
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateProduct: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				return clientExists(pRequest.params.id)
				.then(function(pClient) {
					var trademark = tagExists(pClient.trademarks, pRequest.params.tag);
					if (trademark) {
						var product = tagExists(trademark.products, pRequest.params.tagProduct);
						if (product) {
							if (product.tag !== pRequest.body.tag) {
								// The tag can't be updated
								throw utils.createError(app.constants.CODE_ERROR, 
									app.constants.ERROR_UPDATE_TAG);
							}
							return updateAProduct(pClient, trademark, product, pRequest);
						}
					}
					throw utils.createError(app.constants.CODE_ERROR, 
						app.constants.ERROR_INVALID_HASHTAG_TRADEMARK);
				})
				.then(function() {
					return new Response(app.constants.SUCCESS_UPDATE);
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

		saveProductPhoto: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var fs = require('fs');
				var fileName = pRequest.files.trademarkPhoto.name;
				var directory = __dirname;
				var url = directory.replace('implementors','public/images/trademarks/');
				return Q.nfcall(fs.rename, pRequest.files.trademarkPhoto.path, url + fileName)
				.then(function() {
					return new Response(fileName);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_UPLOADING_FILE, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};