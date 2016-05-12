
/* 
var jsonData = {"": "json"};
d3.json(jsonData, function(json) {
    root = json;
    root.x0 = h / 2;
    root.y0 = 0;
});
*/
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
        .append("image")
        .attr("xlink:href", "floor1.jpg")
        .call(zoom);

var g = svg.append("g");

//Sets the map projection
var projection = d3.geo.mercator()
        .center([8.25, 56.8])
        .scale(700);

//Creates a new geographic path generator and assing the projection        
var path = d3.geo.path().projection(projection);

//Loads geo data
d3.json("json/proxMobileOut-MC2.json", function (error, people) {
    //var countries = topojson.feature(people, data.message).features;
    draw();
});



//Draws the map and the points
function draw()
{
    //draw map
    var p = g.attr("x",0)
            .attr("y",0)
            .attr("transform","translate(0,0)")
            .append("image")
            .attr("x",0)
            .attr("y",0)
            .attr("width",width)
            .attr("height",height)
            .attr("xlink:href","images/floor1.jpg");
           
    //draw point        
	var point = g.selectAll(".point").data(geoData.features)
		.enter().append("path")
		.attr("d", path)
		.attr("class", "point");
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