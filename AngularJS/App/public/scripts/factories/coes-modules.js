/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: coes-modules.js
 */

angular.module('CoesApp').factory('coesModules', function() {
	var modules = [
		{
			link: '/users',
			accessedBy: ['ADM', 'SUP'],
			label: 'Usuarios',
			sort: 1
		}
	];

	return {
		getUsersMenu: function(pPermissions) {
			var result = [];

			if (pPermissions.length===0) {
				result.push({
					link: '/dashboard',
					accessedBy: ['ADM', 'SUP'],
					label: 'Dashboard',
					sort: 1
				});
			}

			modules.forEach(function(pModule) {
				for (var permissionsCounter = 0; permissionsCounter < pPermissions.length; permissionsCounter++) {
					if (pModule.accessedBy.indexOf(pPermissions[permissionsCounter]) >= 0) {
						result.push(pModule);
						return;
					}
				}
			});
			result.sort(function(pModuleA, pModuleB) {
				return pModuleA.sort - pModuleB.sort;
			});
			return result;
		}
	};

});