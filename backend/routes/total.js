/***
* Routing to get /total data
* Contains call to heroku DB to query data from total table
***/

var express = require('express');
var router = express.Router();
var client = require('../dbhandler');


router.get('/', function(req, res, next) {
	//connect to Heroku DB
	try {
		client.connect();
	}
	catch(err) {
		console.log("Error connecting to server" + err);
	}
  	//Query the database with a promise and send/return the answer
	client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM Total ORDER BY date_of_cases DESC")
  	.then(response => {
      res.send(JSON.stringify(response.rows));
    })
    //if error print to console
  	.catch(e => console.error("Query error "+e.stack))
  	//close client, no other queries to be made
    .finally(()=> client.close());
});

module.exports = router;