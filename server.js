'use strict';
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
require('./models/Polls');
require('./models/Options');
var bodyParser = require('body-parser');
var routes = require('./app/routes/index');
var app = express();

mongoose.connect('mongodb://localhost:27017/cvotedb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function (req, res) {
		res.sendFile(process.cwd() + 'public/index.html');
		});


routes(app);

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

module.exports = app;
