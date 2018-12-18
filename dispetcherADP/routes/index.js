var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3031");
const planeServer = require('../../server_addresses').plane;
const planeURL = 'http://' + planeServer.url + ':' + planeServer.port;

let current_state = "forbidden";

/* something instead of cors */
router.use(function(req, res, next) {
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

io.on('connection', (socket) => {
    io.emit('event', {type: "message", data: "всем привет в этом чатике"});

    socket.on('permit',() => {
        current_state = "permit";
        socket.emit('event', {type: "permit", data: "Полет разрешен"});
    });

    socket.on('forbidden', () => {
        current_state = "forbidden";
        socket.emit('event', {type: "forbidden", data: "Полет запрещен"});
    })
});

/* home page */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Dispetcher ADP' });
});

/* response to requests from plane */
router.get('/permit', (req, res, next) => {
    let permition;
    if (current_state === "forbidden") {
        permition = false;
    }
    else if (current_state === "permit") {
        permition = true;
    }

    res.send(JSON.stringify({type: "answerADP", data: permition}));
});

module.exports = router;
