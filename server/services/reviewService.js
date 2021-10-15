const db = require('../database/database');
const mysql = require('mysql2');

exports.createReview = async (reviewData, review_facility, imgArr) => {
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

        if (imgArr) {
            for (const review_img of imgArr) {
                const query3 = `INSERT INTO place_review_img (place_pk, user_pk, review_img)
                                VALUES (${reviewData.place_pk}, ${reviewData.user_pk}, ${review_img})`
                const result3 = await db.query(query3);
            }
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
}