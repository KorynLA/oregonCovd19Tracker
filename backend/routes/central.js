var express = require('express');
var router = express.Router();
var pool = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
  // promise
    let wasco, sherman, gilliam, jefferson, wheeler, crook, deschutes, lake, klamath;
    pool.query("SELECT distinct  date_of_cases, positive_cases, deaths FROM wasco ORDER BY date_of_cases DESC")
    .then(res => {
      wasco = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM sherman ORDER BY date_of_cases DESC");
    })
    .then(res => {
      sherman = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM gilliam ORDER BY date_of_cases DESC");
    })
    .then(res => {
      gilliam = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM jefferson ORDER BY date_of_cases DESC");
    })
    .then(res => {
      jefferson = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM wheeler ORDER BY date_of_cases DESC");
    })
    .then(res => {
      wheeler = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM crook ORDER BY date_of_cases DESC");
    })
    .then(res => {
      crook = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM deschutes ORDER BY date_of_cases DESC");
    })
    .then(res => {
      deschutes = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM lake ORDER BY date_of_cases DESC");
    })
    .then(res => {
      lake  = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM klamath ORDER BY date_of_cases DESC");
    })
    .then(res => {
      klamath = res.rows;
    })
    .then(() => {
       res.json({wasco, sherman, gilliam, jefferson, wheeler, crook, deschutes, lake, klamath});
     })
     .catch(e => console.error(e.stack))
});
module.exports = router;