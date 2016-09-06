var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

// mongoose config
require('./data_access/dataconnect');

app.listen(3333, function () {
  console.log('Example app listening on port 3333!');
});

// include ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

// setup the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//
//Set up the route parmeters to the route files
//
var users = require('./routes/users');
var routes = require('./routes/index');
var form = require('./routes/form');
var aboutus = require('./routes/aboutus');
var check = require('./routes/check');
//
// app.use is setting up the routes for when a user calls that specific
//  page.
//
app.use('/', routes);
app.use('/users', users);
app.use('/form', form);
app.use('/about',aboutus);
app.use('/create', form);
app.use('/check', check)

//
// include the schemas
//




var dotenv = require('dotenv');
dotenv.load();


