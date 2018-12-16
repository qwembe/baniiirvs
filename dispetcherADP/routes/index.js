var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3031");
const planeServer = require('../../server_addresses').plane;
const planeURL = 'http://' + planeServer.url + ':' + planeServer.port;

io.on('connection', (socket) => {
    io.emit('event', {type: "message", data: "всем привет в этом чатике"});

    socket.on('permit',() => {
    	socket.emit('event', {type: "permit", data: "Полет разрешен"});
	});

	socket.on('forbidden', () => {
		socket.emit('event', {type: "forbidden", data: "Полет запрещен"});
	})
});



router.get('/', (req, res, next) => {
	res.render('index', { title: 'Dispetcher ADP' });
});

router.post('/permit', (req, res, next) => {

});

router.post('/forbidden', (req, res, next) => {

});
module.exports = router;
