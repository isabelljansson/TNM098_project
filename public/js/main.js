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

var points = [];
    httpGetAsync('/getAllPoints', function(response){
        for(var i = 0; i < response.length; i++)
            points.push(response[i]);
    })

var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

var zoom = d3.behavior.zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", move);

var mapDiv = $("#map");

var margin = {top: 20, right: 20, bottom: 20, left: 20},
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



//to call server to find
/*
httpGetAsync('/find', function(response){
    console.log('this is the response '+response)
})*/

//get all points


//Loads geo data
d3.json("json/proxMobileOut-MC2-clean.json", function (json) {
    //console.log(json);
    //root = json;
    //root.fixed = true;
    //root.x = w / 2;
    //root.y = h / 4;

    var defs = svg.insert("svg:defs")
      .data(["end"]);

    //var countries = topojson.feature(people, data.message).features;
    draw();
});

// temp dataset to plot out max/min of x,y [0,0] -> [189,111]
    var dataset = [
                [0, 0], [189, 111], [57, 50], [100, 33], [150, 95],
                [10, 12], [175, 44], [25, 67], [85, 21], [30, 88]
            ];

var currImg = 0;
var currView = 0;
var offsetX = 160, offsetY = -70;
var maxX = 189, maxY = 115;

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

console.log("Index: "  + (currImg*3 + currView));
console.log(imageList[currImg*3 + currView]);

this.changeFloor = function() {
    if (currImg > 1)
        currImg = 0;
    else
        currImg++;
    draw();
}

this.toggleView = function() {
    if (currView >= 2)
        currView = 0;
    else
        currView++;
    draw();
}




//Draws the map and the points
function draw()
{
    d3.select("g").remove();
    var g = svg.append("g");

    //draw map of office floor
    var people = g
         .attr("x",0)
         .attr("y",0)
         .attr("transform","translate(0,0)")
         .append('image')
         .attr("x",0)
         .attr("y",0)
         .attr("width",width)
         .attr("height",height)
         .attr("xlink:href",imageList[currImg*3 + currView]);

    //draw point        
    var point = g.selectAll("circle").data(points)
            .enter().append("circle")
            .attr("d", path)
            .attr("class", "point")
            .attr("cx", function(d) { return (d[0]*width/(1.6*maxX) + offsetX); })
            .attr("cy", function(d) { return (height - (d[1]*height/(1.4*maxY)) + offsetY); })
            .attr("r", 2);

    //console.log(points)
};

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