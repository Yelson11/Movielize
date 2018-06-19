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
	
	var yearsHash = createHash();
	list = searchMovie(yearsHash , 2005, 2015, 'good, Tomorrowland', 'Animation, Drama', 'Neff');
	
	res.writeHead (200, {"Content-Type":"text/html"})
	res.write(html_string);
	res.end();
	});

	function ReadToArray (filename) {
    var data = JSON.parse(fs.readFileSync(filename));
    	return data;
	};

	function createHash(){
		var yearsHash = new HashTable();
		var jsonObject = ReadToArray("videosdb.json");
		for(var indexMovie in jsonObject){
			if (jsonObject[indexMovie].genre != null){
				var listGenre = commaSplit(jsonObject[indexMovie].genre);
				for (var indexGenre in listGenre){
					yearsHash.setItemYear(jsonObject[indexMovie].year, listGenre[indexGenre].toLowerCase(), jsonObject[indexMovie]);	
				}				
			}
			else{
				yearsHash.setItemYear(jsonObject[indexMovie].year, "null", jsonObject[indexMovie]);
			}
		}
		return yearsHash;
	}

	function commaSplit(pString){
		var listWords = [];
		if (pString.indexOf(',') > 0){
			listWords = pString.split(", ");
		}
		else{ 
			listWords.push(pString);
		}
		return listWords;
	}

	function searchMovie(pYearsHash, pStart, pFinal, pName, pGenre, pCast){
		var listMovieName = [];
		var listMovieCast = [];
	    for (var indexYear = pStart; indexYear <= pFinal; indexYear++) {
            console.log(indexYear);
            listGenre = commaSplit(pGenre);
            for (var indexGenre in listGenre) { //itera sobre los generos de cada año
            	genre = listGenre[indexGenre].toLowerCase();
            	if (pYearsHash.items[indexYear].hasItem(genre)){
            		var listMovieNode = pYearsHash.items[indexYear].items[genre];
            		listMovieName = searchMovieName(pYearsHash.items[indexYear].items[genre], pName.toLowerCase(), listMovieName);
            		listMovieCast = searchMovieCast(listMovieNode, pCast.toLowerCase(), listMovieCast);
            	}
	    	}
	    }
	    listMovie = intersectionMovies(listMovieName, listMovieCast);
	    return listMovie;
	}

	function intersectionMovies(pListMovieName, pListMovieCast){
		var listMovies = []; 
		for (var indexMovie in pListMovieName) {
			if (pListMovieCast.includes(pListMovieName[indexMovie])) {
				listMovies.push(pListMovieName[indexMovie]);	
			}
		}
		return listMovies;
	}

	function searchMovieName(pListMovies, pListMoviesName, lista){
		for (var indexMovie in pListMovies) {
			listMovieName = commaSplit(pListMoviesName);
			for (indexMovieName in listMovieName)
			{
				movieName = pListMovies[indexMovie].title.toLowerCase();
				if (movieName.indexOf(listMovieName[indexMovieName]) > 0 && !lista.includes(pListMovies[indexMovie])){
					lista.push(pListMovies[indexMovie]);
				}	
			}
		}
		return lista;
	}	

	function searchMovieCast(pListMovies, pActor, lista1){
		for (var indexMovie in pListMovies) {		
			listMovieCast = commaSplit(pActor);		
			for (indexMovieCast in listMovieCast)
			{
				if (pListMovies[indexMovie].cast != null){
					movieCast = pListMovies[indexMovie].cast.toLowerCase();
					if (movieCast.indexOf(listMovieCast[indexMovieCast]) > 0 && !lista1.includes(pListMovies[indexMovie])){
						lista1.push(pListMovies[indexMovie]);
					}
				}	
			}
		}
		return lista1;
	}

	function HashTable(obj)
	{
		this.length = 0;
		this.items = {};
		for (var p in obj) {
		    if (obj.hasOwnProperty(p)) {
		        this.items[p] = obj[p];
		        this.length++;
		    }
		}


		this.setItem = function(key, value)
		{
			var listMovies = [];
		    var previous = undefined;
		    if (this.hasItem(key)) {
		        previous = this.items[key];
		    }
		    else {
		    	this.items[key] = listMovies;
		        this.length++;
		    }
		    this.items[key].push(value);
		    return previous;
		}

		this.hasItem = function(key)
		{
		    return this.items.hasOwnProperty(key);
		}

		this.setItemYear = function(key, value, pMovie)
		{
			var genreHash = new HashTable();
			var previous = undefined;
		    if (this.hasItemYear(key)) 
		    {
		        previous = this.items[key];
		    }
		    else 
		    {
		    	this.items[key] = genreHash;
		        this.length++;
		    }
		   	this.items[key].setItem(value, pMovie);
		    return previous;
		}

		this.getItem = function(key) {
		    return this.hasItem(key) ? this.items[key] : undefined;
		}

		this.getItemYears = function(key) {
		    return this.hasItemYear(key) ? this.items[key] : undefined;
		}

		this.hasItemYear = function(key)
		{
		    return this.items.hasOwnProperty(key);
		}

	}

}).listen (8080);﻿
