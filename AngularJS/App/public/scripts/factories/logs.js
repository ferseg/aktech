/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: logs.js
 */

//Factory to manage the users operations to the web server
angular.module('CoesApp').factory('logClass', ['request', function(request) {
	return {
		/**
		 * constructor
		 * @param  {String} pType - type of event. ie: LOGIN, USER CREATED...
		 * @param  {String} pCategory - category of event. ie: ERROR, INFORMATION
		 * @param  {String} pDescription - description of the event
		 */
		log: function(pType, pCategory, pDescription) {
			this.type = pType;
			this.category = pCategory;
			this.description = pDescription;
		},
		/**
		 * constructor
		 * @param  {String} pType - type of event. ie: LOGIN, USER CREATED...
		 * @param  {String} pCategory - category of event. ie: ERROR, INFORMATION
		 * @param  {String} pDescription - description of the event
		 * @param  {String} pIdUser - id of the user who make the event
		 */
		log: function(pType, pCategory, pDescription, pIdUser) {
			this.type = pType;
			this.category = pCategory;
			this.description = pDescription;
			this.idUser = pIdUser;
		},
		/**
		 * constructor
		 * @param  {String} pType - type of event. ie: LOGIN, USER CREATED...
		 * @param  {String} pCategory - category of event. ie: ERROR, INFORMATION
		 * @param  {String} pDescription - description of the event
		 * @param  {String} pIdUser - id of the user who make the event
		 * @param  {Array} pIds - Array of ids relation to the event
		 */
		log: function(pType, pCategory, pDescription, pIdUser, pIds) {
			this.type = pType;
			this.category = pCategory;
			this.description = pDescription;
			this.idUser = pIdUser;
			this.ids = pIds;
		},
		/**
		 * constructor
		 * @param  {String} pType - type of event. ie: LOGIN, USER CREATED...
		 * @param  {String} pCategory - category of event. ie: ERROR, INFORMATION
		 * @param  {String} pDescription - description of the event
		 * @param  {String} pIdUser - id of the user who make the event
		 * @param  {Array} pIds - Array of ids relation to the event
		 * @param  {String} pExtraInfo - extra info of the error, is the error returned from the server
		 */
		log: function(pType, pCategory, pDescription, pIdUser, pIds, pExtraInfo) {
			this.type = pType;
			this.category = pCategory;
			this.description = pDescription;
			this.idUser = pIdUser;
			this.ids = pIds;
			this.extraInfo = pExtraInfo;
		},
		/**
		 * constructor
		 * @param  {String} pType - type of event. ie: LOGIN, USER CREATED...
		 * @param  {String} pCategory - category of event. ie: ERROR, INFORMATION
		 * @param  {String} pDescription - description of the event
		 * @param  {String} pExtraInfo - extra info of the error, is the error returned from the server
		 */
		logWithExtraInfo: function(pType, pCategory, pDescription, pExtraInfo) {
			this.type = pType;
			this.category = pCategory;
			this.description = pDescription;
			this.extraInfo = pExtraInfo;
		},
		/**
		 * function to post the log in the db
		 * @param  {String} pUrl - url of the rest point
		 * @param  {Object} pLog - object to save in the db
		 */
		post: function(pUrl, pLog){
			request.post(pUrl, pLog);
		}
	};
}]);