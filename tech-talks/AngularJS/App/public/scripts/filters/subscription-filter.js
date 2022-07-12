/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: subscription-filter.js
 */

angular.module('CoesApp').filter('subscription', function($filter) {
	return function(pSubscription) {
		var subscriptionString = '';	

		if (pSubscription.tagsTrademarks != null && pSubscription.tagsTrademarks.length>0) {
			pSubscription.tagsTrademarks.forEach(function(pTagTrademark, pIndex) {
				subscriptionString = subscriptionString + pTagTrademark + ' - ';
			});
			return subscriptionString.slice(0, -3) + ' desde ' + 
				$filter('date')(pSubscription.dateStart, 'dd/MMM/yyyy') + ' hasta ' + $filter('date')(pSubscription.dateEnd, 'dd/MMM/yyyy');
		}

		if (pSubscription.tagSectors != null && pSubscription.tagSectors.length>0) {
			pSubscription.tagSectors.forEach(function(pTagSector, pIndex) {
				subscriptionString = subscriptionString + pTagSector + ' - ';
			});
			return subscriptionString.slice(0, -3) + ' desde ' + 
				$filter('date')(pSubscription.dateStart, 'dd/MMM/yyyy') + ' hasta ' + $filter('date')(pSubscription.dateEnd, 'dd/MMM/yyyy');
		}
		
		return 'La subscripción no tiene marcas ni sectores';
	}
});