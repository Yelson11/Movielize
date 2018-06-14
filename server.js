var express = require('express');

var videos = require("./videosdb"); 

function iniciar(){
	var app = express();
	app.get('/video/:videoId', function(req, res){
		res.writeHead(200);
		var video = videos.filter(function(m){
			return m.title === req.params.videoId
		})[0];	
	if (!video){
		res.send(404);
	}
	else{
		res.end(video.year);
		console.log('Su solicitud es %s', video.year);
	}
});
	var server = app.listen(8080, function(){
		var port = server.address().port
		console.log('Servidor es: %s', port)
	})

}

exports.iniciar = iniciar

/*
var http = require('http');

http.createServer(function(request, response){
	response.writeHead(200);
	response.write('hola');
	response.end();
}).listen(8080, function(){
	console.log('dddddddddddddd');
});

*/