var express = require('express');
var socket = require('socket.io');

// Application setup
var app = express();
var server = app.listen(3200, function () {
	console.log('Listen to requests on port 3200');
});

// Socket setup
var io = socket(server);

var members = [];

function memberIsAvailable(data) {
	var member = members.filter((obj) => data.toLowerCase() === obj.toLowerCase())
	if (member.length > 0) {
		return true;
	}
	return false;
}

io.on('connection', function (socket) {
	console.log('Made socket connection', socket.id);

	// Hanlde chat event
	socket.on('chat', function (data) {
		io.sockets.emit('chat', data);
	});

	// Handle typing event
	socket.on('typing', function (data) {
		socket.broadcast.emit('typing', data);
	});

	// Handle register
	socket.on('register', function (data) {
		if (!memberIsAvailable(data)) {
			members.push(data)
		} 

		console.log(members)
		io.sockets.emit('register', members);
	});
});