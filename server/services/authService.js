const db = require('../database/database')
const mysql = require('mysql2')

exports.createUser = async (userData) => {
    const query = `INSERT INTO users SET ?`;
    const result = await db.query(query, userData);
    return result;
}

exports.readUserCntByEmail = async (email) => {
    const query = `SELECT COUNT(user_email) 
                   AS count 
                   FROM users 
                   WHERE user_email=${mysql.escape(email)};`
    const result = await db.query(query);
    return result;
}

exports.readUserCntByNickname = async (nickname) => {
    const query = `SELECT COUNT(user_nickname) 
                   AS count 
                   FROM users 
                   WHERE user_nickname=${mysql.escape(nickname)};`
    const result = await  db.query(query);
    return result;
}

exports.readUserByEmail = async (email) => {
    const query = `SELECT *
                   FROM users
                   WHERE user_email=${mysql.escape(email)}`
    const result = await  db.query(query);
    return result;
}
