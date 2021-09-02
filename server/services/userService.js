const db = require('../database/database');
const mysql = require('mysql2');

exports.selectUserList = async () => {
    const query = `SELECT place_pk, place_name, place_addr, place_img
                   FROM place
                   WHERE place_name LIKE ${mysql.escape(`%${keyword}%`)}`;

    const result1 = await db.query(query);
    const result = result1.map(place => {
        return {...place, star: 3}
    })
    return result;
}