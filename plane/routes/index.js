var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3030");
const state = require('../states').state;
const adp = require("../../server_addresses").dispetcherADP
const rulenia = require("../../server_addresses").dispetcherRulenia
const starta = require("../../server_addresses").dispetcherStarta

//!-important-!
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
//!-important-!


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});


var current_state = state.WAIT;
var BUTTON_LAUNCH_ENGIE_PRESSED = false;
var BUTTON_ASK_LINE_PRESSED = false;
var BUTTON_ASK_LIFTOFF_PRESSED = false;
var timeToLiftOff = undefined;
var LiftOff = undefined;

io.sockets.on('connection', (socket) => {
    socket.json.emit('hello', {type: "message", data: current_state})

    socket.on('answerADP', (data) => {
        if (data.type === "answerADP") {
            if (data.data) {
                current_state = state.HAVE_PERMIT; // Todo make simple check of prev state
                io.sockets.json.emit('message', {type: "changeState", data: "Разрешение получено"});
            }
        }
    })

    socket.on('answerRulenia', (data) => {
        console.log(data);
        if (data.type === "answerRulenia") {
            if (data.data) {
                current_state = state.LAUNCH_ENGIE;
                io.sockets.json.emit('message', {type: "changeState", data: "Разрешение получено"});
            }
        }
    })

    socket.on('answerLine', (data) => {
        console.log(data);
        if (data.type === "answerLine") {
            if (data.data) {
                current_state = state.RUNWAY_ENTRY;
                io.sockets.json.emit('message', {type: "changeState", data: "Разрешение получено"});
            }
        }
    })

    socket.on('answerLiftOff', (data) => {
        console.log(data);
        if (data.type === "answerLiftOff") {
            if (data.data) {
                current_state = state.GRANT_LIFTOFF;
                io.sockets.json.emit('message', {type: "changeState", data: "Разрешение получено"});
            }
        }
    })
})

function currenState() {
    // console.log(current_state)
    io.sockets.json.emit('currentState', {type: "updateState", data: current_state})
}

function askPermit() {
    io.sockets.json.emit('ask_permit', {type: "toADP", data: adp})
}

function askLaunch() {
    io.sockets.json.emit('ask_launch', {type: "toRulenia", data: rulenia})
}

function askLine() {
    io.sockets.json.emit('ask_line', {type: "toStarta", data: starta})
}

function askLiftOff() {
    io.sockets.json.emit('ask_liftoff', {type: "toStarta", data: starta})
}

// State machine !

function stateMachine() {
    currenState();
    switch (current_state) {
        case state.WAIT:
            //do nothing
            break;
        case state.DONT_HAVE_PERMIT:
            askPermit();
            break;
        case state.HAVE_PERMIT:
            if (BUTTON_LAUNCH_ENGIE_PRESSED) {
                askLaunch();
            }
            break;
        case state.LAUNCH_ENGIE:
            if (BUTTON_ASK_LINE_PRESSED) {
                askLine();
            }
            break;
        case state.RUNWAY_ENTRY:
            if (BUTTON_ASK_LIFTOFF_PRESSED) {
                askLiftOff();
            }
            break;
        case state.GRANT_LIFTOFF:
            if (timeToLiftOff == undefined)
                timeToLiftOff = setTimeout(() => {
                    io.sockets.json.emit('message', {type: "changeState", data: "Взлет"});
                    current_state = state.LIFT_OFF;
                }, 5000)
            break;
        case state.LIFT_OFF:
            if (LiftOff == undefined)
                LiftOff = setTimeout(() => {
                    io.sockets.json.emit('message', {type: "changeState", data: "Полет нормальный"});
                    current_state = state.ADC_CONTROL;
                    io.sockets.json.emit('message', {type: "changeState", data: "Установлено соединение с АДЦ"});
                }, 5000)
            break;
        case state.ADC_CONTROL:
            //TODo What next?
            break;
        case state.RDC_CONTROL:
            //tOdO What next?
            break;
    }
}


const timer = setInterval(() => {
    stateMachine()
}, 1000)


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Plane'});
});

router.post('/ask_permit', function (req, res, next) {
    current_state = state.DONT_HAVE_PERMIT;
    io.sockets.json.emit('message', {type: "changeState", data: "Ожидание ответа от АДП"})
    res.sendStatus(200);
});

router.post('/ask_launch', function (req, res, next) {
    BUTTON_LAUNCH_ENGIE_PRESSED = true;
    io.sockets.json.emit('message', {type: "changeState", data: "Создан запрос на запуск двигателей"});
    res.sendStatus(200);
});

router.post('/ask_line', function (req, res, next) {
    BUTTON_ASK_LINE_PRESSED = true;
    io.sockets.json.emit('message', {type: "changeState", data: "Создан запрос на предоставление взлетной полосы"});
    res.sendStatus(200);
});

router.post('/ask_liftoff', function (req, res, next) {
    BUTTON_ASK_LIFTOFF_PRESSED = true;
    io.sockets.json.emit('message', {type: "changeState", data: "Создан запрос взлет"});
    res.sendStatus(200);
});


//Rinata
router.post('/toRDC', function (req, res, next) {
    if (current_state === state.ADC_CONTROL) {
        current_state = state.RDC_CONTROL
        io.sockets.json.emit('message', {type: "changeState", data: "Управление передано РДЦ"})
    } else {
        res.json({type: "response", data: "too early!"});  //TODO think about it later
    }
    res.send(200);
});

router.post('/readCommand', function (req, res, next) {
    if ((current_state === state.ADC_CONTROL) || (current_state === state.RDC_CONTROL)) {
        console.log(req.body);
        io.sockets.json.emit('message', req.body)
    } else {
        console.log(current_state)
    }
    res.sendStatus(200);
});


module.exports = router;
