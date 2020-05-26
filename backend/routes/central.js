/***
* Routing to get /central data
* Contains call to heroku DB to query data from all county tables in Central, OR.  
***/

var express = require('express');
var router = express.Router();
var client = require('../dbhandler');


router.get('/', function(req, res, next) {
  //try to connect to the Heroku DB
  try {
    client.connect();
  }
  catch(err) {
    console.log("Error connecting to server" + err);
  }
    let wasco, sherman, gilliam, jefferson, wheeler, crook, deschutes, lake, klamath;

    //Query the database with a promise, return the answer, and set the var to the response found
    client.query("SELECT distinct  date_of_cases, positive_cases, deaths FROM wasco ORDER BY date_of_cases DESC")
    .then(res => {
      wasco = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM sherman ORDER BY date_of_cases DESC");
    })
    .then(res => {
      sherman = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM gilliam ORDER BY date_of_cases DESC");
    })
    .then(res => {
      gilliam = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM jefferson ORDER BY date_of_cases DESC");
    })
    .then(res => {
      jefferson = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM wheeler ORDER BY date_of_cases DESC");
    })
    .then(res => {
      wheeler = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM crook ORDER BY date_of_cases DESC");
    })
    .then(res => {
      crook = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM deschutes ORDER BY date_of_cases DESC");
    })
    .then(res => {
      deschutes = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM lake ORDER BY date_of_cases DESC");
    })
    .then(res => {
      lake  = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM klamath ORDER BY date_of_cases DESC");
    })
    .then(res => {
      klamath = res.rows;
    })
    //convert vars to utf8 charset. JSON response is then sent to requester
    .then(() => {
       res.json({wasco, sherman, gilliam, jefferson, wheeler, crook, deschutes, lake, klamath});
     })
    //if error print to console
    .catch(e => console.error(e.stack))
    //close client, no more requests to be made
    .finally(()=> client.close());
});
module.exports = router;