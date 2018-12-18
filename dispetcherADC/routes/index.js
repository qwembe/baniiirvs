var express = require('express');
var router = express.Router();
const io = require('socket.io').listen("3034");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DispetcherADC' });
});

router.get('/wathingYou', function(req, res, next) {
  io.sockets.emit('hello')
    res.sendStatus(200);
});

module.exports = router;
