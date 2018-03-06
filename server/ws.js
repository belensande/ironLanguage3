module.exports = (io) => {
	var sockets = {};

	io.on('connection', function (socket) {
		var id = socket.request._query["id"];

		sockets[id] = socket;

		socket.on('disconnect', () => {
			delete sockets[id];
			if (socket.room) {
				socket.leave(socket.room);
			}
		});

		socket.on('add-message', msg => {
			if (sockets[msg.to._id]) {
				sockets[msg.to._id].emit('message', msg);
			}
		});

		socket.on('adduser', (meetupId) => {
			socket.room = meetupId;
			socket.join(meetupId);
		});

		socket.on('sendchat', (message) => {
			io.sockets.in(socket.room).emit('updatechat', message);
		});

		socket.on('leavechat', () => {
			socket.leave(socket.room);
		});
	});
}