var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var totalRouter = require('./routes/total');
var usersRouter = require('./routes/counties');
var metroRouter = require('./routes/metro');
var southwesternRouter = require('./routes/southwestern');
var easternRouter = require('./routes/eastern');
var willametteRouter = require('./routes/willamette');
var centralRouter = require('./routes/central');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/total', totalRouter);
app.use('/counties', usersRouter);
app.use('/metro', metroRouter);
app.use('/southwestern', southwesternRouter);
app.use('/eastern', easternRouter);
app.use('/willamette', willametteRouter);
app.use('/central', centralRouter);

module.exports=app;