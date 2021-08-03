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

module.exports = router;