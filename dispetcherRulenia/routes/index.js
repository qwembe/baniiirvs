var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3032");
const Server = require('../../server_addresses').dispetcherStarta;
const dstarta = 'http://' + Server.url + ':' + Server.port;

var alowed = false;

io.on('connection', (socket) => {
    io.emit('event', {type: "waiting", data: "Ожидание запроса от экипажа..."});

    socket.on('permit', () => {
        socket.emit('event', {type: "permit", data: "Полет разрешен"});
        alowed = true;
    });

    socket.on('veto', () => {
        socket.emit('event', {type: "veto", data: "Полет запрещен"});
        alowed = false;
    })
    socket.on('send', () => {
        socket.emit('event', {type: "send", data: dstarta});
    })
});

const cors = require('cors');

const corsOptions = {
    'credentials': true,
    'origin': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept',
};

router.use(cors(corsOptions));

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
    res.render('index', {title: 'Диспетчер руления'});
});

router.get('/ask_launch', (req, res, next) => {
    if (alowed) io.emit('event', {type: "waiting", data: "Запрос получен."});
    res.send(JSON.stringify({type: "response", data: alowed}))
    //res.sendStatus(200);
})

module.exports = router;
