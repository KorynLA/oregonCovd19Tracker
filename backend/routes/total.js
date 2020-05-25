var express = require('express');
var router = express.Router();
var client = require('../dbhandler');

client.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
	// promise
	client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM Total ORDER BY date_of_cases DESC")
  	.then(response => {
      res.send(JSON.stringify(response.rows));
    })
  	.catch(e => console.error(e.stack))
  	client.end();
});

module.exports = router;