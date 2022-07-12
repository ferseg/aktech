/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: sockets.js
 */

// export function for listening to the socket on the connection
module.exports = function (socket) {  

    socket.on('disconnect', function () {    
    });

    socket.on('send:message', function (data) {
      socket.broadcast.emit('send:message', data);
    });

    socket.on('send:messageRead', function (data) {
      socket.broadcast.emit('send:messageRead', data);
    });
};