/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: config.js
 */

/*
Environment configuration
*/

var configuration = 
{
	develop:
	{
		connectionString:'mongodb://dev-user:1q2w3e4r@ds027829.mongolab.com:27829/coes-dev',
		port:4242,
		urlClient:'http://127.0.0.1:9000/#/',
		enableCORS:true,
		loggly_host: 'logs-01.loggly.com',
		loggly_path: '/inputs/9b369756-ca21-4ed6-90e5-59de4455243d/tag/http/',
		files_path: '/public/files',
		urlServer: 'http://localhost:4242/'
	}
};

var currentEnvironment = 'develop';

exports.getSetting = function(pSettingName) {
	return configuration[currentEnvironment][pSettingName];
};

exports.getEnvironment = function() {
	return currentEnvironment;
}