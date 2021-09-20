const db = require('../database/database');
const mysql = require('mysql2');

// 자유 보관함 생성
exports.createFreeCollection = async ({name, isPrivate}, user_pk, keywords) => {

    const conn = await db.pool.getConnection();
    let result = false;

    try {
        await conn.beginTransaction();

        // 보관함 생성
        const query1 = `INSERT INTO collections (collection_name, collection_type, user_pk, collection_private)
                        VALUES (${mysql.escape(name)}, 0, ${user_pk}, ${isPrivate})`;

        const [result1] = await conn.query(query1);
        const collection_pk = result1.insertId;

        // 보관함 수정 권한
        const query2 = `INSERT INTO collection_user_map (collection_pk, user_pk) 
                        VALUES (${collection_pk}, ${user_pk})`;
        const result2 = await conn.query(query2);

        // 보관함-키워드 매핑
        const insertKeywordsSet = keywords.map(keyword => [collection_pk, keyword]);

        const query3 = 'INSERT INTO keywords_collections_map (collection_pk, keyword_pk) VALUES ?';
        const result3 = await conn.query(query3, [insertKeywordsSet]);

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

// 일정 보관함 생성
exports.createPlanCollection = async ({name, isPrivate, startDate, endDate}, user_pk, keywords) => {

    const conn = await db.pool.getConnection();
    let result = false;

    const betweenDay = (firstDate, secondDate) => {
        const startDateArr = firstDate.split('-');
        const endDateArr = secondDate.split('-');

        const startDateObj = new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2]);
        const endDateObj = new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2]);

        const betweenTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        return Math.floor(betweenTime / (1000 * 60 * 60 * 24));
    }

    try {
        await conn.beginTransaction();

        // 보관함 생성
        const query1 = `INSERT INTO collections (collection_name, collection_type, user_pk, collection_private, collection_start_date, collection_end_date)
                        VALUES (${mysql.escape(name)}, 1, ${user_pk}, ${isPrivate}, ${mysql.escape(startDate)}, ${mysql.escape(endDate)})`;

        const [result1] = await conn.query(query1);
        const collection_pk = result1.insertId;

        // 보관함 수정 권한 추가
        const query2 = `INSERT INTO collection_user_map (collection_pk, user_pk) VALUES (${collection_pk}, ${user_pk})`;
        const result2 = await conn.query(query2);

        // 보관함-키워드 매핑
        const insertKeywordsSet = keywords.map(keyword => [collection_pk, keyword]);
        console.log(insertKeywordsSet);
        const query3 = 'INSERT INTO keywords_collections_map (collection_pk, keyword_pk) VALUES ?';
        const result3 = await conn.query(query3, [insertKeywordsSet]);

        // 보관함-장소 매핑에 시간 구획 라인 추가
        for (let day = 0; day <= betweenDay(startDate, endDate); day++) {
            // pm 12
            const query4 = `INSERT IGNORE INTO collection_plan_place_map (collection_pk, place_pk, cppm_plan_day)
                            VALUES (${collection_pk}, -1, ${day})`
            // pm 6
            const query5 = `INSERT IGNORE INTO collection_plan_place_map (collection_pk, place_pk, cppm_plan_day)
                            VALUES (${collection_pk}, -2, ${day})`

            await conn.query(query4);
            await conn.query(query5);
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

// 보관함 리스트 조회(검색)
exports.readCollectionList = async (keyword) => {

    // TODO
    //  - 좋아요
    //  - 추가된 장소의 사진 가져오기

    const conn = await db.pool.getConnection();
    let result;
    try {
        await conn.beginTransaction();

        const query1 = `SELECT collection_pk, collection_name, collection_type, user_nickname AS created_user_name
                        FROM collections c
                        INNER JOIN users u
                        ON u.user_pk = c.user_pk 
                        WHERE collection_name LIKE ${mysql.escape(`%${keyword}%`)}`;

        const [result1] = await conn.query(query1);

        result = await Promise.all(result1.map(async collection => {
            const query2 = `SELECT keyword_title FROM keywords k
                            LEFT OUTER JOIN keywords_collections_map kcm
                            ON kcm.keyword_pk = k.keyword_pk
                            WHERE kcm.collection_pk = ${collection.collection_pk}`;
            const [result2] = await conn.query(query2);

            const keywords = result2.map(keyword => keyword.keyword_title);

            return {
                ...collection,
                keywords
            };
        }));

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
};

// 본인 보관함 리스트 조회
exports.readCollectionListForPlaceInsert = async (user_pk) => {

    // TODO
    //  - 권한 있는 유저 리스트(사진)
    //  - 사진 최대 4개

    // 보관함 정보
    // - 좋아요 수
    // - 포함된 장소 수
    // - 키워드

    const conn = await db.pool.getConnection();
    let result;

    try {
        await conn.beginTransaction();

        const query1 = `SELECT c.*, IFNULL(place_cnt, 0) AS place_cnt,
                        CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag
                        FROM collections c
                        LEFT OUTER JOIN (SELECT collection_pk, COUNT(*) AS place_cnt FROM collection_place_map GROUP BY collection_pk) cpm
                        ON cpm.collection_pk = c.collection_pk
                        LEFT OUTER JOIN like_collection lc 
                        ON lc.collection_pk = c.collection_pk
                        AND lc.user_pk = c.user_pk
                        WHERE c.user_pk = ${user_pk}`;

        const [result1] = await conn.query(query1);

        result = await Promise.all(result1.map(async collection => {
            const query2 = `SELECT keyword_title FROM keywords k
                            LEFT OUTER JOIN keywords_collections_map kcm
                            ON kcm.keyword_pk = k.keyword_pk
                            WHERE kcm.collection_pk = ${collection.collection_pk}`;

            const query3 = `SELECT place_img FROM places p 
                            INNER JOIN collection_place_map cpm
                            ON cpm.place_pk = p.place_pk 
                            AND cpm.collection_pk = ${collection.collection_pk}
                            Limit 4`;

            const [result2] = await conn.query(query2);
            const [result3] = await conn.query(query3);

            const keywords = result2.map(keyword => keyword.keyword_title);
            const thumbnail_images = result3.map(image => image.place_img);

            return {
                ...collection,
                keywords,
                thumbnail_images
            };
        }));

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
};

// 보관함에 장소 추가
exports.createPlaceToCollection = async (collection_pk, place_pk) => {

    const query = `INSERT IGNORE INTO collection_place_map (collection_pk, place_pk) 
                   VALUES (${collection_pk}, ${place_pk})`;

    const result = await db.query(query);

    return result;
};

// 보관함 상세 조회
exports.readCollection = async (user_pk, collection_pk) => {
    const conn = await db.pool.getConnection();
    let result;

    try {
        await conn.beginTransaction();

        // 보관함 정보 & 보관함 좋아요 상태
        const query1 = `SELECT c.*, CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag
                        FROM collections c
                        LEFT OUTER JOIN like_collection lc
                        ON lc.collection_pk = c.collection_pk
                        AND lc.user_pk = ${user_pk}
                        WHERE c.collection_pk = ${collection_pk}`;
        const [[result1]] = await conn.query(query1);

        // 보관함 키워드
        const query2 = `SELECT keyword_title FROM keywords k
                        LEFT OUTER JOIN keywords_collections_map kcm
                        ON kcm.keyword_pk = k.keyword_pk
                        WHERE kcm.collection_pk = ${collection_pk}`;
        const [result2] = await conn.query(query2);
        const keywords = result2.map(keyword => keyword.keyword_title);

        // 장소 정보 & 장소 좋아요 상태
        const query3 = `SELECT cpm.place_pk, place_name, place_addr, place_img, place_type, 
                               CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag 
                        FROM collection_place_map cpm
                        INNER JOIN places p
                        ON p.place_pk = cpm.place_pk
                        LEFT OUTER JOIN like_place lp
                        ON lp.place_pk = cpm.place_pk
                        AND lp.user_pk = ${user_pk}
                        WHERE collection_pk = ${collection_pk}`;

        const [result3] = await conn.query(query3);

        result = {
            ...result1,
            keywords,
            places: result3
        };

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error(err);
    } finally {
        conn.release();
        return result;
    }
};

// 보관함 삭제
exports.deleteCollection = async (collection_pk) => {
    const query = `DELETE FROM collections WHERE collection_pk = ${collection_pk}`;
    const result = db.query(query);
    return result;
};