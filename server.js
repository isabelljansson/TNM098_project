var express = require('express');
//var mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
var config = require('./auth.js')
var app = express();

app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.json())
var collection;


/* CONNECT TO DB */
/*****************/
MongoClient.connect('mongodb://' + config.user + ':' + config.pwd + '@127.0.0.1:27017/tnm098', function(err, db) {
  if(err) { return console.dir(err); }
  //pick collection from db
  general = db.collection('general');
});


app.get('/', function (req, res) {
  	res.send('Hello World!');
});

app.get('/find', function (req, res) {
	console.log('recived get find')
    //just test to find in db
    general.findOne({'message.PumpPower':'91.3744'}, function(err, item) {
        console.log(item)
        //send back the item to the client
        res.send(item)
    });

});



app.listen(3000, function () {
  console.log('App listening on port 3000!');
});