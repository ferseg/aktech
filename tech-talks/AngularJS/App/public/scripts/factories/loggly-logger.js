/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: loggly-logger.js
 */

'use strict';

angular.module('CoesApp').factory('logglyService', function(generalSettings) {

	return {
		logError: function(pError) {
			var logglyUrl = generalSettings.getSetting('logglyURL');
			var errorObject = {
				type: 'ERROR',
				message: pError.message,
				cause: pError.cause,
				url: pError.url,
				module: 'Frontend',
				environment: generalSettings.getEnvironment()
			};
			// Can't use request, because it depends on $http and generates a circular dependency
			// Using jQuery to make the request
			jQuery.ajax({
				method: 'POST',
				url: logglyUrl,
				contentType: 'json',
				crossDomain: true,
				data: errorObject
			}).done(function(result) {
				// Log Sent
			});
		}
	};
});