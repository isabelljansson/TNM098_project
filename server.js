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


// Proximity Mobile Out
app.get('/getGeneral', function (req, res) {
  var tmp = [];
  general.find(
    { },
    { 'message.datetime': 1, 
      'message.SupplySideOutletTemperature': 1, 
      'message.WaterHeaterGasRate': 1, 
      'message.SupplySideInletMassFlowRate': 1, 
      'message.HVACElectricDemandPower': 1, 
      'message.HEATScheduleValue': 1, 
      'message.PumpPower': 1, 
      'message.WaterHeaterTankTemperature': 1, 
      'message.SupplySideInletTemperature': 1, 
      'message.DrybulbTemperature': 1, 
      'message.WaterHeaterSetpoint': 1, 
      'message.WindSpeed': 1, 
      'message.COOLScheduleValue': 1, 
      'message.TotalElectricDemandPower': 1, _id: 0 }, 

    function(err, cursor)
    {
      cursor.toArray(function(err, doc){
        //console.log(doc[0].message.X)
        tmp.push(["datetime", "wind", "tankTemperature"]);
        for(var i = 0; i < doc.length; i++)
            tmp.push([doc[i].message.datetime,
                      doc[i].message.SupplySideOutletTemperature, 
                      doc[i].message.WaterHeaterGasRate, 
                      doc[i].message.SupplySideInletMassFlowRate, 
                      doc[i].message.HVACElectricDemandPower, 
                      doc[i].message.HEATScheduleValue, 
                      doc[i].message.WaterHeaterTankTemperature, 
                      doc[i].message.SupplySideInletTemperature, 
                      doc[i].message.DrybulbTemperature, 
                      doc[i].message.WaterHeaterSetpoint, 
                      doc[i].message.WindSpeed, 
                      doc[i].message.COOLScheduleValue,
                      doc[i].message.TotalElectricDemandPower, ])
        console.log(tmp)
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