const http = require('http');
const router = require('router');
const mysql = require('mysql');
// const cors = require('cors');
// const bodyParser = require('body-parser');

const express = require('express');
const db = require('./config/database');

const hostname = '127.0.0.1';
const port = 3000;

var connection = mysql.createConnection(db);
// connection.connect(); //DB 접속

const app = express();

const Router = require('./routes/index');

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.use(cors());

app.use(express.json());
app.use('/', Router);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// connection.end();
