var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3032");
//const planeServer = require('../../server_addresses').plane;
//const planeURL = 'http://' + planeServer.url + ':' + planeServer.port;

io.on('connection', (socket) => {
    io.emit('event', {type: "waiting", data: "Ожидание запроса от экипажа..."});

    socket.on('permit',() => {
        socket.emit('event', {type: "permit", data: "Полет разрешен"});
    });

    socket.on('veto', () => {
        socket.emit('event', {type: "veto", data: "Полет запрещен"});
    })
    socket.on('send', () => {
        socket.emit('event', {type: "send", data: "Передача управления диспетчеру старта..."});
    })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Диспетчер руления' });
});

module.exports = router;
