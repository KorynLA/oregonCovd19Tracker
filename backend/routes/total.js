var express = require('express');
var router = express.Router();
var client = require('../dbhandler');

/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		client.connect();
	}
	catch(err) {
		console.log("Error connecting to server" + err);
	}
	client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM Total ORDER BY date_of_cases DESC")
  	.then(response => {
      res.send(JSON.stringify(response.rows));
    })
  	.catch(e => console.error("Query error "+e.stack))
  	.then(()=> client.close())
});

module.exports = router;