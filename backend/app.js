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


var rootPath=path.parse(__dirname)["dir"];
const frontendPath=path.join(rootPath, 'frontend/build')

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Static files from the React frontend app
app.use('/', express.static(frontendPath));

app.use('/api/test', indexRouter);
app.use('/api/total', totalRouter);
app.use('/api/counties', usersRouter);
app.use('/api/metro', metroRouter);
app.use('/api/southwestern', southwesternRouter);
app.use('/api/eastern', easternRouter);
app.use('/api/willamette', willametteRouter);
app.use('/api/central', centralRouter);

module.exports=app;