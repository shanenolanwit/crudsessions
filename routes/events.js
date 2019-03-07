var express = require('express');
var mysql = require('mysql');
var db = require('../database/sqlConnector.js');
var conn = db();
var router = express.Router();



/* *
 * Create events 
 * http://127.0.0.1:8080/events/create
 * https://stackoverflow.com/questions/12504208/what-mysql-data-type-should-be-used-for-latitude-longitude-with-8-decimal-places
 * { 
 *  "lat": 10.0001,	"lng": 10.777777, 
 *  "datetime" : "1990-01-01 00:05:00", "host": 1,
 *  "description" : "test" 
 * }
 * */
router.post('/create', function(req, res, next) {
  let lat = req.body.lat;
  let lng = req.body.lng;
  let datetime = req.body.datetime;
  let host = parseInt(req.body.host)
  let description = req.body.description;
  let data = { lat: lat, lng: lng, datetime: datetime, host: host, description: description };
  let sql = "INSERT INTO event SET ?";  
  console.log(sql);
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
 * Read events 
 * http://127.0.0.1:8080/events/read
 * http://127.0.0.1:8080/events/read?limit=1&&offset=1
 * */
router.get('/read', function(req, res, next) {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  let orderby = req.query.orderby || 'id';
  let order = req.query.order || 'asc'
  let ordering = order === "asc" ? "asc" : "desc";
  let params = [orderby,parseInt(limit),parseInt(offset)];
  let sql = mysql.format(`SELECT * FROM event ORDER BY ?? ${ordering} LIMIT ? OFFSET ?`, params);
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
 * Read single event
 * http://127.0.0.1:8080/events/read/1
 * */
router.get('/read/:id', function(req, res, next) { 
  let sql = mysql.format(`SELECT * FROM event WHERE id = ?`, req.params.id);
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
 * Update event
 * http://127.0.0.1:8080/events/update
 * { 
 *  "lat": 10.00001,	"lng": 10.777777, 
 *  "datetime" : "1990-01-01 00:05:00", "host": 11,
 *  "description" : "test", "id" : 1 
 * }
 * */
router.put('/update', function(req, res, next) {
  let id = parseInt(req.body.id);
  let lat = req.body.lat;
  let lng = req.body.lng;
  let datetime = req.body.datetime;
  let host = parseInt(req.body.host)
  let description = req.body.description;
  let data = { lat: lat, lng: lng, datetime: datetime, host: host, description: description };
  let sql = "UPDATE event SET ? WHERE id = ?";  
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
 * Delete event
 * http://127.0.0.1:8080/events/delete
 * { "id" : 1 }
 * */
router.delete('/delete', function(req, res, next) {
  let id = parseInt(req.body.id);
  let sql = "DELETE FROM event WHERE id = ?";  
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

/* *
 * Attend event
 * http://127.0.0.1:8080/events/attend
 *  { "user_id" : 7, "event_id" : 11 }
 * */
router.post('/attend', function(req, res, next) {
  let user = parseInt(req.body.user_id)
  let event = parseInt(req.body.event_id)
  let data = { user_id: user, event_id: event };
  let sql = "INSERT INTO event_user SET ?";  
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

module.exports = router;
