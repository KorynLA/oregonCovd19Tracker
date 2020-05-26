/***
* Routing to get /metro data
* Contains call to heroku DB to query data from all county tables in the Portland metro region of OR.  
***/

var express = require('express');
var router = express.Router();
var client = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
  //connect to client to query Heroku DB
  try {
    client.connect();
  }
  catch(err) {
    console.log("Error connecting to server" + err);
  }
  //Query the database with a promise, return the answer, and set the var to the response found
  let clackamas, multnomah, washington, hood_river;
  client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM clackamas ORDER BY date_of_cases DESC")
    .then(res => {
      clackamas = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM multnomah ORDER BY date_of_cases DESC");
    })
    .then(res => {
      multnomah = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM washington ORDER BY date_of_cases DESC");
    })
    .then(res => {
      washington = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM hood_river ORDER BY date_of_cases DESC");
    })
    .then(res => {
      hood_river = res.rows;
    })
    .then(() => {
      res.json({clackamas, multnomah, washington, hood_river});
    })
    //If error, print to console
    .catch(e => console.error(e.stack))
    //Close client, no other queries to be made
    .finally(()=> client.close());
});
module.exports = router;