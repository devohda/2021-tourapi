const db = require('../database/database');
const mysql = require('mysql2');

exports.createCollectionFree = async (collectionData, userId, keywords) => {

    const conn = await db.pool.getConnection();
    try {
        const query1 = `INSERT INTO collections (collection_name, collection_type, userId)
                    VALUES (${mysql.escape(collectionData.name)}, 0, userId)`;
    } catch (err) {

    } finally {
        conn.release();
    }
}
