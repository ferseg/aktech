/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: chat.js
 */

angular.module('CoesApp').directive('chat', function () {
    return {
        restrict: "E",
        templateUrl: 'views/common/chat.html',
        controller: "ChatController",
        scope: {
            isOpen: '=',
            unreadedMessages: '=',
            reloadFunction: '='
        }
    };
});