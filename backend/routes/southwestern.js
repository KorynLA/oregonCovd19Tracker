/***
* Routing to get /southwestern data
* Contains call to heroku DB to query data from all county tables in the Southwestern region of OR.  
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
  //Query the database with a promise, return the answer, and set the var to the response found
  let douglas, curry, coos, josephine, jackson;
  client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM douglas ORDER BY date_of_cases DESC")
    .then(res => {
      douglas = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM curry ORDER BY date_of_cases DESC");
    })
    .then(res => {
      curry = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM coos ORDER BY date_of_cases DESC");
    })
    .then(res => {
      coos = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM josephine ORDER BY date_of_cases DESC");
    })
    .then(res => {
      josephine = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM jackson ORDER BY date_of_cases DESC");
    })
    .then(res => {
      jackson = res.rows;
    })
    .then(() => {
      res.json({douglas, curry, coos, josephine, jackson});
    })
    //if error print to the console
    .catch(e => console.error(e.stack))
    //close cleint, no other queries will be made
    .finally(()=> client.close());
});
module.exports = router;