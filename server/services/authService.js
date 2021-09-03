const db = require('../database/database')
const mysql = require('mysql2')

exports.createUser = async (userData) => {
    const query = `INSERT INTO users SET ?`;
    const result = await db.query(query, userData);
    return result;
}

exports.readUserCnt = async (email) => {
    const query = `SELECT COUNT(user_email) 
                   AS count 
                   FROM users 
                   WHERE user_email=${mysql.escape(email)};`
    const result = await db.query(query);
    return result;
}

exports.readUser = async (email) => {
    const query = `SELECT *
                   FROM users
                   WHERE user_email=${mysql.escape(email)}`
    const result = await  db.query(query);
    return result;
}