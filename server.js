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
  f3z1 = db.collection('f3z1');
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

// General
app.get('/getGeneral/:id', function (req, res) {
    var tmp = [];
    // Get id of param to request
    var varId = req.params.id;
    var action = {};
    var msg = "message.".concat(varId);
    // Make it into an object to query
    action[msg] = 1;
    action['_id'] = 0;

    //just test to find in db
    general.find(
      { },
      action,

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          console.log(doc[0])
          for(var i = 0; i < doc.length; i++)
              tmp.push({"val": doc[i].message[varId]})
          console.log(tmp[0])
          res.send(tmp);
        });
      });
});

// SORT ALL HAZIUM DATA AFTER TIME
// Get F1Z8 hazium levels
app.get('/getHaziumF1Z8', function (req, res) {
    var tmp = [];
    f1z8.find(
      { },
      { 'message.datetime': 1, 'message.F_1_Z_8A_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"datetime": doc[i].message.datetime, "F1Z8": doc[i].message.F_1_Z_8A_HaziumConcentration })
          res.send(tmp);
        });
      });
});
// Get F2Z2 hazium levels
app.get('/getHaziumF2Z2', function (req, res) {
    var tmp = [];   
    f2z2.find(
      { },
      { 'message.datetime': 1, 'message.F_2_Z_2_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"datetime": doc[i].message.datetime, "F2Z2": doc[i].message.F_2_Z_2_HaziumConcentration});
            res.send(tmp);
        });
      });
});
// Get F2Z4 hazium levels
app.get('/getHaziumF2Z4', function (req, res) {
    var tmp = [];
    f2z4.find(
      { },
      { 'message.datetime': 1, 'message.F_2_Z_4_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"datetime": doc[i].message.datetime , "F2Z4": doc[i].message.F_2_Z_4_HaziumConcentration});
          res.send(tmp);
        });
      });
});
// Get F3Z1 hazium levels
app.get('/getHaziumF3Z1', function (req, res) {
    var tmp = [];
    f3z1.find(
      { },
      { 'message.datetime': 1, 'message.F_3_Z_1_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({ "datetime": doc[i].message.datetime , "F3Z1": doc[i].message.F_3_Z_1_HaziumConcentration});
          res.send(tmp);
        });
      });

});



app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
