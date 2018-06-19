function graphic(){

	var high = 960,
		long = 1200,
    	format = d3.format(",d"),
    	color = d3.scaleOrdinal(d3.schemeCategory20c);

	var bubble = d3.pack()
    	.size([high, high])
    	.padding(1.5);

	var svg = d3.select("body")
		.append("svg")
    	.attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");

	d3.json("chartData.json", function(error, data){
		var circulos = svg.selectAll('circle')
			.data(datos)
			.enter().append('circle');

		circulos.attr("cx", function(data){
			return (i * 10) + 50;
		})
		.attr("cy", function(data){
			return 100;
		})
		.attr("r", function(data){
			return d;
		});
	}
}
