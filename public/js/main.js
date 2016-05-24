//Function for calling the  server
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
}

var kmeansArray = [];
var cc = [];
var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S");
//"2013-03-01T17:11:10"
//"2016-05-31T00:10:00"

var zoom = d3.behavior.zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", move);

var mapDiv = $("#map");

var margin = {top: 0, right: 0, bottom: 0, left: 0},
width = mapDiv.width() - margin.right - margin.left,
height = mapDiv.height() - margin.top - margin.bottom;

//Sets the colormap
var colors = colorbrewer.Set3[10];

//Assings the svg canvas to the map div
var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

var g = svg.append("g");

//Sets the map projection
var projection = d3.geo.mercator()
        .center([8.25, 56.8])
        .scale(700);

//Creates a new geographic path generator and assing the projection        
var path = d3.geo.path().projection(projection);

function getSelected() {
    var e = document.getElementById('devList');
    var val = e.options[e.selectedIndex];
    deviation(val);
    
}
// data for general
var genData = [];
var mean = 0;
function deviation(selected) {
    console.log('sel: ' + selected.value);
    httpGetAsync('/getGeneral/'.concat(selected.value), function(response){
        for(var i = 0; i < response.length; i++) {
                genData.push({"datetime": format.parse(response[i].datetime),
                "val":response[i].val});
                mean += parseFloat(response[i].val);
        }
        mean /= parseFloat(response.length);
        console.log('mean: ' + mean + 'resp: ' + response.length);
    });
    // Sort data by time
    genData.sort(sortArray);
    console.log(genData);
    // Calculate distribution and put it in a table
    $('#timetable').empty();
    var day = undefined;// = genData[0].datetime.getDate();
    var table, row, r, c1, c2, vb, va;
    var n = 2;
    for(var i = 0; i < genData.length; i++) {
        if(day === genData[i].datetime.getDate()) {
            if(i < n || (variance(genData.slice(i-n,i)) >
                variance(genData.slice(i-n+1,i+1)))) {
                // Insert row into table
                r = table.insertRow(row);
                c1 = r.insertCell(0);
                c2 = r.insertCell(1);
                c1.innerHTML = getTime(genData[i].datetime);
                c2.innerHTML = ''.concat(genData[i].val);
                //c.innerHTML = mean - parseFloat(genData[i].val);
                row++;
            }
        } else {
            // Create a table for every day
            var table = document.createElement('table');
            document.getElementById('timetable').appendChild(table);
            day = genData[i].datetime.getDate();
            r = table.insertRow(0);
            c1 = r.insertCell(0);
            c2 = r.insertCell(1);
            c1.innerHTML = day;
            row = 1;
        }
    }
    console.log('fir ' + genData[0].datetime + ' las ' + genData[genData.length-1].datetime);
}

function variance(X) {
    var mean = 0, v = 0;
    for( var i = 0; i < X.length; i++) {
       mean += parseFloat(X[i].val); 
    }
    mean /= X.length;
    for( var i = 0; i < X.length; i++) {
        v += Math.pow(parseFloat(X[i].val - mean), 2);
    }
    v /= X.length - 1;
    console.log('v: ' + v + ' Xlength: ' + X.length);
    return v;
}
    
function getTime(time) {
    var hour = time.getHours();
    var minute = time.getMinutes();
    hour < 10 ? hour = '0' + hour : hour; 
    minute < 10 ? minute = '0' + minute : minute; 
    return hour + ':' + minute;
}
    
// data for zone clustering
var zoneData = [];
httpGetAsync('/getProxOut', function(response){
    for(var i = 0; i < response.length; i++)
            zoneData.push(response[i]);
});

// data for plotted points
var points = [];
    httpGetAsync('/getProxMobility', function(response){
        for(var i = 0; i < response.length; i++)
            points.push(response[i]);
});


// Get all hazium data and store it in one variable
var hazium = [];
var tmpF1Z8 = [];
var tmpF2Z2 = [];
var tmpF2Z4 = [];
var tmpF3Z1 = [];

    httpGetAsync('/getHaziumF1Z8', function(response){
        //console.log(response);
        for(var i = 0; i < response.length; i++)
            tmpF1Z8.push({"datetime": format.parse(response[i].datetime), "F1Z8": response[i].F1Z8} );
});
    httpGetAsync('/getHaziumF2Z2', function(response){
        //console.log(response);
        for(var i = 0; i < response.length; i++)
            tmpF2Z2.push({"datetime": format.parse(response[i].datetime), "F2Z2": response[i].F2Z2});
});
    httpGetAsync('/getHaziumF2Z4', function(response){
        //console.log(response);
        for(var i = 0; i < response.length; i++)
            tmpF2Z4.push({"datetime": format.parse(response[i].datetime), "F2Z4": response[i].F2Z4});
});
    httpGetAsync('/getHaziumF3Z1', function(response){
        //console.log(response);
        for(var i = 0; i < response.length; i++)
            tmpF3Z1.push({"datetime": format.parse(response[i].datetime), "F3Z1": response[i].F3Z1});
});

// sort all list by time
function sortArray(element1, element2) {
    return element1.datetime.getTime() - element2.datetime.getTime();
}

/*
for (var i = 0; i < tmpF1Z8.length; i++) {
    tmpF1Z8[i].datetime = format.parse(tmpF1Z8[i].datetime);
    tmpF2Z2[i].datetime = format.parse(tmpF2Z4[i].datetime);
    tmpF2Z4[i].datetime = format.parse(tmpF2Z4[i].datetime);
    tmpF3Z1[i].datetime = format.parse(tmpF3Z1[i].datetime);
}
*/
tmpF1Z8.sort(sortArray);
tmpF2Z2.sort(sortArray);
tmpF2Z4.sort(sortArray);
tmpF3Z1.sort(sortArray);
for (var i = 0; i < tmpF1Z8.length; i++) {
    hazium.push({"datetime": tmpF1Z8[i].datetime, "F1Z8": tmpF1Z8[i].F1Z8,
                "F2Z2": tmpF2Z2[i].F2Z2, "F2Z4": tmpF2Z4[i].F2Z4, "F3Z1": tmpF3Z1[i].F3Z1});
}

var currImg = 0;
var currView = 0;
var offsetX = 0, offsetY = 0; // depends on imAspect
var maxX = 189, maxY = 115;
var imAspect = 1.67;

if (width/height < imAspect) {
    imW = width;
    imH = imW/imAspect;
    offsetY += (height - imH)/2;
    offsetY += 8*(width/height/imAspect);
}
else {
    imH = height;
    imW = imH*imAspect;
    offsetX += -(width - imW)/2;
    if (width/height < 3.16)
        offsetY += 3.5*Math.abs(width/height/imAspect - 3.16);
}

var imageList = [
        "images/floor1.jpg",        // 0
        "images/energyz_F1.jpg",
        "images/proxz_F1.jpg",
        "images/floor2.jpg",        // 3
        "images/energyz_F2.jpg",
        "images/proxz_F2.jpg",
        "images/floor3.jpg",        // 6
        "images/energyz_F3.jpg",
        "images/proxz_F3.jpg"
    ];

draw();

//console.log(points);
//console.log(zoneData);
//console.log(hazium);


//Draws the map and the points
function draw()
{
    d3.select("g").remove();
    var g = svg.append("g");

    //draw map of office floor
    var img = g.append("svg:image")
         .attr("width",width)
         .attr("height",height)
         .attr("x",0)
         .attr("y",0)
         .attr("xlink:href",imageList[currImg*3 + currView]);

         // 1,89135255, 1.69
    //draw point        
    var point = g.selectAll("circle").data(points)
        .enter().append("circle")
        .attr("d", path)
        .attr("class", "point")
        .attr("cx", function(d) { return ( (d.coordinates[0]/maxX)*imW  - offsetX); })
        .attr("cy", function(d) { return (height - (d.coordinates[1]/maxY)*imH - offsetY); })
        .attr("r", 5)
        .style("opacity", function(d){
                return (Number(d.floor) == currImg+1) ? 1 : 0.0
            });


    $('#floor').append('<legend id="child">' + imageList[currImg*3 + currView] + '</legend>').html;
};

// fuzzy kmeans cluster people to find the people in biggest risk of hazium
this.cluster = function () {
    console.log("Enter clustering");
    // Filter to only store relevant people in the kmeansArray
    kmeansArray = [];
    var next;
    var fiveMin = 300000;
    hazium.forEach(function(d,i) {
        
        if (d.F1Z8 > 0.0) {
            next = new Date(d.datetime.getTime()+fiveMin);
            //find people in zone at time between d.datetime->then - query?
        }

        if (d.F2Z2 > 0.0)

        if (d.F2Z4 > 0.0)

        if (d.F3Z1 > 0.0)


         // haziumData.findIndex(time).hazium > 0
        // If we're in any of the sensor zones
        if ( (d.floor == 1 && d.zone == 8) || (d.floor == 2 && (d.zone == 2 || d.zone == 4)) 
            || (d.floor == 1 && d.zone == 1) ) {
            //console.log(d)
        }
        /*
             if (kmeansArray.find(id) == d.id) // person finns i lista
                 kmeansArray.findIndex(id).times++;
                 kmeansArray.findIndex(id).hazium += haziumData.findIndex(time).hazium;
             else {
                 kmeansArray.push(id, 1, haziumData.findIndex(time,zone).hazium)
             }
          */   
    });

    /*
    // Do the fuzzy clustering
    //var k = document.getElementById('k').value;
    var kmeansRes = kmeans(kmeansArray, 2);
    console.log(kmeansRes); // people at risk
    

    // Visualize the people at risk (different clusters) - last known position of id
    var p = 0;
    data.forEach(function(d, i) {
        if (format.parse(d.time) >= extent[0] && format.parse(d.time) <= extent[1]) {
            for (j = 0; j < k; j++) {
                if (kmeansRes[p] == j) {
                    cc[i] = colors[j];
                }
            }
            p++;
        }
    });
    data.forEach(function(d, i) {
        if (cc[i] == undefined)
            cc[i] = "black";
    });
    
    console.log(cc);
    d3.selectAll(".point")
    .style("fill", function(d, i){ return cc[i]; });
    */
};

this.changeFloor = function() {
    if (currImg > 1)
        currImg = 0;
    else
        currImg++;
    $('#child').remove();
    draw();
}

this.toggleView = function() {
    if (currView >= 2)
        currView = 0;
    else
        currView++;
    $('#child').remove();
    draw();
}


//Zoom and panning method
function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

//Prints features attributes
function printInfo(value) {
    var elem = document.getElementById('info');
    elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
}
