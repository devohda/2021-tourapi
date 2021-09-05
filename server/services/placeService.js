const db = require('../database/database');
const mysql = require('mysql2');

// 장소 배열 조회
exports.readPlaceList = async (keyword) => {
    const query = `SELECT place_pk, place_name, place_addr, place_img, place_type
                   FROM places
                   WHERE place_name LIKE ${mysql.escape(`%${keyword}%`)}`;

    const result1 = await db.query(query);

    const result = result1.map(place => {
        return {...place, star: 3}
    })

    return result;
}

exports.readPlace = async (place_pk) => {
    const query = `SELECT place_pk, place_name, place_addr, place_type 
                   FROM places 
                   WHERE place_pk=${place_pk}`

    const result = await db.query(query);
    return result;
}