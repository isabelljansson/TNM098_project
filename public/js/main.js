// Using JS for tabs *****

var tabLinks = new Array();
var contentDivs = new Array();

function init() {
  // Grab the tab links and content divs from the page
  var tabListItems = document.getElementById('tabs').childNodes;
  for ( var i = 0; i < tabListItems.length; i++ ) {
    if ( tabListItems[i].nodeName == "LI" ) {
      var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
      var id = getHash( tabLink.getAttribute('href') );
      tabLinks[id] = tabLink;
      contentDivs[id] = document.getElementById( id );
    }
  }
  // Assign onclick events to the tab links, and
  // highlight the first tab
  var i = 0;

  for ( var id in tabLinks ) {
    tabLinks[id].onclick = showTab;
    tabLinks[id].onfocus = function() { this.blur() };
    if ( i == 0 ) tabLinks[id].className = 'selected';
    i++;
  }

  // Hide all content divs except the first
  var i = 0;

  for ( var id in contentDivs ) {
    if ( i != 0 ) contentDivs[id].className = 'tabContent hide';
    i++;
  }

  // Get tables
  getSelected();
}

function showTab() {
  var selectedId = getHash( this.getAttribute('href') );

  // Highlight the selected tab, and dim all others.
  // Also show the selected content div, and hide all others.
  for ( var id in contentDivs ) {
    if ( id == selectedId ) {
      tabLinks[id].className = 'selected';
      contentDivs[id].className = 'tabContent';
    } else {
      tabLinks[id].className = '';
      contentDivs[id].className = 'tabContent hide';
    }
  }

  // Stop the browser following the link
  return false;
}

function getFirstChildWithTagName( element, tagName ) {
  for ( var i = 0; i < element.childNodes.length; i++ ) {
    if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
  }
}
function getHash( url ) {
  var hashPos = url.lastIndexOf ( '#' );
  return url.substring( hashPos + 1 );
}


// *************************

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
var colors =   ["#7f0000",
                "#b30000",
                "#d7301f",
                "#ef6548",
                "#fc8d59",
                "#fdbb84",
                "#fdd49e",
                "#fee8c8",
                "#fff7ec"];

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

// data for plotted points
var points = [];
    httpGetAsync('/getProxMobility', function(response){
        for(var i = 0; i < response.length; i++)
            points.push(response[i]);
});

// data for zone clustering
var foundPeople1 = [];
var foundPeople2 = [];
var foundPeople3 = [];
httpGetAsync('/getProxOut/18', function(response){
    for(var i = 0; i < response.length; i++)
        foundPeople1.push({"datetime": format.parse(response[i].datetime), "zone": response[i].zone, "floor": response[i].floor, "id": response[i].id, });
});
httpGetAsync('/getProxOut/22', function(response){
    for(var i = 0; i < response.length; i++)
        foundPeople2.push({"datetime": format.parse(response[i].datetime), "zone": response[i].zone, "floor": response[i].floor, "id": response[i].id, });
});
httpGetAsync('/getProxOut/24', function(response){
    for(var i = 0; i < response.length; i++)
        foundPeople2.push({"datetime": format.parse(response[i].datetime), "zone": response[i].zone, "floor": response[i].floor, "id": response[i].id, });
});
httpGetAsync('/getProxOut/31', function(response){
    for(var i = 0; i < response.length; i++)
        foundPeople3.push({"datetime": format.parse(response[i].datetime), "zone": response[i].zone, "floor": response[i].floor, "id": response[i].id, });
});
foundPeople1.sort(sortArray);
foundPeople2.sort(sortArray);
foundPeople3.sort(sortArray);

// Get all hazium data and store it in one variable
var hazium = [];
var tmpF1Z8 = [];
var tmpF2Z2 = [];
var tmpF2Z4 = [];
var tmpF3Z1 = [];

// Make one hazium list
httpGetAsync('/getHaziumF1Z8', function(response){
    for(var i = 0; i < response.length; i++)
        tmpF1Z8.push({"datetime": format.parse(response[i].datetime), "F1Z8": response[i].F1Z8} );
});
httpGetAsync('/getHaziumF2Z2', function(response){
    for(var i = 0; i < response.length; i++)
        tmpF2Z2.push({"datetime": format.parse(response[i].datetime), "F2Z2": response[i].F2Z2});
});
httpGetAsync('/getHaziumF2Z4', function(response){
    for(var i = 0; i < response.length; i++)
        tmpF2Z4.push({"datetime": format.parse(response[i].datetime), "F2Z4": response[i].F2Z4});
});
httpGetAsync('/getHaziumF3Z1', function(response){
    for(var i = 0; i < response.length; i++)
        tmpF3Z1.push({"datetime": format.parse(response[i].datetime), "F3Z1": response[i].F3Z1});
});


// sort all list by time
function sortArray(element1, element2) {
    return element1.datetime.getTime() - element2.datetime.getTime();
}

tmpF1Z8.sort(sortArray);
tmpF2Z2.sort(sortArray);
tmpF2Z4.sort(sortArray);
tmpF3Z1.sort(sortArray);


for (var i = 0; i < tmpF1Z8.length; i++) {
    hazium.push({"datetime": tmpF1Z8[i].datetime, "F1Z8": tmpF1Z8[i].F1Z8,
                "F2Z2": tmpF2Z2[i].F2Z2, "F2Z4": tmpF2Z4[i].F2Z4, "F3Z1": tmpF3Z1[i].F3Z1});
}
//console.log(hazium)
//create a new parallel coord plot
var pc1 = new pc(hazium);

// DEVIATION

// Get selected value from list and process it
function getSelected() {
    var e = document.getElementById('devList');
    var val = e.options[e.selectedIndex].value;
    if(val.indexOf("Hazium") > -1) {
        var tempVal = val.split(' ');
        $('#timetable').empty();
        setTimeout(function(){
            createTable(hazium, tempVal[1]);
        }, 3)
    } else getGeneralData(val.toString());
    
}
// Fetch data for general
var genData = [];
function getGeneralData(selected) {
    httpGetAsync('/getGeneral/'.concat(selected), function(response){
        for(var i = 0; i < response.length; i++) {
                genData.push({"datetime": format.parse(response[i].datetime),
                "val":response[i].val});
        }
    });
    // Sort data by time
    genData.sort(sortArray);
    // Create table
    $('#timetable').empty();
    setTimeout(function(){
        createTable(genData, 'val');
    }, 3)
}

// Fill table with data
function createTable(arr, val) {
    // Calculate distribution and put it in a table
    var day = undefined, n = 2, tableNr = 0, table = undefined;
    var atRow, row, col1, col2;

    for(var i = 0; i < arr.length; i++) {
        if(day === arr[i].datetime.getDate()) {
            if(i < n || (variance(arr.slice(i-n,i), val) >
                variance(arr.slice(i-n+1,i+1), val))) {
                // Insert row into table
                row = table.insertRow(atRow);
                col1 = row.insertCell(0);
                col2 = row.insertCell(1);
                col1.innerHTML = getTime(arr[i].datetime);
                col2.innerHTML = arr[i][val];
                atRow++;
            }
        } else {
            // Remove empty tables
            if (table && (atRow < 2 || (tableNr === 1 && atRow < n + 1))) {
                table.remove();
            }
            // Create a table for every day
            var table = document.createElement('table');
            document.getElementById('timetable').appendChild(table);
            day = arr[i].datetime.getDate();
            row = table.insertRow(0);
            col1 = row.insertCell(0);
            col2 = row.insertCell(1);
            col1.innerHTML = arr[i].datetime.toDateString();
            col2.innerHTML = 'Value';
            atRow = 1;
            tableNr++;
        }
    }
}

// Calculate variance
function variance(X, val) {
    var mean = 0, v = 0;
    for( var i = 0; i < X.length; i++) {
       mean += parseFloat(X[i][val]); 
    }
    mean /= X.length;
    for( var i = 0; i < X.length; i++) {
        v += Math.pow(parseFloat(X[i][val] - mean), 2);
    }
    v /= X.length - 1;
    return v;
}
    
// Format time
function getTime(time) {
    var hour = time.getHours();
    var minute = time.getMinutes();
    hour < 10 ? hour = '0' + hour : hour; 
    minute < 10 ? minute = '0' + minute : minute; 
    return hour + ':' + minute;
}

// sort all list by time
function sortArray(element1, element2) {
    return element1.datetime.getTime() - element2.datetime.getTime();
}
// sort list by clusters
function sortbyClusters(element1, element2) {
    return element1.clusters - element2.clusters;
}

function find(array, id) {
    for(var i=0;i<array.length;i++) {
        if (array[i].id == id)
            return i;
    }
    return -1;
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

var plotList = [
        "Floor 1",        // 0
        "Floor 1 Energy Zones",
        "Floor 1 Proximity Zones",
        "Floor 2",        // 3
        "Floor 2 Energy Zones",
        "Floor 2 Proximity Zones",
        "Floor 3",        // 6
        "Floor 3 Energy Zones",
        "Floor 3 Proximity Zones"
    ];

draw();

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

    //draw point        
    var count = 0;
    var point = g.selectAll("circle").data(points)
        .enter().append("circle")
        .attr("d", path)
        .attr("class", "point")
        .attr("cx", function(d) { return ( (d.coordinates[0]/maxX)*imW  - offsetX); })
        .attr("cy", function(d) { return (height - (d.coordinates[1]/maxY)*imH - offsetY); })
        .attr("r", 5)
        .style("opacity", function(d){
                return (Number(d.floor) == currImg+1) ? 1. : 0.0
                
            })
        .style("fill", function(d, i){ 
            if (cc[i] != undefined) 
                return cc[i]; 
            else
                return "black";
        });


    $('#floor').append('<legend id="child">' + plotList[currImg*3 + currView] + '</legend>').html;
};

// fuzzy kmeans cluster people to find the people in biggest risk of hazium
this.cluster = function () {
        $('#list').remove();
    console.log("Enter clustering");
    // Filter to only store relevant people in the kmeansArray
    kmeansArray = [];
    var next;
    var found = -1;
    var fiveMin = 300000;
    hazium.forEach(function(d,i) {
        next = new Date(d.datetime.getTime()+fiveMin);
        
        if (d.F1Z8 > 0.0) {
            for (var i = 0; i < foundPeople1.length; i++) {
                if ( foundPeople1[i].datetime.getTime() <= next && foundPeople1[i].datetime.getTime() >= d.datetime.getTime() ) {
                    found = find(kmeansArray, foundPeople1[i].id) 
                    if (found > -1) {
                        kmeansArray[found].times++;
                        kmeansArray[found].hazium += Number(d.F1Z8);
                    }
                    else {
                        kmeansArray.push({ "id": foundPeople1[i].id, "times": 1, "hazium": Number(d.F1Z8) });
                    }
                }
                
            }
        }

        if (d.F2Z2 > 0.0 || d.F2Z4) {
            for (var i = 0; i < foundPeople2.length; i++) {
                if ( foundPeople2[i].datetime.getTime() <= next && foundPeople2[i].datetime.getTime() >= d.datetime.getTime() ) {
                    found = find(kmeansArray, foundPeople2[i].id) 
                    if (found > -1) {
                        kmeansArray[found].times++;
                        if (foundPeople2[i].zone == '2')
                            kmeansArray[found].hazium += Number(d.F2Z2);
                        else
                            kmeansArray[found].hazium += Number(d.F2Z4);
                    }
                    else {
                        var h;
                        if (foundPeople2[i].zone == '2')
                            h = Number(d.F2Z2);
                        else
                            h = Number(d.F2Z4);
                        kmeansArray.push({ "id": foundPeople2[i].id, "times": 1, "hazium": h });
                    }
                }
                
            }

        }
        if (d.F3Z1 > 0.0) {
            for (var i = 0; i < foundPeople3.length; i++) {
                if ( foundPeople3[i].datetime.getTime() <= next && foundPeople3[i].datetime.getTime() >= d.datetime.getTime() ) {
                    found = find(kmeansArray, foundPeople3[i].id) 
                    if (found > -1) {
                        kmeansArray[found].times++;
                        kmeansArray[found].hazium += Number(d.F3Z1);
                    }
                    else {
                        kmeansArray.push({ "id": foundPeople3[i].id, "times": 1, "hazium": Number(d.F3Z1) });
                    }
                }
                
            }
        }   
    });

    console.log("Do the clustering");
    var k = document.getElementById('k').value;
    var clusterRes = kmeans(kmeansArray, k);
    var kmeansRes = [];
    // add id to the cluster list so we can visualise
    for (var i = 0; i < kmeansArray.length; ++i) {
        kmeansRes.push( { "id": kmeansArray[i].id, "clusters": clusterRes[i] } );
    }
    kmeansRes.sort(sortbyClusters);
    console.log(kmeansRes);
    var dangerList = "";
    for (i = 0; i < kmeansRes.length; ++i) {
        if (kmeansRes[i].clusters === 0)
            dangerList += "<li>" + kmeansRes[i].id + "</li>";
        else
            break;
    }
    // dangerList is the list of people with highest risk from the hazium
    console.log(dangerList);
    $('#danger').append('<ul id="list"> <br /><b>People at highest risk:</b>' + dangerList + '</ul>').html;

    // Visualize the people at risk (different clusters) - last known position of id
    var p = 0;
    points.forEach(function(d, i) {
        var found = find(kmeansRes, d.id);
        if (found > -1) {
            for (j = 0; j < k; j++) {
                if (kmeansRes[found].clusters === j) {
                    cc[i] = colors[j];
                }
            }
        }
    });
    points.forEach(function(d, i) {
        if (cc[i] == undefined)
            cc[i] = "black";
    });
    d3.selectAll(".point")
    .style("fill", function(d, i){ return cc[i]; });
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
