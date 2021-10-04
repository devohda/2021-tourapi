const db = require('../database/database');
const mysql = require('mysql2');

exports.createReview = async (reviewData, review_facility) => {
    let result;

    const query1 = `INSERT INTO place_reviews SET ?`;
    const result1 = await db.query(query1, reviewData);

    for (const facility_pk of review_facility) {
        const query2 = `INSERT INTO place_facility_map (place_pk, user_pk, facility_pk)
                        VALUES (${reviewData.place_pk}, ${reviewData.user_pk}, ${facility_pk})
                        `
        const result2 = await db.query(query2)
        console.log(result2);
    }

    return result ? true : false;
}