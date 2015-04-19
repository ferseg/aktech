/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: media-types-service.js
 */

'use strict';

angular.module('CoesApp').service('MediaTypesService', function(generalSettings, request) {
	var baseUrl = generalSettings.getSetting('serviceURL');
	var mediatypesURL = baseUrl + '/api/media';

	this.getMediaTypes = function() {
		return request.get(mediatypesURL);
	};

	this.saveMediaType = function(pMediaType) {
		return request.post(mediatypesURL, pMediaType);
	};

	this.updateMediaType = function(pMediaType) {
		return request.save(mediatypesURL + '/%23' + pMediaType.tag.substr(1), pMediaType);
	};
});