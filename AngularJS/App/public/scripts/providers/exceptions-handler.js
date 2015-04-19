/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: exceptionHandler.js
 */

'use strict';

/*
 * This file overwrites Angular's default error handler with our custom errorLogService
 */


angular.module('CoesApp').provider('$exceptionHandler', {
	$get: function(errorHandlerService) {
		return (errorHandlerService);
	}
});