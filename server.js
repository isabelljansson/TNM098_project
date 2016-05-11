var express = require('express');
var mongoose = require('mongoose')
var config = require('./auth.js')
var app = express();

app.use(express.static(__dirname + '/public')); 

mongoose.connect('mongodb://' + config.user + ':' + config.pwd + '@127.0.0.1:27017/tnm098');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});