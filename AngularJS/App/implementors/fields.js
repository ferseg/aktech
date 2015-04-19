/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: fields.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var fieldsModel = app.models['fields'];
	return {
		/**
		 * READ a list of fields enableds
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getFields: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getFields = Q.nbind(fieldsModel.find, fieldsModel);
				return getFields({ enabled: true }, null, {sort: {'name': 1}})
				.then(function(pFields) {
					return new Response(pFields, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a list of fields enableds and exclusive for clients
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getExclusiveFields: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getFields = Q.nbind(fieldsModel.find, fieldsModel);
				return getFields({ 
					enabled: true, 
					isExclusive: true 
				}, null, {sort: {'name': 1}})
				.then(function(pFields) {
					return new Response(pFields, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a list of fields enableds and measurables for clients
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getMeasurablesFields: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getFields = Q.nbind(fieldsModel.find, fieldsModel);
				return getFields({ 
					enabled: true, 
					measurable: true 
				}, null, {sort: {'name': 1}})
				.then(function(pFields) {
					return new Response(pFields, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single field
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createField: function(pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var field = new fieldsModel({
					name: pRequest.body.name,
					fieldType: pRequest.body.fieldType,
					defaultValue: pRequest.body.defaultValue,
					required: pRequest.body.required,
					measurable: pRequest.body.measurable,
					enabled: pRequest.body.enabled,
					isExclusive: pRequest.body.isExclusive
				});
				field.save(function (pError) {
					if (pError) {
						exceptionsLogger.logError(pError);
						return pResponse.send(app.constants.CODE_SERVER_ERROR, pError);
					}
				});
				return new Response(field);
			}
		},

		/**
		 * UPDATE a single field
		 * @param  {Object} pRequest - Object with data from the request
		 * @return {Object} Return the response object or error
		 */
		updateField: function(pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var updatedField = 
				{
					fieldType: pRequest.body.fieldType,
					defaultValue: pRequest.body.defaultValue,
					required: pRequest.body.required,
					measurable: pRequest.body.measurable,
					enabled: pRequest.body.enabled,
					isExclusive: pRequest.body.isExclusive
				};
				return Q(fieldsModel.update({ _id : pRequest.params.id }, { $set: updatedField}).exec())
				.then(function(pData) {
					return new Response(pData);
				})
				.catch(function(pError) {
					if (pError) {
						exceptionsLogger.logError(app, pError);
						return new Response(pError, app.constants.CODE_SERVER_ERROR);
					}
				});
			}
		},

		/**
		 * DELETE a single field
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		deleteField: function(pRequest) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var removeField = Q.nbind(fieldsModel.findByIdAndRemove, fieldsModel);
				removeField(pRequest)
				.then(function() {
					return new Response(app.constants.SUCCESS_DELETE);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError, app.constants.CODE_SERVER_ERROR);
				});
			}
		}
	};
};