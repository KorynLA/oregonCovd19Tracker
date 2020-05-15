var express = require('express');
var router = express.Router();
var pg = require('pg');
var pool = require('../dbhandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
	pool.query('SELECT countyname, population FROM counties')
	.then(response => {
		res.send(JSON.stringify(response.rows));
	})
	.catch(error=> { console.log(error); });
})
module.exports = router;
