
/* 
var jsonData = {"": "json"};
d3.json(jsonData, function(json) {
    root = json;
    root.x0 = h / 2;
    root.y0 = 0;
});
*/
var kmeansArray = [];
var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

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

//Loads geo data
d3.json("json/proxMobileOut-MC2.json", function (json) {
    console.log(json);
    //root = json;
    //root.fixed = true;
    //root.x = w / 2;
    //root.y = h / 4;

    var defs = svg.insert("svg:defs")
      .data(["end"]);

    //var countries = topojson.feature(people, data.message).features;
    //console.log(people.message);
    draw();
});

// temp dataset to plot out max/min of x,y [0,0] -> [189,111]
    var dataset = [
                [0, 0], [189, 111], [57, 50], [100, 33], [150, 95],
                [10, 12], [175, 44], [25, 67], [85, 21], [30, 88]
            ];

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

console.log('width', width, 'height', height);
console.log('mapDiv.width', mapDiv.width(), 'mapDiv.height', mapDiv.height());

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



// fuzzy kmeans cluster people to find the people in biggest risk of hazium
this.cluster = function () {
    // Filter to only store relevant people in the kmeansArray
    extent = value;
    kmeansArray = [];
    data.forEach(function(d,i) {
        // if in F1_Z8A or F2_Z2 or F2_Z4 or F3_Z1
            // if (kmeansArray.find(id) == d.id) // person finns i lista
                // kmeansArray.findIndex(id).times++;
                // kmeansArray.findIndex(id).hazium += haziumData.findIndex(time).hazium;
        // kmeansArray.pusH(id, tid, haziumkoncentrat.at(time=nu))
        var k = -1;
        if (format.parse(d.properties.time) >= value[0] && format.parse(d.properties.time) <= value[1]) {
            kmeansArray.push(d.properties);
            k = 1;
        }
    });

    // Do the fuzzy clustering
    //var k = document.getElementById('k').value;
    var kmeansRes = kmeans(kmeansArray,4);
    console.log(kmeansRes)
    

    // Visualize the clusters
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
            cc[i] = "orange";
    });
    
    console.log(cc);
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
	var point = g.selectAll("circle").data(dataset)
		.enter().append("circle")
		.attr("d", path)
		.attr("class", "point")
        .attr("cx", function(d) { return ( (d[0]/maxX)*imW  - offsetX); })
        .attr("cy", function(d) { return (height - (d[1]/maxY)*imH - offsetY); })
        .attr("r", 5);

    $('#floor').append('<legend id="child">' + imageList[currImg*3 + currView] + '</legend>').html;
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