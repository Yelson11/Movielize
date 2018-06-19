// para soportar cross domain
var cors = require('cors')
// servidor web
var express = require('express');
// para recibir y parsear content en formato json
var bodyParser = require('body-parser');
//Path
var path = require('path');
//Para encriptar
var crypto = require("crypto");
var key = "D10S";
var fs = require("fs");

//El hashtable
var memory = new HashTable();

var yearsHash = createHash();
//	for (i in list){
//		console.log(list[i]);
//	}

// constante para definir el puerto a ser usado
var PORT_NUMBER = 8080;

// se inicia el servidor web express
var app = express()

// iniciar el parsing de json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// para habilitar cross domain
app.use(cors())

// publicar contenido estatico que esta en ese folder
app.use(express.static("D:\\Users\\Yelson\\Documents\\JS Projects\\Movilize"));

app.get('/search', function(req, res){ 
	//Hay que hacerle el get de la busqueda y mandarle al algoritmo
	var jTitle = req.query.nombre;
	console.log(jTitle);
	var jGenre = req.query.genero;
	var jActor = req.query.actores;
	var jStar  = req.query.inicio;
	var jEnd   = req.query.fin;

	//Para hacer la busqueda
	var json = preparateJSONsearch(jTitle, jGenre, jActor, jStar, jEnd);
	var result = searchMovie(yearsHash, json.star, json.end, json.title, json.genre, json.actor);
	//Para encriptar
	preparateJSONchart(result);
//	console.log(result);
	var strJson   = JSON.stringify(json);
	var strResult = JSON.stringify(result);
	var publicKey = encrypt(strJson, key);
	var privateKey = encrypt(strResult, publicKey);
//	console.log("Encriptado:");
//	console.log("Public Key: " + publicKey);
//	console.log("Private Key: " + privateKey);
	if (!memory.hasItem(publicKey)){
		memory.setItem(publicKey, privateKey);
	}
	//res.send("Su llave pública es: " + publicKey);
 	res.sendFile(path.join(__dirname + '/prueba.html'));	
});

app.get('/viewchart', function(req, res){ 
	var key = req.query.llave;
	var publicKey = '' + key;
	var privateKey = memory.getItem(publicKey);
	console.log(memory.getItem(publicKey));
	//var json = desencrypt(privateKey, key);
//	console.log("Desencriptada: " + json);
 	res.sendFile(path.join(__dirname + '/chart.html'));	
});

function preparateJSONchart(pMovieList){
	for (movie in pMovieList){
		console.log(pMovieList[movie]);
	}
};

function preparateJSONsearch(pTitle, pGenre, pActor, pStar, pEnd){
	var jTitle = pTitle;
	var jGenre = pGenre;
	var jActor = pActor;
	var jStar  = pStar;
	var jEnd   = pEnd;
	if (jTitle == ''){
		jTitle = "null";
	}
	if (jGenre == ''){
		jGenre = "null";
	}
	if (jActor == ''){
		jActor = "null";
	}
	if (jStar == ''){
		jStar = "1900";
	}
	if (jEnd == ''){
		jEnd = "2016";
	}
	jStar  = parseInt(jStar);
	jEnd   = parseInt(jEnd);
	data = {
        title: jTitle,
        genre: jGenre,
        actor: jActor,
        star: jStar,
        end: jEnd,       
    };
    return data;
};
//|--------------------------------------------------------------------------|

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
            //console.log(indexYear);
            if (pGenre != 'null'){
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
		    else{
		    	for (var indexGenre in pYearsHash.items[indexYear].items) { //itera sobre los generos de cada año
		        	var listMovieNode = pYearsHash.items[indexYear].items[indexGenre];
		        	listMovieName = searchMovieName(pYearsHash.items[indexYear].items[indexGenre], pName.toLowerCase(), listMovieName);
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
			if (pListMoviesName != 'null'){
				listMovieName = commaSplit(pListMoviesName);
				for (indexMovieName in listMovieName)
				{
					movieName = pListMovies[indexMovie].title.toLowerCase();
					if (movieName.indexOf(listMovieName[indexMovieName]) > -1 && !lista.includes(pListMovies[indexMovie])){
						lista.push(pListMovies[indexMovie]);
					}	
				}
			}
			else
				lista.push(pListMovies[indexMovie]);
		}
		return lista;
	}	

	function searchMovieCast(pListMovies, pActor, lista){
		for (var indexMovie in pListMovies) {		
			if (pActor != 'null'){
				listMovieCast = commaSplit(pActor);		
				for (indexMovieCast in listMovieCast)
				{
					if (pListMovies[indexMovie].cast != null){
						movieCast = pListMovies[indexMovie].cast.toLowerCase();
						if (movieCast.indexOf(listMovieCast[indexMovieCast]) > -1 && !lista.includes(pListMovies[indexMovie])){
							lista.push(pListMovies[indexMovie]);
						}
					}	
				}
			}
			else
				lista.push(pListMovies[indexMovie]);
		}
		return lista;
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

//|------------------------------- ENCRIPTADO -------------------------------|
function encrypt(pJson, pKey){
	var enc = crypto.createCipher("aes-256-ctr", pKey).update(pJson, "utf-8", "hex");
	return enc;
};

function desencrypt(pJson, pKey){
	var desenc = crypto.createDecipher("aes-256-ctr", pKey).update(pJson, "hex", "utf-8");
	return desenc;
};


// escuchar comunicacion sobre el puerto indicado en HTTP
app.listen(PORT_NUMBER);
console.log("Listening on port "+PORT_NUMBER)