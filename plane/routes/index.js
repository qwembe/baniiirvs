var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3030");

const state = require('../states').state;
var current_state = state.WAIT;

io.sockets.on('connection', (socket) => {
    socket.json.emit('hello', {type: "message", data: current_state})
})

function currenState(){
    console.log(current_state);
    io.sockets.json.emit('currentState', {type: "updateState", data: current_state})
}

io.sockets.on('ask_permit',() => {
    socket.json.emit('ask_permit')
})
// State machine !

function stateMachine() {
    currenState();
    switch (current_state) {
        case state.WAIT:

            break;
        case state.DONT_HAVE_PERMIT:

            break;
        case state.HAVE_PERMIT:

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


module.exports = router;
