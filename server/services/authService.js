const db = require('../database/database');
const mysql = require('mysql2');


const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async (userData) => {
    const conn = await db.pool.getConnection();
    let result = false;

    try {
        const query1 = `INSERT INTO users (user_email, user_nickname, user_password, salt)
                        VALUES (${mysql.escape(userData.email)}, ${mysql.escape(userData.nickname)}, ${mysql.escape(userData.password)}, ${mysql.escape(userData.salt)})`;
        const [result1] = await conn.query(query1);
        const user_pk = result1.insertId;

        for (const keyword of userData.keywords) {
            const query2= `INSERT INTO keywords_users (user_pk, keyword_pk)
                           VALUES (${user_pk}, ${keyword});`
            const [result2] = await conn.query(query2);
        }

        result = true;
        await conn.commit()
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
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

    const conn = await db.pool.getConnection();

    // access token 의 유효시간 = 1000일
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: 86400000, issuer: 'here'});

    try {
        await conn.beginTransaction();

        // 기존에 로그인 되어 있던 정보 삭제
        const query1 = `DELETE FROM user_token
                        WHERE user_pk = ${user.user_pk}`;
        await conn.query(query1);

        // db 에 토큰 저장
        const query2 = `INSERT INTO user_token (user_pk, access_token) VALUES (${user.user_pk}, ${mysql.escape(accessToken)})`;
        await conn.query(query2);

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return accessToken;
    }
};

exports.readUserTokenByUserPk = async (user_pk) => {
    const query = `SELECT access_token 
                   FROM user_token 
                   WHERE user_pk = ${user_pk}`;

    const tokens = await db.query(query);
    return tokens;
};

exports.deleteToken = async (user_pk) => {
    const query = `DELETE FROM user_token WHERE user_pk = ${user_pk}`;
    const result = await db.query(query);
    return result;
};

exports.deleteUser = async (user_pk) => {
    const conn = await db.pool.getConnection();
    let result = false;

    try {
        await conn.beginTransaction();

        const query1 = `DELETE FROM users
                        WHERE user_pk = ${user_pk}`;
        const query2 = `DELETE FROM user_token
                        WHERE user_pk = ${user_pk}`;
        const [result1] = await conn.query(query1);
        const [result2] = await conn.query(query2);

        result = true;
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
};