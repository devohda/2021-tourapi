const db = require('../database/database');
const mysql = require('mysql2');

// READ
// 유저 정보 조회
exports.readUser = async (user_pk) => {
    const query1 = `SELECT user_nickname, user_img, user_email FROM users 
                    WHERE user_pk = ${user_pk}`

    const query2 = `SELECT keyword_title FROM keywords k
                    LEFT OUTER JOIN keywords_users ku
                    ON ku.keyword_pk = k.keyword_pk
                    WHERE ku.user_pk = ${user_pk}`;

    const result1 = await db.query(query1);
    const result2 = await db.query(query2);
    const keywords = result2.map(keyword => keyword.keyword_title);

    return {
        ...result1[0],
        keywords
    };
}

// 유저 리스트 조회
exports.readUserList = async (keyword, sort, type) => {

    let result;

    try {
        // 유저 정보
        let query1 = `SELECT u.user_pk, user_nickname, user_img, IFNULL(cnt, 0) AS like_total_cnt, 
                      IFNULL(collection_cnt, 0) AS collection_cnt
                      FROM users u
                      LEFT OUTER JOIN (
                          SELECT user_pk, COUNT(*) AS cnt FROM like_collection 
                          GROUP BY user_pk
                      ) lc
                      ON lc.user_pk = u.user_pk
                      LEFT OUTER JOIN (
                          SELECT user_pk, COUNT(*) AS collection_cnt
                          FROM collections
                          GROUP BY user_pk
                      ) c
                      ON c.user_pk = u.user_pk
                      `

        if (keyword) {
            query1 += ` WHERE user_nickname LIKE ${mysql.escape(`%${keyword}%`)}`;
        }

        switch (sort){
            case 'COLLECTION' :
                query1 += ' ORDER BY collection_cnt DESC, u.user_pk ASC';
                break;
            case 'LIKE':
                query1 += ' ORDER BY like_total_cnt DESC, u.user_pk ASC';
                break;
            default:
                query1 += ' ORDER BY collection_cnt DESC, u.user_pk ASC';
        }

        if(type === 'MAIN'){
            query1 += ` LIMIT 10`;
        }

        const result1 = await db.query(query1);

        result = await Promise.all(result1.map(async user => {
            // 각 유저 별 키워드
            const query2 = `SELECT keyword_title FROM keywords k
                            LEFT OUTER JOIN keywords_users ku 
                            ON ku.keyword_pk = k.keyword_pk 
                            WHERE ku.user_pk = ${user.user_pk}`;
            const result2 = await db.query(query2);
            const keywords = result2.map(keyword => keyword.keyword_title);

            return {
                ...user,
                keywords
            };
        }));

    } catch (err) {
        console.error(err);
    } finally {
        return result;
    }
};

//UPDATE
exports.updateUserInfo = async (user_pk, userData) => {
    const conn = await db.pool.getConnection();
    let result = false;

    try {
        await conn.beginTransaction();

        const query1 = `UPDATE users
                        SET user_nickname = ${mysql.escape(userData.nickname)}, user_img = ${mysql.escape(userData.img)}
                        WHERE user_pk = ${user_pk}`;
        const [result1] = await conn.query(query1);

        const query2 = `DELETE FROM keywords_users
                        WHERE user_pk = ${user_pk}`;
        const [result2] = await conn.query(query2);

        for(const keyword_pk of userData.keywords){
            const query3 = `INSERT INTO keywords_users (user_pk, keyword_pk)
                            VALUES (${user_pk}, ${keyword_pk})`;
            await conn.query(query3);
        }

        result = true;
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
};