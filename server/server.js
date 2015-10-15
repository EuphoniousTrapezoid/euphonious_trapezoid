var express = require('express');

//initialize express application
var app = express();
var port = process.env.PORT || 8080;
app.listen(port);

//pass app, exress to middleware
require('.config/middleware.js')(app, express);