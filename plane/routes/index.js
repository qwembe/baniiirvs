var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3030");
const state = require('../states').state;
const adp = require("../../server_addresses").dispetcherADP
const rulenia = require("../../server_addresses").dispetcherRulenia
const starta = require("../../server_addresses").dispetcherStarta

var current_state = state.WAIT;
var BUTTON_LAUNCH_ENGIE_PRESSED = false;
var BUTTON_ASK_LINE_PRESSED = false;
var BUTTON_ASK_LIFTOFF_PRESSED = false;
var timeToLiftOff = undefined;
var LiftOff = undefined;

io.sockets.on('connection', (socket) => {
    socket.json.emit('hello', {type: "message", data: current_state})

    socket.on('answerADP',(data)=>{
        if(data.type === "answerADP"){
            if(data.data){
                current_state = state.HAVE_PERMIT; // Todo make simple check of prev state
            }
        }
    })

    socket.on('answerRulenia',(data)=>{
        console.log(data);
        if(data.type === "answerRulenia"){
            if(data.data){
                current_state = state.LAUNCH_ENGIE;
            }
        }
    })

    socket.on('answerLine',(data)=>{
        console.log(data);
        if(data.type === "answerLine"){
            if(data.data){
                current_state = state.RUNWAY_ENTRY;
            }
        }
    })

    socket.on('answerLiftOff',(data)=>{
        console.log(data);
        if(data.type === "answerLiftOff"){
            if(data.data){
                current_state = state.GRANT_LIFTOFF;
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

function askLaunch(){
    io.sockets.json.emit('ask_launch', {type: "toRulenia", data: rulenia})
}

function askLine(){
    io.sockets.json.emit('ask_line', {type: "toStarta", data: starta})
}

function askLiftOff(){
    io.sockets.json.emit('ask_liftoff', {type: "toStarta", data: starta})
}

// State machine !

function stateMachine() {
    currenState();
    switch (current_state) {
        case state.WAIT:

            break;
        case state.DONT_HAVE_PERMIT:
            askPermit();
            break;
        case state.HAVE_PERMIT:
            if(BUTTON_LAUNCH_ENGIE_PRESSED){
                askLaunch();
            }
            break;
        case state.LAUNCH_ENGIE:
            if(BUTTON_ASK_LINE_PRESSED){
                askLine();
            }
            break;
        case state.RUNWAY_ENTRY:
            if(BUTTON_ASK_LIFTOFF_PRESSED){
                askLiftOff();
            }
            break;
        case state.GRANT_LIFTOFF:
            timeToLiftOff = setTimeout(() => {
                current_state = state.LIFT_OFF;
            },5000)
            break;
        case state.LIFT_OFF:
            LiftOff = setTimeout(() => {
                current_state = state.ADC_CONTROL;
            },5000)
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
}, 2000)


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Plane'});
});

router.post('/ask_permit', function (req, res, next) {
    current_state = state.DONT_HAVE_PERMIT;
});

router.post('/ask_launch', function (req, res, next) {
    BUTTON_LAUNCH_ENGIE_PRESSED = true;
});

router.post('/ask_line', function (req, res, next) {
    BUTTON_ASK_LINE_PRESSED = true;
});

router.post('/ask_liftoff', function (req, res, next) {
    BUTTON_ASK_LIFTOFF_PRESSED = true;
});


module.exports = router;
