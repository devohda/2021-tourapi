const db = require('../database/database');
const mysql = require('mysql2');

// 자유 보관함 생성
exports.createCollectionFree = async (collectionData, userId, keywords) => {

    const conn = await db.pool.getConnection();
    let result = false;

    try {
        // 보관함 생성
        const query1 = `INSERT INTO collections (collection_name, collection_type, collection_description, user_pk, collection_private)
                        VALUES (${mysql.escape(collectionData.name)}, 0, ${mysql.escape(collectionData.description)}, ${userId}, ${collectionData.private})`;

        const [result1] = await conn.query(query1);
        const collection_pk = result1.insertId;

        // 보관함 수정 권한
        const query2 = `INSERT INTO collection_user_map (collection_pk, user_pk) VALUES (${mysql.escape(collection_pk)}, ${userId})`;
        const result2 = await conn.query(query2);

        // 보관함-키워드 매핑
        const insertKeywordsSet = keywords.map(keyword => [collection_pk, keyword])
        console.log(insertKeywordsSet)
        const query3 = `INSERT INTO keywords_collections_map (collection_pk, keyword_pk) VALUES ?`
        const result3 = await conn.query(query3, [insertKeywordsSet]);

        result = true;
    } catch (err) {
        console.error(err);
    } finally {
        conn.release();
        return result
    }
}
