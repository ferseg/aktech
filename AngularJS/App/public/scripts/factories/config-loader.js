/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: config-loader.js
 */

'use strict';

angular.module('CoesApp').factory('generalSettings', function() {
	// Current environmet: develop, staging or production
	var currentEnvironmet = 'develop';

	var configuration =
	{
		develop:
		{
			serviceURL:'http://localhost:4242',
			currentURL:'http://127.0.0.1:9000/#/',
			logglyURL:'https://logs-01.loggly.com/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
			remoteFilesPath: '/public/files/',
			articleTitleMaxLength: 15,
			articleDescriptionMaxLength: 20
		},
		staging:
		{
			serviceURL:'http://coes.intelligentsense.com:8000',
			currentURL:'http://coes.intelligentsense.com:8000/#/',
			logglyURL:'https://logs-01.loggly.com/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
			remoteFilesPath: '/public/files/',
			articleTitleMaxLength: 15,
			articleDescriptionMaxLength: 50
		},
		beta:
		{
			serviceURL:'http://www.coescomunicacion.com:8000',
			currentURL:'http://www.coescomunicacion.com:8000/#/',
			logglyURL:'https://logs-01.loggly.com/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
			remoteFilesPath: '/public/files/',
			articleTitleMaxLength: 15,
			articleDescriptionMaxLength: 50
		},
		production: {
			serviceURL: 'http://www.coescomunicacion.com:7000',
			currentURL: 'http://www.coescomunicacion.com:7000/#/',
			logglyURL: 'https://logs-01.loggly.com/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
			remoteFilesPath: '/public/files/',
			articleTitleMaxLength: 15,
			articleDescriptionMaxLength: 50
		}
	};
	return {
		getConfiguration : function() {
			return configuration[currentEnvironmet];
		},
		getSetting : function(pSettingName) {
			return configuration[currentEnvironmet][pSettingName];
		},
		getEnvironment: function() {
			return currentEnvironmet;
		}
	};
});

