var datos = [10,20,30,5,8,13];

function graphic(){
	var svg = d3.select('body')
				.append('svg');

	var circulos = svg.selectAll('circle')
		.data(datos)
		.enter().append('circle');

	circulos.attr("cx", function(d, i){
		return (i * 10) + 50;
	})
	.attr("cy", function(d, i){
		return 100;
	})
	.attr("r", function(d){
		return d
	});

	var yRange = d3.scale.linear()
		.range([100,0])
		.domain([d3.min(datos, function(d){
			return d;
		})]);

	var yAxis = d3.svg.axis()
		.scale(yRange)
		.orient("left");

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, 10)")
		.call(yAxis);


}
