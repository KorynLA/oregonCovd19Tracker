var express = require('express');
var router = express.Router();
var pool = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
	return res.send({"no":{"Hello": "World"}});
});
module.exports = router;
