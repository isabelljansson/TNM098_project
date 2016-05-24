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


function pc(){
	console.log('create pc')
	var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S");

	var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //get the data
    self.data = [];
    httpGetAsync('/getGeneral', function(data){
    	
    	self.data.push(["datetime", "wind", "tankTemperature"]);
    	
    	for(var i = 1; i < data.length; i++)
    		self.data.push([format.parse(data[i][0]), Number(data[i][1]), Number(data[i][2])]);

    	//console.log(self.data)
        // Extract the list of dimensions and create a scale for each.
	    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
	    	console.log(d)
            return d != "datetime" && (y[d] = d3.scale.linear()
                .domain(d3.extent(self.data, function(p) {
                    return +p[d];}))
                .range([height, 0])); 
        }));

       draw();
    });
      

    function draw()
    {
    	// Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            .data(self.data);/*
    		.enter().append("path")
      		.attr("d", path);*/

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
      		.attr("class", "foreground")
    		.selectAll("path")
     		.data(self.data)
    		.enter().append("path")
      		.attr("d", path);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

    }

     // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }


}