var express = require('express');
var router = express.Router();
var pg = require('pg');
var client = require('../dbhandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
	try {
		client.connect();
	}
	catch(err) {
		console.log("Error connecting to server" + err);
	}
	client.query('SELECT countyname, population FROM counties')
	.then(response => {
		res.send(JSON.stringify(response.rows));
	})
	.catch(error=> { console.log(error); })
	.finally(()=> client.close());
})
module.exports = router;
