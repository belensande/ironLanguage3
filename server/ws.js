module.exports = (io) => {
	var sockets = {};

	io.on('connection', function (socket) {
		var id = socket.request._query["id"];

		sockets[id] = socket;

		socket.on('disconnect', function () {
			delete sockets[id];
		});

		socket.on('add-message', msg => {
			if (sockets[msg.to]) {
				sockets[msg.to].emit('message', msg);
			}
		})
	});
}