
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('index page');
  //
  res.render('index',{user:'FName LName',title:'homepage'});
});

module.exports = router;
