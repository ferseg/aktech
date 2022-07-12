/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: templates.js
 */

var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var templatesModel = app.models['templates'];

	return {
		/**
		 * READ a template by the tag
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getTemplateByTag: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getTemplates = Q.nbind(templatesModel.find, templatesModel);
				return getTemplates({tag: pRequest.params.tag}, null, {})
				.then(function(pTemplates) {
					return new Response(pTemplates[0]);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a list of templates order by tag
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getTemplates: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getTemplates = Q.nbind(templatesModel.find, templatesModel);
				return getTemplates({}, null, {sort:{'tag':1}})
				.then(function(pTemplates) {
					return new Response(pTemplates);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single template
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createTemplate: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var template;
				var newUserModifications = {timestamp: utils.getCurrentDateTime(), tagUser: pRequest.params.user};
				template = new templatesModel({
					tag: pRequest.body.tag,
					html: pRequest.body.html,
					userModifications: [newUserModifications]
				});
				return Q.when(template.save())
				.then(function() {
					return new Response(template);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single permission
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateTemplate: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var findTemplate = Q.nbind(templatesModel.find, templatesModel);
				var updateTemplate = Q.nbind(templatesModel.findByIdAndUpdate, templatesModel);

				var template;
				var newUserModifications = {timestamp: utils.getCurrentDateTime(), tagUser: pRequest.params.user};
			
				
				return findTemplate({tag: pRequest.params.tag})
				.then(function(pTemplate) {
					if(pTemplate.length!==0){
						var templateToUpdate = pTemplate[0];
						templateToUpdate.html = pRequest.body.html;
						templateToUpdate.userModifications.push(newUserModifications);

						return Q.when(templatesModel.update({ _id : templateToUpdate._id }, 
							{$set: {html: templateToUpdate.html, userModifications: templateToUpdate.userModifications}}).exec());
					}
				});
			}
		}
	};
};