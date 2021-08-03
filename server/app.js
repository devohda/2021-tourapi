const http = require('http');
const router = require('router');
const mysql = require('mysql');

const express = require('express');
const db = require('./config/database');

const hostname = '127.0.0.1';
const port = 3000;

var connection = mysql.createConnection(db);
connection.connect(); //DB 접속
connection.end();

const app = express();

const Router = require('./routes/index');
app.use('/', Router);
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});