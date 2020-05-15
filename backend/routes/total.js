var express = require('express');
var router = express.Router();
var pool = require('../dbhandler');

/* GET home page. */
router.get('/', function(req, res, next) {
	// promise
	pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM Total ORDER BY date_of_cases DESC")
  	.then(response => {
      res.send(JSON.stringify(response.rows));
    })
  	.catch(e => console.error(e.stack))
});

module.exports = router;