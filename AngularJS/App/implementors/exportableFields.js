/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: exportableFields.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var exportableFieldsModel = app.models['exportableFields'];

	return {
		/**
		 * READ a exportable fields by the tag
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getExportableFieldsByTag: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getExportables = Q.nbind(exportableFieldsModel.find, exportableFieldsModel);
				return getExportables({tag: pRequest.params.tag}, null, {})
				.then(function(pExportableFields) {
					return new Response(pExportableFields[0]);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a list of exportable fields
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getExportableFields: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getExportables = Q.nbind(exportableFieldsModel.find, exportableFieldsModel);
				return getExportables({}, null, {})
				.then(function(pExportableFields) {
					return new Response(pExportableFields);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single exportable fields
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createExportableFields: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var exportableFields;
				exportableFields = new exportableFieldsModel({
					tag: pRequest.body.tag,
					fields: pRequest.body.fields
				});
				return Q.when(exportableFields.save())
				.then(function() {
					return new Response(exportableFields);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single exportable fields
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateExportableFields: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var findExportableFields = Q.nbind(exportableFieldsModel.find, exportableFieldsModel);			
				var updateExportableFields = Q.nbind(exportableFieldsModel.findByIdAndUpdate, exportableFieldsModel);

				return findExportableFields({tag: pRequest.params.tag})
				.then(function(pExportableFields) {
					if(pExportableFields.length!==0){
						var exportableFieldsToUpdate = pExportableFields[0];
						exportableFieldsToUpdate.fields = pRequest.body.fields;

						return Q.when(exportableFieldsModel.update({ _id : exportableFieldsToUpdate._id }, 
							{$set: {fields: exportableFieldsToUpdate.fields}}).exec());
					}
				});
			}
		}
	};
};