const db = require('../database/database');
const mysql = require('mysql2');

exports.createReview = async (reviewData, review_facility) => {
    const conn = await db.pool.getConnection();
    let result = false;

    try {
        await conn.beginTransaction();

        const query1 = `INSERT INTO place_reviews SET ?`;
        const [result1] = await conn.query(query1, reviewData);

        for (const facility_pk of review_facility) {
            const query2 = `INSERT INTO place_facility_map (place_pk, user_pk, facility_pk)
                            VALUES (${reviewData.place_pk}, ${reviewData.user_pk}, ${facility_pk})`
            const [result2] = await conn.query(query2)
        }

        result = result1.insertId;
        await conn.commit()
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
}

exports.createReviewImg = async (place_pk, user_pk, review_pk, review_img) => {
    const query3 = `INSERT INTO place_review_img (place_pk, user_pk, review_pk, pri_review_img)
                    VALUES (${place_pk}, ${user_pk}, ${review_pk}, ${mysql.escape(review_img)})`
    const result = await db.query(query3);
    return result;
}