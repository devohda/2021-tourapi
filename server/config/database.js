const mysql = require('mysql');

const conn = {
    host: '34.146.76.44',
    port: '3306',
    user: 'tourapi',
    password: 'tourapi2021',
    database: 'tourapi_db',
    multipleStatements: true
}

module.exports = conn;