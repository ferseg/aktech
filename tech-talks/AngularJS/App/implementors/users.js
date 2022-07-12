/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: users.js
 */

var passport = require('passport');
var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var userModel = app.models['users'];
	var clientModel = app.models['clients'];
	var tagModel = app.models['tags'];

	/**
	 * function to save the user in the db
	 * @param  {Object} pUser - User object to save in the database
	 * @param  {Object} pTagUser - User tag to save in the database
	 * @return {Object} - Promise object
	 */
	var saveUser = function(pUser, pTagUser) {
		return Q.when(pTagUser.save()
			).then(function(pResult){
				Q.when(pUser.save());
			},function(pError){
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_DATABASE);
			});
	};

	/**
	 * Helper method: looks for a user. If it doesn't exist, throws an error
	 * @param  {String} pHashTag Hashtag to look for
	 * @return {Object} 		 Found user
	 */
	var userExists = function(pHashTag) {
		var query = userModel.find( 
			{
				'tag':pHashTag
			} 
		);
		return Q(query.exec())
		.then(function(pUser) {
			if (pUser.length < 1) {
				throw utils.createError(app.constants.CODE_ERROR, 
					app.constants.ERROR_INVALID_HASHTAG);
			}
			return pUser[0];
		});
	};

	/**
	 * Updates the user
	 * @param  {Object} pOldUser   Old user to update
	 * @param  {Object} pRequest   Express Request object
	 * @return {Object}            Returns a promise that updates the user
	 */
	var updateAUser = function(pOldUser, pRequest) {
		/*var updatedUser = 
		{
			name: pRequest.body.name,
			lastName1: pRequest.body.lastName1,
			lastName2: pRequest.body.lastName2 ? pRequest.body.lastName2 : '',
			username: pRequest.body.username,
			password: pRequest.body.password,
			enabled: pRequest.body.enabled,
			urlFoto: pRequest.body.urlFoto,
			permissions: pRequest.body.permissions,
			isAdmin: pRequest.body.isAdmin,
			clientTag: pRequest.body.clientTag,
			advanceUser: pRequest.body.advanceUser
		};

		return Q(userModel.save({ _id : pOldUser._id }, { $set: updatedUser }).exec());*/
		
		pOldUser.name = pRequest.body.name,
		pOldUser.lastName1 = pRequest.body.lastName1,
		pOldUser.lastName2 = pRequest.body.lastName2 ? pRequest.body.lastName2 : '',
		pOldUser.username = pRequest.body.username,
		pOldUser.password = pRequest.body.password,
		pOldUser.enabled = pRequest.body.enabled,
		pOldUser.urlFoto = pRequest.body.urlFoto,
		pOldUser.permissions = pRequest.body.permissions,
		pOldUser.isAdmin = pRequest.body.isAdmin,
		pOldUser.clientTag = pRequest.body.clientTag,
		pOldUser.advanceUser = pRequest.body.advanceUser;
		return Q.when(pOldUser.save());
	};

	return {

		/**
		 * Get the current user
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getCurrentUser: function(pRequest, pResponse){
			var deferred = Q.defer();

			if(pRequest.user) {
				var query = Q.nbind(clientModel.find, clientModel);
				query({ 'tag' : {$in: pRequest.user.clientTag} })
				.then(function(pClients) {
					var response = new Response({
						user: pRequest.user,
						clients: pClients
					});

					deferred.resolve(response);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					deferred.reject(new Response(pError));
				});
			} else {
				deferred.resolve(new Response(pRequest.user));
			}

			//return new Response(pRequest.user);
			return deferred.promise;
		},

		/**
		 * Function to login
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @param  {[type]} pNext     [description]
		 * @return {Object} Return the response object or error
		 */
		login: function(pRequest, pResponse, pNext) {
			var deferred = Q.defer();
			passport.authenticate('local', function(pError, pUser, pInfo) {
				if (pError) {
					exceptionsLogger.logError(app, pError);
					deferred.resolve(new Response(app.constants.ERROR_INVALID_ID, pError));
					return deferred.promise;
				}
				if (!pUser) {
					deferred.resolve(new Response(app.constants.CODE_ERROR, 'ERROR'));
					return deferred.promise;
				}
				pRequest.logIn(pUser, function(pError) {
					if (pError) { 
						return pNext(pError);
					}

					var query = Q.nbind(clientModel.find, clientModel);
					return query({ 'tag' : {$in: pUser.clientTag} })
					.then(function(pClients) {
						deferred.resolve(new Response({
							user: pUser,
							clients: pClients
						}));
					})
					.catch(function(pError) {
						deferred.reject(new Response(pError));
					});

					//deferred.resolve(new Response(pUser));
					return deferred.promise;
				});
			})(pRequest, pResponse, pNext);
			return deferred.promise;
		},

		/**
		 * logout
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 */
		logout: function(pRequest, pResponse){
			pRequest.logout();
			return new Response({}, app.constants.CODE_OK);
		},

		/**
		 * READ a list of users order by Name
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getUsers: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getUsers = Q.nbind(userModel.find, userModel);
				return getUsers({}, null, {
					sort:{
						//'enabled':-1,
						'name':1
					}
				})
				.then(function(pUsers) {
					return new Response(pUsers);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a list of users by client
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getUsersByClient: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getUsers = Q.nbind(userModel.find, userModel);
				return getUsers({clientTag: pRequest.params.clientTag, enabled: true}, null, {
					sort:{
						//'enabled':-1,
						'name':1
					}
				})
				.then(function(pUsers) {
					return new Response(pUsers);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a user by email
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getUserByEmail: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getUsers = Q.nbind(userModel.find, userModel);
				return getUsers({ username: pRequest.params.email })
				.then(function(pUsers) {
					return new Response(pUsers);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * Post images in the server
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {String} - The filename save in the server
		 */
		saveUserPhoto: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var fs = require('fs');
				var fileName = pRequest.files.userPhoto.name;
				var directory = __dirname;
				var url = directory.replace('implementors','public/images/');
				return Q.nfcall(fs.rename, pRequest.files.userPhoto.path, url + fileName)
				.then(function() {
					return new Response(fileName);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_UPLOADING_FILE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single user
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createUser: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var user;
				user = new userModel({
					name: pRequest.body.name,
					lastName1: pRequest.body.lastName1,
					lastName2: pRequest.body.lastName2,
					username: pRequest.body.username,
					password: pRequest.body.password,
					enabled: pRequest.body.enabled,
					urlFoto: pRequest.body.urlFoto,
					tag: pRequest.body.tag,
					permissions: pRequest.body.permissions,
					isAdmin: pRequest.body.isAdmin,
					clientTag: pRequest.body.clientTag,
					advanceUser: pRequest.body.advanceUser
				});
				//if(user.isAdmin) {
					return utils.isHashTagValid(app, pRequest.body.tag)
					.then(function(result) {
						if (result) {
							var newTagUser = new tagModel({
								tag: pRequest.body.tag,
								codeCollection: app.constants.USERS_TAGS
							});
							return saveUser(user, newTagUser);
						}
						throw utils.createError(app.constants.CODE_ERROR, 
							app.constants.ERROR_INVALID_HASHTAG);
					}).then(function() {
						return new Response(user);
					}).catch(function(pError) {
						exceptionsLogger.logError(app, pError);

						if (pError.http_code) {
							return new Response(pError.message, pError.http_code);
						} else {
							return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
						}
					});
				/*} else {
					return Q.when(user.save())
					.then(function() {
						return new Response(user);
					})
					.catch(function(pError) {
						exceptionsLogger.logError(app, pError);

						if (pError.http_code) {
							return new Response(pError.message, pError.http_code);
						} else {
							return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
						}
					});
				}*/
			}
		},

		/**
		 * UPDATE a single user
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateUser: function (pRequest, pResponse){
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				if(pRequest.body.isAdmin){
					return userExists(pRequest.body.tag)
					.then(function(pUser) {
						if (pUser.tag !== pRequest.body.tag) { // The tag can't be updated
							throw utils.createError(app.constants.CODE_ERROR, 
								app.constants.ERROR_UPDATE_TAG);
						}
						return updateAUser(pUser, pRequest);
					})
					.then(function() {
						return new Response(app.constants.SUCCESS_UPDATE);
					})
					.catch(function(pError) {
						//console.log(pError);
						if (pError.http_code) {
							return new Response(pError.message, pError.http_code);
						} else {
							exceptionsLogger.logError(app, pError);
							return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
						}
					});
				} else {
					var query = Q.nbind(userModel.findById, userModel);

					return query(pRequest.params.id)
					.then(function(user) {
						user.name = pRequest.body.name;
						user.lastName1 = pRequest.body.lastName1;
						user.lastName2 = pRequest.body.lastName2;
						user.username = pRequest.body.username;
						user.password = pRequest.body.password;
						user.enabled = pRequest.body.enabled;
						user.urlFoto = pRequest.body.urlFoto;
						user.permissions = pRequest.body.permissions;
						user.isAdmin = pRequest.body.isAdmin;
						user.clientTag = pRequest.body.clientTag;
						user.advanceUser = pRequest.body.advanceUser;
						return Q.when(user.save())
						.then(function() {
							return new Response(app.constants.SUCCESS_UPDATE, app.constants.CODE_OK);
						})
						.catch(function(pError) {
							exceptionsLogger.logError(pError);
							throw app.constants.ERROR_DATABASE;
						});
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
		}
	};
};