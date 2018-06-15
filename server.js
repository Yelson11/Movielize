var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
	console.log('request was made: ' + req.url);

	//Conectar al html
	res.writeHead(200, {'Content-Type': 'text/html'});
	var myReadStream = fs.createReadStream(__dirname + '/principal.html', 'utf8');
	myReadStream.pipe(res);
	
});
function myFunction() {
      document.getElementById("btn").value = "YOU CLICKED ME!";
 	};
server.listen(8080, '127.0.0.1');
console.log('Yelson is running...');