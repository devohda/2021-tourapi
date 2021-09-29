const db = require('../database/database');
const mysql = require('mysql2');

exports.createReview = async (reviewData) => {
    const query = `INSERT INTO place_reviews SET ?`;
    const result = await db.query(query, reviewData);
    console.log(result);
    return result ? true : false;
}