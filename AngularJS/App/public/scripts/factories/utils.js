/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: utils.js
 */

'use strict';

//Factory to manage the users operations to the web server
angular.module('CoesApp').factory('utils', ['sessionService', 'generalSettings', 'request', function(sessionService, generalSettings, request) {
	var url = generalSettings.getSetting('serviceURL');
	return {
		/**
		 * Clone the object pass by parameter
		 * @param  {Object} pObject - Object to clone
		 * @return {Object} Object cloned
		 */
		clone: function(pObject) {
		    if (null === pObject || 'object' !== typeof pObject) {
				return pObject;
		    }
		    var copy = pObject.constructor();
		    for (var attr in pObject) {
				if (pObject.hasOwnProperty(attr)) {
					copy[attr] = pObject[attr];
				}
		    }
		    return copy;
		},
		/**
		 * Get the current user in the system
		 * @return {Object} Return the object of the current user in the system
		 */
		getCurrentUser: function(){
			if(sessionService.getCurrentUser()){
				return sessionService.getCurrentUser();
			} else {
				var promiseUser = request.get(url+'/api/currentUser/');
				promiseUser.then(function(pUser){
					sessionService.authSuccess(pUser);
					return sessionService.getCurrentUser();
				}, function(pError, pStatus){
					return false;
				});
			}
		},

		/**
		 * function to generate the tag with lowercase and without white spaces
		 * @param  {String} pString - string to transform in tag
		 * @return {String} - the tag generate
		 */
		generateTag: function(pString) {
			var tag = '#' + pString.replace(/ /gi,'-');
			tag = tag.replace(/á/gi,'a');
			tag = tag.replace(/é/gi,'e');
			tag = tag.replace(/í/gi,'i');
			tag = tag.replace(/ó/gi,'o');
			tag = tag.replace(/ú/gi,'u');
			tag = tag.replace(/ä/gi,'a');
			tag = tag.replace(/ë/gi,'e');
			tag = tag.replace(/ï/gi,'i');
			tag = tag.replace(/ö/gi,'o');
			tag = tag.replace(/ü/gi,'u');			
			return tag.toLowerCase();
		},

		/**
		 * return is the tag is valid
		 * @param  {String}  pTag tag to evaluate
		 * @return {Boolean}      true is the tag is valid, false if not
		 */
		isValidTag: function (pTag) {
			return pTag.match(/(^#)((([ñA-Za-z _]+)(.*))*)$/);
		},

		isEmptyObject: function(pObject) {
			for(var key in pObject) {
				if (pObject.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		},

		/**
		 * generic funtion the change the focus element
		 * @param  {String} pElement - id of the element to focus (ie. #users-table)
		 */
		changeFocus: function(pElement) {
			$(pElement).focus();
		},

		unifyArrays: function(pCumulativeArray, pNextElement) {
			if (!pCumulativeArray) {
				pCumulativeArray = [];
			}
			return pNextElement ?
				pCumulativeArray.concat(pNextElement)
				: pCumulativeArray;
		},

		removeArrayNullItems: function(pArray) {
			var newArray = [];
			pArray.forEach(function(pElement) {
				if (pElement !== null) {
					newArray.push(pElement);
				}
			});
			return newArray;
		},

		numberWithCommas: function(pNumber) {
			//Seperates the components of the number
		    var n= pNumber.toString().split(".");
		    //Comma-fies the first part
		    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		    if(n.length>1) {
		    	n[1] = n[1].substring(0,2);
		    }
		    //Combines the two sections
		    return n.join(".");
			//pNumber = parseFloat(pNumber).toFixed(2)
			//return pNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},

		/**
		 * Sort an array of json
		 * @param  {Array} pArray    Array of json to sort
		 * @param  {String} pProperty label of the property of the object
		 * @param  {Boolean} pAsc      true if is asc, false if is desc
		 * @return {Array}           Array sort
		 */
		sortArray: function(pArray, pProperty, pAsc) {
			pArray = pArray.sort(function(a, b) {
				if (pAsc) 
					return (a[pProperty] > b[pProperty]) ? 1 : ((a[pProperty] < b[pProperty]) ? -1 : 0);
				else 
					return (b[pProperty] > a[pProperty]) ? 1 : ((b[pProperty] < a[pProperty]) ? -1 : 0);
			});
		},

		trimBeginEndSpaces: function (pStr) {
			return pStr.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
	};
}]);