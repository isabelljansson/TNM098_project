function pc(){
	console.log('create pc')


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
        

}