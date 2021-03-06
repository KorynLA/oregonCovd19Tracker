/***
* Routing to get /willamette  data
* Contains call to heroku DB to query data from all county tables in the Willamette region of OR.  
***/

var express = require('express');
var router = express.Router();
var client = require('../dbhandler');

router.get('/', function(req, res, next) {
  //connect to Heroku DB to query data
  try {
    client.connect();
  }
  catch(err) {
    console.log("Error connecting to server" + err);
  }
  //Query the database with a promise, return the answer, and set the var to the response found
  let clatsop, columbia, tillamook, yamhill, polk, marion, lincoln, linn, benton, lane;
  client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM clatsop ORDER BY date_of_cases DESC")
    .then(res => {
      clatsop = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM columbia ORDER BY date_of_cases DESC");
    })
    .then(res => {
      columbia = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM tillamook ORDER BY date_of_cases DESC");
    })
    .then(res => {
      tillamook = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM yamhill ORDER BY date_of_cases DESC");
    })
    .then(res => {
      yamhill = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM polk ORDER BY date_of_cases DESC");
    })
    .then(res => {
      polk = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM marion ORDER BY date_of_cases DESC");
    })
    .then(res => {
      marion = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM lincoln ORDER BY date_of_cases DESC");
    })
    .then(res => {
      lincoln = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM linn ORDER BY date_of_cases DESC");
    })
    .then(res => {
      linn = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM benton ORDER BY date_of_cases DESC");
    })
    .then(res => {
      benton = res.rows;
      return client.query("SELECT distinct date_of_cases, positive_cases, deaths FROM lane ORDER BY date_of_cases DESC");
    })
    .then(res => {
      lane = res.rows;
    })
    .then(() => {
      res.json({clatsop, columbia, tillamook, yamhill, polk, marion, lincoln, linn, benton, lane});
    })
    //if error, print to console
    .catch(e => console.error(e.stack))
    //close client, no other queries to be made
    .finally(()=> client.close());
});
module.exports = router;