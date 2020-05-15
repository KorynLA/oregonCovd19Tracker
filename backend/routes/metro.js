var express = require('express');
var router = express.Router();
var pool = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
  // promise
  let clackamas, multnomah, washington, hood_river;
  pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM clackamas ORDER BY date_of_cases DESC")
    .then(res => {
      clackamas = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM multnomah ORDER BY date_of_cases DESC");
    })
    .then(res => {
      multnomah = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM washington ORDER BY date_of_cases DESC");
    })
    .then(res => {
      washington = res.rows;
      return pool.query("SELECT distinct date_of_cases, positive_cases, deaths FROM hood_river ORDER BY date_of_cases DESC");
    })
    .then(res => {
      hood_river = res.rows;
    })
    .then(() => {
      res.json({clackamas, multnomah, washington, hood_river});
    })
    .catch(e => console.error(e.stack))
});
module.exports = router;