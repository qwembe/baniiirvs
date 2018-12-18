var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3033");

io.on('connection', (socket) => {
    io.emit('event', {type: "waiting", data: "Ожидание передачи управления от диспетчера старта..."});

    socket.on('vpp_permit',() => {
        socket.emit('event', {type: "vpp_permit", data: "Въезд на ВПП разрешён"});
    });

    socket.on('vpp_veto', () => {
        socket.emit('event', {type: "vpp_veto", data: "Въезд на ВПП запрещен"});
    })
    socket.on('fly_permit', () => {
        socket.emit('event', {type: "fly_permit", data: "Взлёт разрешён"});
    })
    socket.on('fly_veto', () => {
        socket.emit('event', {type: "fly_veto", data: "Взлёт запрещен"});
    })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Диспетчер старта' });
});


module.exports = router;
