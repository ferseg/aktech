/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: schedules.js
 */


var Q = require('q');

var utils = require('../utils/common-functions.js');
var exceptionsLogger = require('../utils/loggly.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var scheduleModel = app.models['schedules'];

	return {
		/**
		 * READ a list of schedules enabled
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSchedules: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSchedules = Q.nbind(scheduleModel.find, scheduleModel);
				return getSchedules({ enabled: true })
				.then(function(pSchedules) {
					return new Response(pSchedules, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a list of schedules enabled by day and time params
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSchedulesByDayTime: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSchedules = Q.nbind(scheduleModel.find, scheduleModel);
				return getSchedules({ enabled: true, 'programming.day': pRequest.params.day, 'programming.hour': pRequest.params.hour })
				.then(function(pSchedules) {
					return new Response(pSchedules, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * READ a single schedule by id
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		getSchedulesById: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var getSchedulesById = Q.nbind(scheduleModel.findById, scheduleModel);
				return getSchedulesById(pRequest.params.id)
				.then(function(pSchedule) {
					return new Response(pSchedule, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * CREATE a single schedule
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		createSchedule: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var schedule;
				schedule = new scheduleModel({
					name: pRequest.body.name,
					enabled: pRequest.body.enabled,
					programming: pRequest.body.programming
				});
				return Q.when(schedule.save())
				.then(function() {
					return new Response(schedule);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return new Response(pError.message, app.constants.CODE_SERVER_ERROR);
				});
			}
		},

		/**
		 * UPDATE a single schedule
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {Object} Return the response object or error
		 */
		updateSchedule: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var schedule = {
					name: pRequest.body.name,
					enabled: pRequest.body.enabled,
					programming: pRequest.body.programming
				};
				var updateSchedule = Q.nbind(scheduleModel.findByIdAndUpdate, scheduleModel);
				updateSchedule(pRequest.params.id, schedule)
				.then(function() {
					return pResponse.send(schedule);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return pResponse.send(app.constants.CODE_SERVER_ERROR, pError);
				});
			}
		},

		/**
		 * DELETE a single schedule
		 * @param  {Object} pRequest - Object with data from the request
		 * @param  {Object} pResponse - Object to response to the client
		 * @return {[type]}     [description]
		 */
		removeSchedule: function (pRequest, pResponse) {
			if(!pRequest.user) {
				return new Response(app.constants.CODE_UNAUTHORIZED);
			} else {
				var updateSchedule = Q.nbind(scheduleModel.findByIdAndRemove, scheduleModel);
				updateSchedule(pRequest.params.id)
				.then(function() {
					return new Response(app.constants.SUCCESS_DELETE, app.constants.CODE_OK);
				})
				.catch(function(pError) {
					exceptionsLogger.logError(app, pError);
					return pResponse.send(app.constants.CODE_SERVER_ERROR, pError);
				});
			}
		}
	};
};
