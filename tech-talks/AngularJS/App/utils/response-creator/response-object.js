/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: response-creator-class.js
 */

function ResponseCreator(pResponseObject, pResponseCode) {
	this.responseCode = pResponseCode;
	this.responseObject = pResponseObject;
}

module.exports = ResponseCreator;