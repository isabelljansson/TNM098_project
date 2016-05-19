var express = require('express');
//var mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
var config = require('./auth.js')
var app = express();
var db;


app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.json())
var collection;


/* CONNECT TO DB */
/*****************/
MongoClient.connect('mongodb://' + config.user + ':' + config.pwd + '@127.0.0.1:27017/tnm098', function(err, db) {
  if(err) { return console.dir(err); }
  //console.log(db1)
  //pick collection from db
  general = db.collection('general');
  proxMobile = db.collection('proxMobileOut');
  proxOut = db.collection('proxOut');
  f1z8 = db.collection('f1z8');
  f2z2 = db.collection('f2z2');
  f2z4 = db.collection('f2z4');
  f3z1 = db.collection('f2z4');
});

//var db = MongoClient('tnm098', ['tnm098']);

/*
app.get('/', function (req, res) {
  	res.send('Hello World!');
});*/


// Proximity Out
app.get('/getProxOut', function (req, res) {
    var tmp = [];
    //just test to find in db
    proxOut.find(
      { },
      { 'message.zone': 1, 'message.floor': 1, 'message.datetime': 1, 'message.proxCard': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          //console.log(doc[0].message.X)
          for(var i = 0; i < doc.length; i++)
              tmp.push({"id": doc[i].message.proxCard, "zone": doc[i].message.zone, 
                "floor": doc[i].message.floor, "datetime": doc[i].message.datetime })
          //console.log(tmp)
          res.send(tmp);
        });
      });
});


// Proximity Mobile Out
app.get('/getProxMobility', function (req, res) {
  var tmp = [];
  proxMobile.find(
    { },
    { 'message.X': 1,'message.Y': 1, 'message.floor': 1, 'message.datetime': 1, 'message.proxCard': 1, _id: 0 }, 

    function(err, cursor)
    {
      cursor.toArray(function(err, doc){
        //console.log(doc[0].message.X)
        for(var i = 0; i < doc.length; i++)
            tmp.push({"id": doc[i].message.proxCard,
              "coordinates": [doc[i].message.X, doc[i].message.Y], 
              "floor": doc[i].message.floor, "datetime": doc[i].message.datetime })
        //console.log(tmp)
        res.send(tmp);
      });
  });
});


// Hazium F1_Z8
app.get('/getHaziumF1Z8', function (req, res) {
    var tmp = [];
    //just test to find in db
    f1z8.find(
      { },
      { 'message.F1_Z8A_HaziumConcentration': 1, 'message.datetime': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          //console.log(doc[0].message.X)
          for(var i = 0; i < doc.length; i++)
              tmp.push({"hazium": doc[i].message.F1_Z8_HaziumConcentration, "datetime": doc[i].message.datetime })
          //console.log(tmp)
          res.send(tmp);
        });
      });
});



app.listen(3000, function () {
  console.log('App listening on port 3000!');
});