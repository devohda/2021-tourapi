const db = require('../database/database')
const mysql = require('mysql2')

exports.addUser = async (userData) => {
    const query = `INSERT INTO users SET ?`;
    const result = await db.query(query, userData);
    return result;
}

exports.findUser = async (email) => {
    const query = `SELECT COUNT(user_email) 
                   AS count 
                   FROM users 
                   WHERE user_email=${mysql.escape(email)};`
    const result = await db.query(query);
    return result;
}

exports.getUser = async (email) => {
    const query = `SELECT *
                   FROM users
                   WHERE user_email=${mysql.escape(email)}`
    const result = await  db.query(query);
    return result;
}