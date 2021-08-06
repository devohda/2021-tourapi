const mysql = require('mysql');
const db = require('../config/database');
const testQuery = require('../models/collections');
const express = require('express');

const router = express.Router();
var connection = mysql.createConnection(db);
connection.connect();


//자유보관함
router.get('/collections_free', function(req, res){
  connection.query(testQuery, function (err, rows) {
      if(err){
          throw err;
      }
      console.log(rows);
      res.json(rows);
    });
});

router.post('/collections_free_post', function(req, res) {
    console.log(req.body);
    const body = req.body;
    connection.query('insert into collections (collection_name) values (?);', [body.collection_name], function(err,rows,fields){
        if(err){
            console.log("실패");
            // console.log(err);
        }else{
            console.log("성공");
            // console.log(rows);
        };
    });
})

module.exports = router;