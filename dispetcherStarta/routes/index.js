var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3033");
var isActive = false
var giveLine = false;
var fly = false;

io.on('connection', (socket) => {
    io.emit('event', {type: "waiting", data: "Ожидание передачи управления от диспетчера старта..."});

    socket.on('vpp_permit', () => {
        socket.emit('event', {type: "vpp_permit", data: "Въезд на ВПП разрешён"});
        giveLine = true;
    });

    socket.on('vpp_veto', () => {
        socket.emit('event', {type: "vpp_veto", data: "Въезд на ВПП запрещен"});
        giveLine = false;
    })
    socket.on('fly_permit', () => {
        socket.emit('event', {type: "fly_permit", data: "Взлёт разрешён"});
        fly = true;
    })
    socket.on('fly_veto', () => {
        socket.emit('event', {type: "fly_veto", data: "Взлёт запрещен"});
        fly = false;
    })
});

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Диспетчер старта'});
});

router.get('/giveAction', function (req, res, next) {
    io.sockets.emit('working')
    isActive = true;
    res.sendStatus(200);
});

router.get('/ask_line', function (req,res,next) {
    res.send(JSON.stringify({type: "response", data: giveLine}))
})

router.get('/ask_liftoff', function (req,res,next) {
    res.send(JSON.stringify({type: "response", data: fly}))
})


module.exports = router;
