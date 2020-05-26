/***
* Routing to get /eastern data
* Contains call to heroku DB to query data from all county tables in the Eastern region of OR.  
***/

var express = require('express');
var router = express.Router();
var client = require('../dbhandler');

router.get('/', function(req, res, next) {
  try {
    client.connect();
  }
  catch(err) {
    console.log("Error connecting to server" + err);
  }
  //Query the database with a promise, return the answer, and set the var to the response found
  let morrow, umatilla, union, wallowa, baker, grant, harney, malheur;
  client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM morrow ORDER BY date_of_cases DESC")
    .then(res => {
      morrow = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM umatilla ORDER BY date_of_cases DESC");
    })
    .then(res => {
      umatilla = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM wallowa ORDER BY date_of_cases DESC");
    })
    .then(res => {
      wallowa = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM baker ORDER BY date_of_cases DESC");
    })
    .then(res => {
      baker = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM _grant ORDER BY date_of_cases DESC");
    })
    .then(res => {
      grant = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM harney ORDER BY date_of_cases DESC");
    })
    .then(res => {
      harney = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM malheur ORDER BY date_of_cases DESC");
    })
    .then(res => {
      malheur = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM _union ORDER BY date_of_cases DESC");
    })
    .then(res => {
      union = res.rows;
    })
    .then(() => {
      res.json({morrow, umatilla, union, wallowa, baker, grant, harney, malheur});
    })
    //Print error found if promise not fulfilled
    .catch(e => console.error(e.stack))
    //Close client connection, no other requests will be made
    .finally(()=> client.close());
});
module.exports = router;