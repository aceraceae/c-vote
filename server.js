'use strict';
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var mongoose = require('mongoose');
require('./models/Polls');
require('./models/Options');
require('./models/Users');
require('./config/passport');
var passport = require('passport');
var bodyParser = require('body-parser');
require('dotenv').load();
var routes = require('./app/routes/index');
var app = express();
mongoose.connect(process.env.MONGO_URI);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(passport.initialize());

app.get('/', function (req, res) {
		res.sendFile(process.cwd() + 'public/index.html');
		});


routes(app);

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

module.exports = app;


