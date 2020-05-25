var express = require('express');
var router = express.Router();
var client = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    client.connect();
  }
  catch(err) {
    console.log("Error connecting to server" + err);
  }
  // promise
    let wasco, sherman, gilliam, jefferson, wheeler, crook, deschutes, lake, klamath;
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
    .then(() => {
       res.json({wasco, sherman, gilliam, jefferson, wheeler, crook, deschutes, lake, klamath});
     })
    .catch(e => console.error(e.stack))
    .finally(()=> client.close())
});
module.exports = router;