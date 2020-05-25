var express = require('express');
var router = express.Router();
var client = require('../dbhandler');
/* GET home page. */
router.get('/', function(req, res, next) {
  // promise
  try {
    client.connect();
  }
  catch(err) {
    console.log("Error connecting to server" + err);
  }
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
    .catch(e => console.error(e.stack))
    .finally(()=> client.close())
});
module.exports = router;