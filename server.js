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



// Zone data
app.get('/getProxOut/:id', function (req, res) {
    var tmp = [];
    var varId = req.params.id; //18, 22, 24, 31 Floor_Zone
    var action;
    if (varId == '18') {
      action = { 'message.zone': '8', 'message.floor': '1' };
    } else if (varId == '22') {
      action = { 'message.zone': '2', 'message.floor': '2' };
    } else if (varId == '24') {
      action = { 'message.zone': '4', 'message.floor': '2' };
    } else if (varId == '31') {
      action = { 'message.zone': '1', 'message.floor': '3' };
    }
    proxOut.find(
      //{ 'message.zone': '8', 'message.floor': '1' },
      action,
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
    action['message.datetime'] = 1;
    action['_id'] = 0;

    //just test to find in db
    general.find(
      { },
      action,

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"val": doc[i].message[varId], "datetime": doc[i].message.datetime})
          res.send(tmp);
        });
      });
});

// Proximity Mobile Out
app.get('/getGeneral', function (req, res) {
  var tmp = [];
  general.find(
    { },
    { 'message.datetime': 1, 
      'message.SupplySideOutletTemperature': 1, 
      'message.HVACElectricDemandPower': 1, 
      'message.WaterHeaterTankTemperature': 1, 
      'message.SupplySideInletTemperature': 1,   
      'message.WindDirection': 1, 
      'message.TotalElectricDemandPower': 1, 
      'message.DrybulbTemperature': 1, 
      'message.WindSpeed': 1, _id: 0 }, 

    function(err, cursor)
    {
      cursor.toArray(function(err, doc){
        tmp.push(["datetime", "SupplySideOutletTemperature",
        "HVACElectricDemandPower", 
        "WaterHeaterTankTemperature", "SupplySideInletTemperature", "WindDirection", 
        "TotalElectricDemandPower", "DrybulbTemperature", "WindSpeed"]);
        for(var i = 0; i < doc.length; i++)
            tmp.push([doc[i].message.datetime,
                      doc[i].message.SupplySideOutletTemperature,  
                      doc[i].message.HVACElectricDemandPower, 
                      doc[i].message.WaterHeaterTankTemperature,  
                      doc[i].message.SupplySideInletTemperature, 
                      doc[i].message.WindDirection,
                      doc[i].message.TotalElectricDemandPower,
                      doc[i].message.DrybulbTemperature, 
                      doc[i].message.WindSpeed ]);
        res.send(tmp);
      });
  });
});


// Hazium F1_Z8
app.get('/getHaziumF1Z8', function (req, res) {
    var tmp = [];
    f1z8.find(
      { },
      { 'message.datetime': 1, 'message.F_1_Z_8A_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"datetime": doc[i].message.datetime, "F1Z8": doc[i].message.F_1_Z_8A_HaziumConcentration });
          
          //console.log(tmp)
          res.send(tmp);
        });
      });
});
// Get F2Z2 hazium levels
app.get('/getHaziumF2Z2', function (req, res) {
    var tmp = [];   
    f2z2.find(
      { },
      { 'message.datetime': 1,
        'message.F_2_Z_2_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++) {
          	
              tmp.push({"datetime": doc[i].message.datetime, "F2Z2": doc[i].message.F_2_Z_2_HaziumConcentration});
              }
            res.send(tmp);
        });
      });
});
// Get F2Z4 hazium levels
app.get('/getHaziumF2Z4', function (req, res) {
    var tmp = [];
    f2z4.find(
      { },
      { 'message.datetime': 1,
        'message.F_2_Z_4_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"datetime": doc[i].message.datetime, "F2Z4": doc[i].message.F_2_Z_4_HaziumConcentration });
          res.send(tmp);
        });
      });
});
// Get F3Z1 hazium levels
app.get('/getHaziumF3Z1', function (req, res) {
    var tmp = [];
    f3z1.find(
      { },
      { 'message.datetime': 1,
        'message.F_3_Z_1_HaziumConcentration': 1, _id: 0 }, 

      function(err, cursor)
      {
        cursor.toArray(function(err, doc){
          for(var i = 0; i < doc.length; i++)
              tmp.push({"datetime": doc[i].message.datetime, "F3Z1": doc[i].message.F_3_Z_1_HaziumConcentration });
          res.send(tmp);
        });
      });

});



app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
