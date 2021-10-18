const db = require('../database/database');
const mysql = require('mysql2');

exports.createLikePlace = async (user_pk, place_pk) => {
    const query = `INSERT IGNORE INTO like_place (user_pk, place_pk) 
                   VALUES (${user_pk}, ${place_pk})`;

    const result = await db.query(query);

    return result ? true : false;
}

exports.createLikeCollection = async (user_pk, collection_pk) => {
    const query = `INSERT IGNORE INTO like_collection (user_pk, collection_pk) 
                   VALUES (${user_pk}, ${collection_pk})`;

    const result = await db.query(query);

    return result ? true : false;
}

exports.readLikePlace = async (user_pk, sort) => {
    // TODO 나중에 별점 추가

    let query = `SELECT p.place_pk, place_name, place_addr, place_img, place_type, 
                        IFNULL(review_score, -1) AS review_score, IFNULL(like_cnt, 0) AS like_cnt,
                        pri_review_img AS review_img
                 FROM places p
                 INNER JOIN like_place lp
                 ON lp.user_pk = ${user_pk}
                 AND lp.place_pk = p.place_pk
                 LEFT OUTER JOIN (
                     SELECT place_pk, AVG(review_score) AS review_score
                     FROM place_reviews
                     GROUP BY place_pk
                 ) pr
                 ON pr.place_pk = p.place_pk
                 LEFT OUTER JOIN (
                     SELECT place_pk, COUNT(*) AS like_cnt 
                     FROM like_place GROUP BY place_pk
                 ) llp
                 ON llp.place_pk = p.place_pk
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
                 `

    switch (sort) {
        case 'RESENT' :
            query += ' ORDER BY lp.like_pk DESC';
            break;
        case 'SCORE' :
            query += ' ORDER BY review_score DESC, lp.like_pk DESC'
            break;
        case 'LIKE':
            query += ' ORDER BY like_cnt DESC, lp.like_pk DESC';
            break;
        default:
            query += ' ORDER BY lp.like_pk DESC';
    }

    const result = await db.query(query);
    return result;
}

exports.readLikeCollection = async (user_pk, sort) => {

    let query = `SELECT c.collection_pk, collection_name, collection_type, collection_thumbnail, collection_private, user_nickname AS created_user_name, IFNULL(place_cnt, 0) AS place_cnt, IFNULL(like_cnt, 0) AS like_cnt
                 FROM collections c
                 INNER JOIN users u
                 ON u.user_pk = c.user_pk
                 INNER JOIN like_collection lcn
                 ON lcn.user_pk = ${user_pk}
                 AND lcn.collection_pk = c.collection_pk
                 LEFT OUTER JOIN (SELECT collection_pk, COUNT(*) AS place_cnt FROM collection_place_map GROUP BY collection_pk) cpm
                 ON cpm.collection_pk = c.collection_pk
                 LEFT OUTER JOIN (SELECT collection_pk, COUNT(*) AS like_cnt FROM like_collection GROUP BY collection_pk) lc 
                 ON lc.collection_pk = c.collection_pk
                 `

    switch (sort) {
        case 'RESENT' :
            query += ' ORDER BY lcn.like_pk DESC';
            break;
        case 'LIKE':
            query += ' ORDER BY like_cnt DESC, lcn.like_pk DESC';
            break;
        default:
            query += ' ORDER BY lcn.like_pk DESC';
    }

    const result1 = await db.query(query);
    // 키워드
    const result = await Promise.all(result1.map(async collection => {
        const query2 = `SELECT keyword_title FROM keywords k
                        LEFT OUTER JOIN keywords_collections_map kcm
                        ON kcm.keyword_pk = k.keyword_pk
                        WHERE kcm.collection_pk = ${collection.collection_pk}`;
        const result2 = await db.query(query2);

        const keywords = result2.map(keyword => keyword.keyword_title);

        return {
            ...collection,
            keywords
        };
    }));

    return result;
}

exports.deleteLikePlace = async (user_pk, place_pk) => {
    const query = `DELETE FROM like_place 
                   WHERE user_pk=${user_pk} 
                   AND place_pk=${place_pk}`;

    const result = await db.query(query);

    return result ? true : false;
}

exports.deleteLikeCollection = async (user_pk, collection_pk) => {
    const query = `DELETE FROM like_collection 
                   WHERE user_pk=${user_pk} 
                   AND collection_pk=${collection_pk}`;

    const result = await db.query(query);

    return result ? true : false;
}