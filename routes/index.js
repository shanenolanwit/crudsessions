var express = require('express');
var router = express.Router();
var db = require('../database/sqlConnector.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  var conn = db();
  //Test the connection
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
  res.render('index', { title: 'Express' });
});

module.exports = router;
