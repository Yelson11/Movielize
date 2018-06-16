var http = require("http"),
 fs = require ("fs");
 
  
http.createServer(function (req, res){
    if (req.url.indexOf("favicon.ico") > 0) {return;}
	fs.readFile("./index.html", function(err,html){
	
	var html_string = html.toString ();
	var arreglo_parametros = [], parametros= {} ;
	var variables=html_string.match((/[^\{\}]+(?=\})/g));
	var nombre ="";
	if (req.url.indexOf("?") > 0 ){
		var url_data = req.url.split("?");
		var arreglo_parametros = url_data[1].split("&");
	}
	for (var i = arreglo_parametros.length - 1; i >= 0; i--) {
		var parametro = arreglo_parametros[i];
		var param_data = parametro.split("=");
		parametros[param_data[0]] = param_data[1];
	}
	for (var i = variables.length - 1; i >= 0; i--) {
	 	var variable = variables[i];
	 	html_string = html_string.replace("{"+variables[i]+"}", parametros [variable]);
	}

	var respuesta = parametros[variable];
	if (respuesta != null){
		var respuesta = replaceAll(parametros[variable], "+", " ");
		respuesta = preparateJSON(respuesta);
	}

	getYear(respuesta);	
	console.log(respuesta);
	res.writeHead (200, {"Content-Type":"text/html"})
	res.write(html_string);
	res.end();
	});

//JSON
	function ReadToArray (filename) {
    var data = JSON.parse(fs.readFileSync(filename));
    //console.log(data);
    return data;
	};

	function loadFile(filepath){
		var arrLines = [];
		fs.stat(filepath, function(err, stat) {
			if(err == null) {
				arrLines = fsReadFileSynchToArray(filepath);
			} else if(err.code == 'ENOENT') {
				console.log('error: loading file ' + filepath + ' not found');
			} else {
				console.log('error: loading file', err.code);
			}
		});
		return arrLines;
	};

	function getYear(pMovieName){
		//Carga el JSON
		var jsonObject = ReadToArray("videosdb.json");
		for(var indexMovie in jsonObject){
			if (pMovieName == jsonObject[indexMovie].title)			
			console.log(jsonObject[indexMovie].title, jsonObject[indexMovie].year);
		}
	}

	function replaceAll(pString, pFind, pReplace){
    	var result = pString.split(pFind).join(pReplace);
    	return result;
	}

	function preparateJSON(pString){
		var result = pString.split("+").join(" ");
		result = result.split("%7D").join("}");
		result = result.split("%5B").join("[");
		result = result.split("%5D").join("]");
		result = result.split("%3A").join(":");
		result = result.split("%22").join('"');
		result = result.split("%2C").join(",");
		result = result.split("%7B").join("{");
		result = result.split("%27").join("'");
		result = result.split("%2F").join("/");
		result = result.split("%5C").join("/");
		result = result.split("%3F").join("?");
		result = result.split("%BF").join("¿");
		result = result.split("%2B").join("+");
		result = result.split("%26").join("&");
		result = result.split("%21").join("!");
		result = result.split("%A1").join("¡");
		return result;
	};

}).listen (8080);﻿