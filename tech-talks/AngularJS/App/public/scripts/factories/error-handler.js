/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: errorHandler.js
 */

'use strict';

angular.module('CoesApp').factory('errorHandlerService', function($log, $window, logglyService) {
	function log(pException, pCause) {
		// Pass error to Angular's default handler
		$log.error.apply($log, arguments);

		// Custom error loggin
		var error = {
			message: pException.toString(),
			cause: pCause || '',
			url: $window.location.href
		};
		try {
			logglyService.logError(error);
		} catch(logginError) {
            $log.log( loggingError );
        }
	}
	return (log);
});