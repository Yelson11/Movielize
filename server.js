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
//El hashtable
var memory = new HashTable();

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
	var jGenre = req.query.genero;
	var jActor = req.query.actores;
	var jStar  = req.query.inicio;
	var jEnd   = req.query.fin;
	var json = preparateJSONsearch(jTitle, jGenre, jActor, jStar, jEnd);
	var strJson = JSON.stringify(json);
	var publicKey = encrypt(strJson, key);
	//memory.setItem(publicKey, json);
	//console.log(memory.getItem(publicKey));
	//var privateKey = search(); se usa la llave publica para generar la privada
	//res.send("Su llave pública es: " + publicKey);
 	res.sendFile(path.join(__dirname + '/principal.html'));	
});

app.get('/viewchart', function(req, res){ 
	var x = req.query.llave;
	//getHash(x)
 	res.sendFile(path.join(__dirname + '/principal.html'));	
});

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

		this.getItem = function(key) {
		    return this.hasItem(key) ? this.items[key] : undefined;
		}

		this.hasItem = function(key)
		{
		    return this.items.hasOwnProperty(key);
		}

		this.removeItem = function(key)
		{
		    if (this.hasItem(key)) {
		        previous = this.items[key];
		        this.length--;
		        delete this.items[key];
		        return previous;
		    }
		    else {
		        return undefined;
		    }
		}


		this.imprimirKeys = function()
		{
		    var keys = [];
		    for (var k in this.items) {
		        if (this.hasItem(k)) {
		            console.log(k);
		            console.log(this.items[k]);
		        }
		    }
		    return keys;
		}

		this.keys = function()
		{
		    var keys = [];
		    for (var k in this.items) {
		        if (this.hasItem(k)) {
		            keys.push(k);
		        }
		    }
		    return keys;
		}

		this.imprimirValues = function()
		{
		    var values = [];
		    for (var k in this.items) {
		        if (this.hasItem(k)) {
		            console.log(this.items[k]);
		        }
		    }
		}

		this.values = function()
		{
		    var values = [];
		    for (var k in this.items) {
		        if (this.hasItem(k)) {
		            values.push(this.items[k]);
		            console.log(this.items[k])
		        }
		    }
		    return values;
		}

		this.each = function(fn) {
		    for (var k in this.items) {
		        if (this.hasItem(k)) {
		            fn(k, this.items[k]);
		        }
		    }
		}

		this.clear = function()
		{
		    this.items = {}
		    this.length = 0;
		}
	};

//|------------------------------- ENCRIPTADO -------------------------------|
function encrypt(pJson, pKey){
	var enc = crypto.createCipher("aes-256-ctr", pKey).update(pJson, "utf-8", "hex");
	return enc;
};

function desencrypt(pJson){
	var desenc = crypto.createDecipher("aes-256-ctr", pKey).update(pJson, "hex", "utf-8");
	return desenc;
};


// escuchar comunicacion sobre el puerto indicado en HTTP
app.listen(PORT_NUMBER);
console.log("Listening on port "+PORT_NUMBER)