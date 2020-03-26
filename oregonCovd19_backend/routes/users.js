var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://@localhost:5432/oregonCovd19";

var client = new pg.Client(conString);
client.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
	//database connection
	client.query('SELECT countyname, population FROM counties').then(response => {
		res.send(JSON.stringify(response.rows));
	}).catch(error=> { console.log(error); });
})
module.exports = router;
