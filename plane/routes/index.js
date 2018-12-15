var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3030");
const state = require('../states').state;
const adp = require("../../server_addresses").dispetcherADP
const rulenia = require("../../server_addresses").dispetcherRulenia

var current_state = state.WAIT;
var BUTTON_LAUNCH_ENGIE_PRESSED = false

io.sockets.on('connection', (socket) => {
    socket.json.emit('hello', {type: "message", data: current_state})

    socket.on('answerADP',(data)=>{
        if(data.type === "answerADP"){
            if(data.data){
                current_state = state.HAVE_PERMIT;
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
})



function currenState() {
    console.log(current_state)
    io.sockets.json.emit('currentState', {type: "updateState", data: current_state})
}

function askPermit() {
    io.sockets.json.emit('ask_permit', {type: "toADP", data: adp})
}

function askLaunch(){
    io.sockets.json.emit('ask_launch', {type: "toRulenia", data: rulenia})

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
                askLaunch()
            }

            break;
        case state.LAUNCH_ENGIE:

            break;
        case state.RUNWAY_ENTRY:

            break;
        case state.GRANT_LIFTOFF:

            break;
        case state.LIFT_OFF:

            break;
        case state.ADC_CONTROL:

            break;
        case state.RDC_CONTROL:

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


module.exports = router;
