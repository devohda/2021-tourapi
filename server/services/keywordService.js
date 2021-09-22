const db = require('../database/database');
const mysql = require('mysql2');

exports.readKeywordList = async () => {
    const query = 'SELECT * FROM keywords'; 
    const result = await db.query(query);
    return result;
};