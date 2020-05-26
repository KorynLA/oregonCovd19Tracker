/***
* Routing to get /counties data
* Contains call to heroku DB to query population data from the county table
***/

var express = require('express');
var router = express.Router();
var pg = require('pg');
var client = require('../dbhandler');

//Connect to Heroku DB
router.get('/', function(req, res, next) {
	try {
		client.connect();
	}
	catch(err) {
		console.log("Error connecting to server" + err);
	}
	//Query the database with a promise and send the response found
	client.query('SELECT countyname, population FROM counties')
	.then(response => {
		res.send(JSON.stringify(response.rows));
	})
	//else print error
	.catch(error=> { console.log(error); })
	//close client connection, no more requests to be made
	.finally(()=> client.close());
})
module.exports = router;
