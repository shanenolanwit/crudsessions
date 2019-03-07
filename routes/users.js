var express = require('express');
var SHA256 = require("crypto-js/sha256");
var mysql = require('mysql');
var db = require('../database/sqlConnector.js');
var conn = db();
var router = express.Router();



/* *
 * Create user 
 * http://127.0.0.1:8080/users/create
 * { "username": "shane",	"password": "admin" }
 * */
router.post('/create', function(req, res, next) {
  let username = req.body.username;
  let password = SHA256(req.body.password).toString().toUpperCase();
  let data = {  username: username, password: password  };
  let sql = "INSERT INTO user SET ?";  
  let query = conn.query(sql, data, (err, results) => {
    if(err){
      res.json({
        data: err
      })
    }
    else{
      res.json({
        data: results
      })
    }
  });
});

/* *
 * Read users 
 * http://127.0.0.1:8080/users/read
 * http://127.0.0.1:8080/users/read?limit=1&&offset=1
 * */
router.get('/read', function(req, res, next) {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  let orderby = req.query.orderby || 'id';
  let order = req.query.order || 'asc'
  let ordering = order === "asc" ? "asc" : "desc";
  let params = [orderby,parseInt(limit),parseInt(offset)];
  let sql = mysql.format(`SELECT * FROM user ORDER BY ?? ${ordering} LIMIT ? OFFSET ?`, params);
  let query = conn.query(sql, (err, results) => {
    if(err){
      res.json({
        data: err
      })
    }else{
      res.json({
        users: results
      })
    };
  });
});

/* *
 * Read single user
 * http://127.0.0.1:8080/users/read/1
 * */
router.get('/read/:id', function(req, res, next) { 
  let sql = mysql.format(`SELECT * FROM user WHERE id = ?`, req.params.id);
  let query = conn.query(sql, (err, results) => {
    if(err){
      res.json({
        data: err
      })
    }else{
      res.json({
        user: results
      })
    };
  });
});

/* * 
 * Update user
 * http://127.0.0.1:8080/users/update
 * { "id" : 1, "username": "snolan",	"password": "admin" }
 * */
router.put('/update', function(req, res, next) {
  let id = parseInt(req.body.id);
  let username = req.body.username;
  let password = SHA256(req.body.password).toString().toUpperCase();
  let data = {  username: username, password: password  };
  let sql = "UPDATE user SET ? WHERE id = ?";  
  let query = conn.query(sql, [data,id], (err, results) => {
    if(err){
      res.json({
        data: err
      })
    }
    else{
      res.json({
        data: results
      })
    }
  });
});

/* * 
 * Delete user
 * http://127.0.0.1:8080/users/delete
 * { "id" : 1 }
 * */
router.delete('/delete', function(req, res, next) {
  let id = parseInt(req.body.id);
  let sql = "DELETE FROM user WHERE id = ?";  
  let query = conn.query(sql, [id], (err, results) => {
    if(err){
      res.json({
        data: err
      })
    }
    else{
      res.json({
        data: results
      })
    }
  });
});

module.exports = router;
