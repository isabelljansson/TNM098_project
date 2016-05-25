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


function pc(hazium){
	console.log('create pc')
	
	var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S");

	var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
        dragging = {};
        axisText = [];

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
    	
    	axisText = data[0];
    	axisText.push("hazium");
    	
    	//remove the first item from data (containing the field names) to be able to sort
    	//sort the array depending on the time so it can be merged with the hazium array
    	data.splice(0,1);
    	data.sort(sortArray);

    	for(var i = 1; i < data.length; i++)
    	{
    		self.data.push([format.parse(data[i][0]), //datetime
    						Number(data[i][1]), 	  //SupplySideOutletTemperature
    						Number(data[i][2]),		  //HVACElectricDemandPower
    						Number(data[i][3]),		  //WaterHeaterTankTemperature
    						Number(data[i][4]),		  //SupplySideInletTemperature
    						Number(data[i][5]),		  //WindDirection
    						Number(data[i][6]),		  //TotalElectricDemandPower
    						Number(data[i][7]),		  //DrybulbTemperature
    						Number(data[i][8]),		  //WindSpeed
    						(Number(hazium[i].F1Z8) + Number(hazium[i].F2Z2) 
    					   + Number(hazium[i].F2Z4) + Number(hazium[i].F3Z1))/4]); //hazium  		
    	}

        // Extract the list of dimensions and create a scale for each.
	    x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
            return d != 0 && (y[d] = d3.scale.linear()
		        .domain(d3.extent(self.data, function(p) { return +p[d]; }))
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
            .data(self.data)
    		.enter().append("path")
      		.attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
      		.attr("class", "foreground")
    		.selectAll("path")
     		.data(self.data)
    		.enter().append("path")
      		.attr("d", path)
      		.style("opacity", function(d){
      			return d+1.0/self.data.length;
      		})
            

		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function(d) { return "translate(" + x(d) + ")"; })
			.call(d3.behavior.drag()
			.origin(function(d) { return {x: x(d)}; })
			.on("dragstart", function(d) {
				dragging[d] = x(d);
				background.attr("visibility", "hidden");
			})
			.on("drag", function(d) {
				dragging[d] = Math.min(width, Math.max(0, d3.event.x));
				foreground.attr("d", path);
				dimensions.sort(function(a, b) { return position(a) - position(b); });
				x.domain(dimensions);
				g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
				})
			.on("dragend", function(d) {
				delete dragging[d];
				transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
				transition(foreground).attr("d", path);
				background
				  	.attr("d", path)
					.transition()
				  	.delay(500)
				  	.duration(0)
				  	.attr("visibility", null);
			}));




        // Add an axis and title.
        g.append("g")
			.attr("class", "axis")
			.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    	.append("text")
			.style("text-anchor", "middle")
			.attr("y", -9)
			.text(function(d){
					return axisText[d];
			});

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

    }

	// sort all list by time
	function sortArray(element1, element2) {
	    return format.parse(element1[0]).getTime() - format.parse(element2[0]).getTime();
	}

    function position(d) {
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(g) {
		return g.transition().duration(500);
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