const db = require('../database/database');
const mysql = require('mysql2');
const {files} = require("yarn/lib/cli");
const {map} = require("twilio/lib/base/serialize");

// 자유 보관함 생성
exports.createFreeCollection = async (user_pk, collectionData) => {

    const conn = await db.pool.getConnection();
    let result = false;

    try {
        await conn.beginTransaction();

        // 보관함 생성
        const query1 = `INSERT INTO collections (collection_name, collection_type, user_pk, collection_private, collection_thumbnail)
                        VALUES (${mysql.escape(collectionData.name)}, 0, ${user_pk}, ${collectionData.isPrivate}, ${mysql.escape(collectionData.img)})`;

        const [result1] = await conn.query(query1);
        const collection_pk = result1.insertId;


        // 보관함-키워드 매핑
        if (collectionData.keywords.length > 0) {
            const insertKeywordsSet = collectionData.keywords.map(keyword => [collection_pk, keyword]);

            const query3 = 'INSERT INTO keywords_collections_map (collection_pk, keyword_pk) VALUES ?';
            const result3 = await conn.query(query3, [insertKeywordsSet]);
        }

        result = {collection_pk};

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
exports.createPlanCollection = async (user_pk, collectionData) => {

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
        const query1 = `INSERT INTO collections (collection_name, collection_type, user_pk, collection_private, collection_start_date, collection_end_date, collection_thumbnail)
                        VALUES (${mysql.escape(collectionData.name)}, 1, ${user_pk}, ${collectionData.isPrivate}, ${mysql.escape(collectionData.startDate)}, ${mysql.escape(collectionData.endDate)}, ${mysql.escape(collectionData.img)})`;

        const [result1] = await conn.query(query1);
        const collection_pk = result1.insertId;

        // 보관함-키워드 매핑
        if (collectionData.keywords.length > 0) {
            const insertKeywordsSet = collectionData.keywords.map(keyword => [collection_pk, keyword]);
            const query3 = 'INSERT INTO keywords_collections_map (collection_pk, keyword_pk) VALUES ?';
            const result3 = await conn.query(query3, [insertKeywordsSet]);
        }

        // 보관함-장소 매핑에 시간 구획 라인 추가
        for (let day = 0; day <= betweenDay(collectionData.startDate, collectionData.endDate); day++) {
            // pm 12
            const query4 = `INSERT IGNORE INTO collection_place_map (collection_pk, place_pk, cpm_plan_day, cpm_order)
                            VALUES (${collection_pk}, -1, ${day}, ${day * 2})`
            // pm 6
            const query5 = `INSERT IGNORE INTO collection_place_map (collection_pk, place_pk, cpm_plan_day, cpm_order)
                            VALUES (${collection_pk}, -2, ${day}, ${day * 2 + 1})`

            await conn.query(query4);
            await conn.query(query5);
        }

        result = {collection_pk};

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
exports.createPlaceToCollection = async (collection_pk, place_pk, cpm_plan_day, cpm_order) => {

    // 자유 보관함의 경우 날짜 없으므로 -1 저장
    if (cpm_plan_day === undefined) cpm_plan_day = -1;

    const query = `INSERT INTO collection_place_map (collection_pk, place_pk, cpm_plan_day, cpm_order) 
                   VALUES (${collection_pk}, ${place_pk}, ${cpm_plan_day}, ${cpm_order})`;

    const result = await db.query(query);

    return result;
};

// 보관함에 댓글 추가
exports.createCollectionComment = async (collection_pk, user_pk, comment) => {
    const query = `INSERT INTO collection_comments (user_pk, collection_pk, collection_comment)
                   VALUES(${user_pk}, ${collection_pk}, ${mysql.escape(comment)})`
    const result = await db.query(query);
    return result;
}

// 보관함 공간에 대체 공간 추가
exports.createCollectionPlaceReplacement = async (cpm_map_pk, place_pk, cpr_order) => {
    const query = `INSERT IGNORE INTO collection_place_replacement (cpm_map_pk, place_pk, cpr_order)
                   VALUES (${cpm_map_pk}, ${place_pk}, ${cpr_order})`
    const result = await db.query(query);
    return result;
}

// 보관함 공간에 한줄평 생성
exports.createCollectionPlaceComment = async (cpm_map_pk, cpc_comment) => {
    const query = `INSERT IGNORE INTO collection_place_comment (cpm_map_pk, cpc_comment)
                   VALUES (${cpm_map_pk}, ${mysql.escape(cpc_comment)})`;
    const result = await db.query(query);
    return result;
}

// 보관함 리스트 조회
exports.readCollectionList = async (user_pk, type, sort, keyword, term) => {

    // TODO
    //  - 마이페이지 : 보관함 이름, type, 키워드, 좋아요 개수, 장소 개수, 프로필 사진, 공개유무, sorting + 내꺼만
    //  - 검색 : 만든 사람 닉네임, 키워드 검색 + 모든 사람
    //  - 장소에서 불러오는 보관함 리스트 : 위와 같음 + 내꺼만

    const conn = await db.pool.getConnection();
    let result;
    try {
        await conn.beginTransaction();

        let day = 100000;
        if (term) {
            switch (term) {
                case 'DAY':
                    day = 1;
                    break;
                case 'WEEK':
                    day = 7;
                    break;
                case 'MONTH':
                    day = 30;
                    break
            }
        }

        let query1 = `SELECT c.collection_pk, collection_name, collection_type, collection_thumbnail, collection_private, user_nickname AS created_user_name, 
                             IFNULL(place_cnt, 0) AS place_cnt, IFNULL(like_cnt, 0) AS like_cnt, IFNULL(view_cnt, 0) AS view_cnt
                      FROM collections c
                      INNER JOIN users u
                      ON u.user_pk = c.user_pk
                      LEFT OUTER JOIN (
                          SELECT collection_pk, COUNT(*) AS place_cnt 
                          FROM collection_place_map
                          WHERE place_pk > 0
                          GROUP BY collection_pk
                      ) cpm
                      ON cpm.collection_pk = c.collection_pk
                      LEFT OUTER JOIN (
                          SELECT collection_pk, COUNT(*) AS like_cnt 
                          FROM like_collection 
                          WHERE (like_time > DATE_SUB(now(), INTERVAL ${day} DAY))
                          GROUP BY collection_pk
                      ) lc
                      ON lc.collection_pk = c.collection_pk
                      LEFT OUTER JOIN (
                          SELECT collection_pk, COUNT(*) AS view_cnt
                          FROM view_collection
                          WHERE (view_time > DATE_SUB(now(), INTERVAL ${day} DAY))
                          GROUP BY collection_pk
                      ) vc
                      ON vc.collection_pk = c.collection_pk
                      WHERE
                      `

        if (type === 'MY') {
            query1 += ` c.user_pk = ${user_pk}`;
        } else {
            query1 += ` c.collection_private = 0`;
        }

        if (keyword) {
            query1 += ` AND collection_name LIKE ${mysql.escape(`%${keyword}%`)}`;
        }

        switch (sort) {
            case 'RESENT':
                query1 += ' ORDER BY c.collection_pk DESC, like_cnt DESC, view_cnt DESC';
                break;
            case 'OLD':
                query1 += ' ORDER BY c.collection_pk ASC, like_cnt DESC, view_cnt DESC';
                break;
            case 'LIKE':
                query1 += ' ORDER BY like_cnt DESC, view_cnt DESC, c.collection_pk DESC';
                break;
            case 'POPULAR':
                query1 += ' ORDER BY view_cnt DESC, like_cnt DESC, c.collection_pk DESC';
                break
            default:
                query1 += ' ORDER BY c.collection_pk DESC, like_cnt DESC, view_cnt DESC';
        }

        if (type === 'MAIN') {
            query1 += ' LIMIT 10';
        }

        const [result1] = await conn.query(query1);

        // 키워드
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

// 보관함 상세 조회
exports.readCollection = async (user_pk, collection_pk) => {
    // TODO 보관함 type(자유, 일정) 에 따라 쿼리 다르게 타야 함.
    // TODO 댓글, 한줄평 구현되면 추가해야 함.
    //  자유 보관함 : 제작자 여부, 키워드, 공개여부, 좋아요 여부, 보관함 이름, type, 공간 리스트( 이름, type, 사진, 사용자 별점, 전체 별점, 사용자의 좋아요 여부, 한줄평)
    //  일정 보관함 : 제작자 여부, 키워드, 공개여부, 좋아요 여부, 보관함 이름, type, 공간 리스트( 이름, type, 사진, 사용자 별점, 전체 별점, 사용자의 좋아요 여부, 한줄평)
    // 자유 보관함 : 공간 리스트( 사용자 별점, 전체 별점, 한줄평)
    // 만약, 공동 관리자 생기면 제작자 여부 대신 권한 여부 따져야 함.

    const conn = await db.pool.getConnection();
    let result;

    try {
        await conn.beginTransaction();

        // 보관함 정보 & 보관함 좋아요 상태
        const query1 = `SELECT c.*, CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag, user_nickname AS created_user_name,
                               CASE WHEN c.user_pk = ${user_pk} THEN 1 ELSE 0 END AS is_creator, IFNULL(like_cnt, 0) AS like_cnt
                        FROM collections c
                        INNER JOIN users u
                        ON u.user_pk = c.user_pk
                        LEFT OUTER JOIN (
                            SELECT collection_pk, COUNT(*) AS like_cnt FROM like_collection
                            WHERE collection_pk = ${collection_pk}
                            GROUP BY collection_pk
                        ) llc 
                        ON llc.collection_pk = c.collection_pk
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

        result = {
            ...result1,
            keywords
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

// 보관함 장소 리스트
exports.readCollectionPlaceList = async (user_pk, collection_pk) => {

    // 장소 정보 & 장소 좋아요 상태

    const query1 = `SELECT cpm.cpm_map_pk, cpm_plan_day, cpm.place_pk, place_name, place_addr, place_img, place_thumbnail, place_type, place_mapy AS place_latitude, place_mapx AS place_longitude, cpm_order, 
                           CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag, IFNULL(replacement_cnt, 0) AS replacement_cnt,
                           cpc_comment AS comment, IFNULL(review_score, -1) AS review_score, pri_review_img AS review_img
                    FROM collection_place_map cpm
                    LEFT OUTER JOIN places p
                    ON p.place_pk = cpm.place_pk
                    LEFT OUTER JOIN like_place lp
                    ON lp.place_pk = cpm.place_pk
                    AND lp.user_pk = ${user_pk}
                    LEFT OUTER JOIN (
                        SELECT cpm_map_pk, COUNT(*) AS replacement_cnt
                        FROM collection_place_replacement
                        GROUP BY cpm_map_pk
                    ) cpr
                    ON cpr.cpm_map_pk = cpm.cpm_map_pk
                    LEFT OUTER JOIN collection_place_comment cpc
                    ON cpc.cpm_map_pk = cpm.cpm_map_pk
                    LEFT OUTER JOIN (
                        SELECT place_pk, AVG(review_score) AS review_score
                        FROM place_reviews
                        GROUP BY place_pk
                    ) pr
                    ON pr.place_pk = p.place_pk
                    LEFT OUTER JOIN (
                        SELECT place_pk, pri_review_img
                        FROM (SELECT place_pk
                                   , pri_review_img
                                   , @rn := CASE WHEN @cd = place_pk THEN @rn + 1 ELSE 1 END rn
                                   , @cd := place_pk
                                FROM (SELECT * FROM place_review_img ORDER BY place_pk ASC, pri_pk DESC) a
                                   , (SELECT @cd := '', @rn := 0) b
                              ) a
                        WHERE rn <= 1
                    ) pri
                    ON pri.place_pk = p.place_pk
                    WHERE collection_pk = ${collection_pk}
                    ORDER BY cpm_plan_day ASC, cpm_order ASC`;

    // const query2 = `SELECT cpm.cpm_map_pk, cpm_plan_day, place_mapy AS place_latitude, place_mapx AS place_longitude
    //                 FROM collection_place_map cpm
    //                 LEFT OUTER JOIN places p
    //                 ON p.place_pk = cpm.place_pk
    //                 WHERE collection_pk = ${collection_pk}
    //                 AND p.place_pk > 0
    //                 ORDER BY cpm_plan_day ASC, cpm_order ASC`;

    const result1 = await db.query(query1);
    // const result2 = await db.query(query2);
    // const mapData = {}
    // for (const data of result2) {
    //     if (mapData[data.cpm_plan_day]) {
    //         mapData[data.cpm_plan_day].push({place_latitude: data.place_latitude, place_longitude: data.place_longitude})
    //     } else {
    //         mapData[data.cpm_plan_day] = [{place_latitude: data.place_latitude, place_longitude: data.place_longitude}]
    //     }
    // }

    const result = {
        placeList: result1,
    }

    return result;
};

// 보관함 댓글 리스트
exports.readCollectionCommentList = async (user_pk, collection_pk) => {
    const query = `SELECT cc_pk, collection_comment, cc_create_time, user_img, user_nickname,
                          CASE WHEN cc.user_pk = ${user_pk} THEN 1 ELSE 0 END AS is_creator
                   FROM collection_comments cc
                   INNER JOIN users u
                   ON u.user_pk = cc.user_pk
                   WHERE collection_pk = ${collection_pk}`
    const result = await db.query(query);
    return result;
};

// 보관함 대체 공간 리스트
exports.readCollectionPlaceReplacement = async (user_pk, cpm_map_pk) => {
    const query = `SELECT cpr_pk, cpr.place_pk, place_name, place_addr, place_img, place_thumbnail, place_type, cpr_order,
                          CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag, IFNULL(review_score, -1) AS review_score, pri_review_img AS review_img
                   FROM collection_place_replacement cpr
                   INNER JOIN places p
                   ON cpr.place_pk = p.place_pk
                   LEFT OUTER JOIN like_place lp
                   ON lp.place_pk = cpr.place_pk
                   AND lp.user_pk = ${user_pk}
                   LEFT OUTER JOIN (
                       SELECT place_pk, AVG(review_score) AS review_score
                       FROM place_reviews
                       GROUP BY place_pk
                   ) pr
                   ON pr.place_pk = cpr.place_pk
                   LEFT OUTER JOIN (
                       SELECT place_pk, pri_review_img
                       FROM (SELECT place_pk
                                  , pri_review_img
                                  , @rn := CASE WHEN @cd = place_pk THEN @rn + 1 ELSE 1 END rn
                                  , @cd := place_pk
                               FROM (SELECT * FROM place_review_img ORDER BY place_pk ASC, pri_pk DESC) a
                                  , (SELECT @cd := '', @rn := 0) b
                             ) a
                       WHERE rn <= 1
                   ) pri
                   ON pri.place_pk = p.place_pk
                   WHERE cpm_map_pk = ${cpm_map_pk}
                   ORDER BY cpr_order ASC
                   `
    const result = await db.query(query);
    return result;
};

// 보관함 정보 수정
exports.updateCollection = async (collection_pk, collectionData) => {
    console.log(collectionData);

    const conn = await db.pool.getConnection();
    let result = false;
    try {
        const query1 = `UPDATE collections 
                        SET collection_name = ${mysql.escape(collectionData.name)},
                            collection_private = ${collectionData.isPrivate},
                            collection_thumbnail = ${mysql.escape(collectionData.img)}
                        WHERE collection_pk = ${collection_pk}`;
        const [result1] = await conn.query(query1);

        const query2 = `DELETE FROM keywords_collections_map
                        WHERE collection_pk = ${collection_pk}`;
        const [result2] = await conn.query(query2);

        for (const keyword_pk of collectionData.keywords) {
            const query3 = `INSERT INTO keywords_collections_map (collection_pk, keyword_pk)
                            VALUES (${collection_pk}, ${keyword_pk})`;
            const [result3] = await conn.query(query3);
        }

        result = true;
        await conn.commit();
    } catch (err) {
        console.log(err);
        result = false;
        await conn.rollback();
    } finally {
        conn.release();
        return result;
    }
};

// 보관함 장소 리스트 수정
exports.updateCollectionPlaceList = async (user_pk, collection_pk, placeList, deletePlaceList) => {

    const conn = await db.pool.getConnection();
    let result = false;
    try {
        await conn.beginTransaction();

        for (const placeData of placeList) {
            const query1 = `UPDATE collection_place_map
                            SET cpm_plan_day = ${placeData.planDay}, cpm_order = ${placeData.order}
                            WHERE cpm_map_pk = ${placeData.cpm_map_pk}`;
            await conn.query(query1);
        }
        // 삭제할 장소가 있으면 삭제하기
        if (deletePlaceList) {
            for (const cpm_map_pk of deletePlaceList) {
                const query2 = `DELETE FROM collection_place_map 
                                WHERE cpm_map_pk = ${cpm_map_pk}`
                await conn.query(query2)
            }
        }

        result = true;
        await conn.commit();
    } catch (err) {
        result = false;
        await conn.rollback();
    } finally {
        conn.release();
        return result;
    }
};

// 보관함 공간의 대체 공간 리스트 수정
exports.updateCollectionPlaceReplacement = async (cpm_map_pk, replacementPlaceList) => {

    const conn = await db.pool.getConnection();
    let result = false;

    try {
        await conn.beginTransaction();

        const query1 = `DELETE FROM collection_place_replacement
                        WHERE cpm_map_pk = ${cpm_map_pk}`;
        await conn.query(query1);

        for (const replacePlace of replacementPlaceList) {
            const query2 = `INSERT INTO collection_place_replacement (cpm_map_pk, place_pk, cpr_order)
                            VALUES (${replacePlace.cpm_map_pk}, ${replacePlace.placeId}, ${replacePlace.order})`;
            await conn.query(query2);
        }

        result = true;
        await conn.commit();
    } catch (err) {
        result = false;
        await conn.rollback();
    } finally {
        conn.release();
        return result;
    }
};

// 보관함 공간 한줄평 수정
exports.updateCollectionPlaceComment = async (cpm_map_pk, comment) => {
    const query = `UPDATE collection_place_comment
                   SET cpc_comment = ${mysql.escape(comment)}
                   WHERE cpm_map_pk = ${cpm_map_pk}`
    const result = await db.query(query);
    return result;
}

// 보관함에 댓글 수정
exports.updateCollectionComment = async (cc_pk, comment) => {
    const query = `UPDATE collection_comments
                   SET collection_comment = ${mysql.escape(comment)}
                   WHERE cc_pk = ${cc_pk}`;
    const result = await db.query(query);
    return result;
}

// 보관함 삭제
exports.deleteCollection = async (collection_pk) => {
    const query = `DELETE FROM collections WHERE collection_pk = ${collection_pk}`;
    const result = db.query(query);
    return result;
};

// 보관함에 장소 삭제
exports.deletePlaceToCollection = async (collection_pk, cpm_map_pk) => {
    let query = `DELETE FROM collection_place_map 
                 WHERE cpm_map_pk = ${cpm_map_pk}`

    const result = db.query(query);
    return result;
}

// 보관함 대체 공간 1개 삭제
exports.deleteCollectionPlaceReplacement = async (cpm_map_pk, placeId) => {
    const query = `DELETE FROM collection_place_replacement
                   WHERE cpm_map_pk = ${cpm_map_pk}
                   AND place_pk = ${placeId}`;
    const result = await db.query(query);
    return result;
}

// 보관함 대체 공간 전체 삭제
exports.deleteCollectionPlaceReplacementAll = async (cpm_map_pk) => {
    const query = `DELETE FROM collection_place_replacement
                   WHERE cpm_map_pk = ${cpm_map_pk}`;
    const result = await db.query(query);
    return result;
}

// 보관함 공간 한줄평 삭제
exports.deleteCollectionPlaceComment = async (cpm_map_pk) => {
    const query = `DELETE FROM collection_place_comment
                   WHERE cpm_map_pk = ${cpm_map_pk}`;
    const result = await db.query(query);
    return result;
}

// 보관함에 댓글 삭제
exports.deleteCollectionComment = async (cc_pk) => {
    const query = `DELETE FROM collection_comments
                   WHERE cc_pk = ${cc_pk}`;
    const result = await db.query(query);
    return result;
};