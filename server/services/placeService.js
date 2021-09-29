const db = require('../database/database');
const mysql = require('mysql2');

// 장소 배열 조회
exports.readPlaceList = async (user_pk, keyword) => {
    // TODO 장소 이름, type, 주소, 사진, 별점, 좋아요
    //  검색 페이지

    const query = `SELECT p.place_pk, place_name, place_addr, place_img, place_type, CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag 
                   FROM places p
                   LEFT OUTER JOIN like_place lp
                   ON lp.place_pk = p.place_pk
                   AND lp.user_pk = ${user_pk}
                   WHERE place_name LIKE ${mysql.escape(`%${keyword}%`)}`;

    const result1 = await db.query(query);

    // 별점 나중에 수정
    const result = result1.map(place => {
        return {...place, star: 3}; 
    });

    return result;
};

exports.readPlace = async (place_pk) => {
    const query = `SELECT p.place_pk, place_name, place_addr, place_type, place_img, CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag 
                   FROM places p
                   LEFT OUTER JOIN like_place lp
                   ON lp.place_pk = p.place_pk
                   WHERE p.place_pk=${place_pk}`;

    const result = await db.query(query);
    return result;
};