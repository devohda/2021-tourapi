const db = require('../database/database');
const mysql = require('mysql2');

exports.selectUserList = async (keyword) => {

    const conn = await db.pool.getConnection();
    let result;

    try {
        // 유저 정보
        const query1 = `SELECT user_pk, user_nickname,user_img 
                        FROM users u
                        WHERE user_nickname LIKE ${mysql.escape(`%${keyword}%`)}`;

        const [result1] = await conn.query(query1);

        result = await Promise.all(result1.map(async user => {
            // 각 유저 별 키워드
            const query2 = `SELECT keyword_title FROM keywords k
                            LEFT OUTER JOIN keywords_users ku 
                            ON ku.keyword_pk = k.keyword_pk 
                            WHERE ku.user_pk = ${user.user_pk}`;
            const [result2] = await conn.query(query2);
            const keywords = result2.map(keyword => keyword.keyword_title)

            // 각 유저 별 만든 보관함 개수
            const query3 = `SELECT COUNT(*) AS collection_cnt 
                            FROM collections 
                            WHERE user_pk = ${user.user_pk}`;
            const [[result3]] = await conn.query(query3);
            const madeCollectionCnt = result3.collection_cnt;

            return {
                ...user,
                keywords,
                madeCollectionCnt
            }
        }))

    }catch (err){
        console.error(err);
    }finally {
        conn.release();
        return result;
    }
}