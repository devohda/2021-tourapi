const db = require('../database/database');
const mysql = require('mysql2');


const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async (userData) => {
    const query = 'INSERT INTO users SET ?';
    const result = await db.query(query, userData);
    return result;
};

exports.readUserCntByEmail = async (email) => {
    const query = `SELECT COUNT(user_email) 
                   AS count 
                   FROM users 
                   WHERE user_email=${mysql.escape(email)};`;
    const result = await db.query(query);
    return result;
};

exports.readUserCntByNickname = async (nickname) => {
    const query = `SELECT COUNT(user_nickname) 
                   AS count 
                   FROM users 
                   WHERE user_nickname=${mysql.escape(nickname)};`;
    const result = await db.query(query);
    return result;
};

exports.readUserByEmail = async (email) => {
    const query = `SELECT *
                   FROM users
                   WHERE user_email=${mysql.escape(email)}`;
    const result = await db.query(query);
    return result;
};

exports.createToken = async function (user) {
    // refresh token 의 유효시간 = 200days
    const refreshToken = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: 17280000000, issuer: 'here'});

    // access token 의 유효시간 = 30 minutes
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: 1800000, issuer: 'here'});

    // db 에 토큰 저장
    const query = `INSERT INTO user_token (user_pk, access_token, refresh_token) VALUES (${user.user_pk}, ${mysql.escape(accessToken)}, ${mysql.escape(refreshToken)})`;
    await db.query(query);

    return {accessToken, refreshToken};
};

exports.readUserTokenByUserPk = async (user_pk) => {
    const query = `SELECT access_token, refresh_token 
                   FROM user_token 
                   WHERE user_pk = ${user_pk}`;

    const tokens = await db.query(query);
    return tokens;
};