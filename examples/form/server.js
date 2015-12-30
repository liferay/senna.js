'use strict';

var express = require('express');
var multer = require('multer')
var app = express();
var upload = multer();

// Serve files
app.use(express.static('../../'));

app.post('/post', upload.array(), function(req, res, next) {
	var content = '<div id="result1">';
	content += JSON.stringify(req.body, 5);
	content += '</div>';
	res.end(content);
});

app.post('/post-get', upload.array(), function(req, res, next) {
	res.redirect('/examples/form/redirect.html');
});

// Server
app.listen(3000);