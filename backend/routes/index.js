/***
* Routing to get /test data
* Test route that does not call from the heroku database
***/

var express = require('express');
var router = express.Router();
var pool = require('../dbhandler');

// returns JSON object with dummy values for testing
router.get('/', function(req, res, next) {
	return res.send({"no":{"Hello": "World"}});
});
module.exports = router;
