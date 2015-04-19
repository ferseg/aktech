/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: chat.js
 */
angular.module('CoesApp').controller('ChatController', function ($scope, $sce, $rootScope, generalSettings, socket, sessionService,
	UsersService, MessagesService, $rootScope, $location) {

	$scope.usersTags = ['#todos'];
	$scope.messages = [];
    $scope.msjToSend = '';
    $scope.numberMessagesUnread = 0;
    $scope.haveMessagesUnread = false;
    $scope.socketIoURL = $sce.trustAsResourceUrl(generalSettings.getSetting('serviceURL') + '/socket.io/socket.io.js');

    $scope.$watch('numberMessagesUnread', function(pNewValue) {
    	$scope.unreadedMessages = pNewValue;
    });

	var loadingUsers = false;

    /**
	 * Get the current session in the system
	 */
	function getCurrentUser() {
		if(sessionService.getCurrentUser()) {
			$scope.userLogged = sessionService.getCurrentUser();
			if(sessionService.isAdmin()) {
				$scope.availableEdit = true;
			}

			if(sessionService.isCollaborator()) {
				getMessages();
			}
		} else {
			UsersService.getCurrentUser()
			.then(function(pUser) {
				if (pUser) {
					sessionService.authSuccess(pUser.user);
					$scope.userLogged = sessionService.getCurrentUser();
					if(sessionService.isAdmin()) {
						$scope.availableEdit = true;
					}

					if(sessionService.isCollaborator()) {
						getMessages();
					}
				}
			}).catch(function(pError) {
				
			});
		}
	};

	/**
	 * function to load the list of users
	 */
	function loadUsers() {
		if(!loadingUsers) {
			loadingUsers = true;
			UsersService.getUsers()
			.then(function(pUsers) {
				loadingUsers = false;
				$scope.usersTags = ['#todos'];
				pUsers.forEach(function(pUser){
					if((pUser.tag!==$scope.userLogged.tag)&&(pUser.isAdmin)){
						$scope.usersTags.push(pUser.tag);
					}
				});
				$scope.users = pUsers;
				loadMessageInfoOfUser();
			}).catch(function(pError) {
				loadingUsers = false;
				$scope.pageAlerts.push({
					message: pError,
					type: 'danger'
				});
			});
		}
	};

	function loadInfoUser (pMessage) {
		$scope.users.forEach(function (pUser) {
			if (pMessage.sender === pUser.tag) {
				pMessage.username = pUser.name + ' ' + pUser.lastName1;
				pMessage.senderImage = pUser.urlFoto;
			}
		});
	};

	function loadMessageInfoOfUser() {
		$scope.messages.forEach(function (pMessage) {
			loadInfoUser(pMessage);
		});
	};

    /**
	 * Get the messages of the current user in the system
	 */
	function getMessages() {
		var currentUser = sessionService.getCurrentUser();
		if (!currentUser) return;
		if(sessionService.isCollaborator()) {
			MessagesService.getMessagesOfUser(currentUser.tag)
			.then(function(pMessages) {
				$scope.messages = pMessages;
				$scope.messages.forEach(function(pMessage){
					if(!pMessage.wasRead && pMessage.receiver === sessionService.getCurrentUser().tag) {
						$scope.numberMessagesUnread++;
						$scope.haveMessagesUnread = true;
					}

					pMessage.isForMe = true;
					pMessage.isOwner = pMessage.sender === $scope.userLogged.tag ?
						true : 
						false;
					pMessage.forAll = pMessage.receiver === '#todos' ?
						true :
						false;

					analizeMessage(pMessage);
					loadUsers();
				});
			}).catch(function(pError) {
				$scope.pageAlerts.push({
					message: pError,
					type: 'danger'
				});
			});
		}
	};

	/**
	 * recognizes if the message have a url to display the link
	 * @param  {String} pMessage - Message receive
	 */
	function analizeMessage(pMessage) {
		if (pMessage.message.indexOf('http') !== -1) {
			var msj = '';
			pMessage.isURL = true;
			
			var msjSplit = pMessage.message.split('http');
			pMessage.beforeURL = msjSplit[0];
			
			var msjSplit = msjSplit[1].split(' ');
			pMessage.URL = 'http' + msjSplit[0];

			msjSplit.splice(0, 1);
			msjSplit.forEach(function(pToken){
				msj += pToken + ' ';
			});
			pMessage.afterURL = msj;
		}
	};

	/**
	 * Initialization Routine
	 */
	var initializer = function() {
		$scope.reloadFunction = getMessages;
		getCurrentUser();
	};

	socket.on('send:message', function (data) {
		if($scope.userLogged!==undefined) {
			if ((data.receiver === $scope.userLogged.tag)||(data.receiver==='#todos')||(sessionService.isAdmin())||(sessionService.isSupervisor())) {
				data.isForMe = data.receiver === $scope.userLogged.tag ?
					true :
					false;

				analizeMessage(data);
				loadInfoUser(data);

				data.forAll = data.receiver === '#todos' ?
					true :
					false;

				$scope.messages.splice(0,0,data);
				//$scope.messages.push(data);
				$scope.numberMessagesUnread++;
				$scope.haveMessagesUnread = true;
			}
		}
	});

	socket.on('send:messageRead', function (data) {
		if($scope.userLogged!==undefined) {
			if ((data.sender === $scope.userLogged.tag)||(sessionService.isAdmin())||(sessionService.isSupervisor())) {
				$scope.messages.forEach(function(pMessage)	{
					if(pMessage._id === data._id) {
						pMessage.wasRead = true;
					}
				});
			}
		}
	});

	$scope.sendMessage = function() {
		var receiver;
		var msj = '';
		if($scope.msjToSend.substr(0,1)==='#') {
			var msjSplit = $scope.msjToSend.split(' ');
			if ($scope.usersTags.indexOf(msjSplit[0]) !== -1) {
				if(msjSplit.length>1){
					receiver = msjSplit[0];
					msjSplit.splice(0, 1);

					msjSplit.forEach(function(pToken){
						msj += pToken + ' ';
					});

					var data = {
						message: msj,
						sender: $scope.userLogged.tag,
						receiver: receiver
					};

					if (receiver === '#todos') {
						data.forAll = true;
						data.wasRead = true;
					} else {
						data.forAll = false;
						data.wasRead = false;
					}

					MessagesService.saveMessages(data)
					.then(function(pMessage) {
						socket.emit('send:message', pMessage);
						//socket.emit('message', pMessage);

						pMessage.username = $scope.userLogged.name + ' ' + $scope.userLogged.lastName1;
						pMessage.senderImage = $scope.userLogged.urlFoto;
						pMessage.isOwner = true;
						analizeMessage(pMessage);
						$scope.messages.splice(0,0,pMessage);
						//$scope.messages.push(data);
					}).catch(function(pError) {
						$scope.pageAlerts.push({
							message: pError,
							type: 'danger'
						});
					});
				}
			}
		}
	    // clear message box
	    $scope.msjToSend = '';
	};

	$scope.markReadMessage = function(pMessage, pIndex) {
		MessagesService.updateMessages(pMessage)
		.then(function(pMessageUpdate) {
			$scope.messages[pIndex].wasRead = true;
			socket.emit('send:messageRead', $scope.messages[pIndex]);
			$scope.numberMessagesUnread--;
			if($scope.numberMessagesUnread<=0) {
				$scope.haveMessagesUnread = false;
			}
		}).catch(function(pError) {
			$scope.pageAlerts.push({
				message: pError,
				type: 'danger'
			});
		});
	};

	$rootScope.$on('sendNotification', function (event, args) {
		var message = args.data;
		message.username = $scope.userLogged.name + ' ' + $scope.userLogged.lastName1;
		message.senderImage = $scope.userLogged.urlFoto;
		message.isOwner = true;
		analizeMessage(message);
		$scope.messages.splice(0,0,message);
	});

	/*socket.on('connect', function() {
	    var index = socket.io.engine.upgrade ? 1 : 0;
	    $('p').text('Connection established in ' + (new Date() - start) + 'msec. ' +
	      'You are using ' + socket.io.engine.transports[index] + '.');
	    $('input').removeAttr('disabled');
	    $('button').removeAttr('disabled');
	    console.log('Conectado');
	});
	socket.on('message', function(data) {
		$('div.message > ul').append('<li>' + new Date().toString() + ': ' + data + '</li>');
	});*/

	initializer();

});