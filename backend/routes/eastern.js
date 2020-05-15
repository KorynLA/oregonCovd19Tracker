var express = require('express');
var router = express.Router();
var pool = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
  // promise
  let morrow, umatilla, union, wallowa, baker, grant, harney, malheur;
  pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM morrow ORDER BY date_of_cases DESC")
    .then(res => {
      morrow = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM umatilla ORDER BY date_of_cases DESC");
    })
    .then(res => {
      umatilla = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM wallowa ORDER BY date_of_cases DESC");
    })
    .then(res => {
      wallowa = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM baker ORDER BY date_of_cases DESC");
    })
    .then(res => {
      baker = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM _grant ORDER BY date_of_cases DESC");
    })
    .then(res => {
      grant = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM harney ORDER BY date_of_cases DESC");
    })
    .then(res => {
      harney = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM malheur ORDER BY date_of_cases DESC");
    })
    .then(res => {
      malheur = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM _union ORDER BY date_of_cases DESC");
    })
    .then(res => {
      union = res.rows;
    })
    .then(() => {
      res.json({morrow, umatilla, union, wallowa, baker, grant, harney, malheur});
    })
    .catch(e => console.error(e.stack))
});
module.exports = router;