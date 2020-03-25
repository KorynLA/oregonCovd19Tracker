var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

//database connection
var pg = require('pg');
var conString = "postgres://:@localhost:5432/oregonCovd19";

var client = new pg.Client(conString);
client.connect();
client.query('SELECT countyname, population FROM counties', (err, res) => {
	if(err) {
		console.log(err.stack);
	}
	else {
		console.log(res.rows);
	}
 })

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

module.exports = app;
