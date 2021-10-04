const db = require('../database/database');
const mysql = require('mysql2');

// 장소 배열 조회
exports.readPlaceList = async (user_pk, keyword, sort, type, term) => {
    // TODO 장소 이름, type, 주소, 사진, 별점, 좋아요
    //  검색 페이지

    let day = 100000;
    if(term){
        switch (term){
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

    let query = `SELECT p.place_pk, place_name, place_addr, place_img, place_type, CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag, 
                 IFNULL(like_cnt, 0) AS like_cnt, IFNULL(view_cnt, 0) AS view_cnt
                 FROM places p
                 LEFT OUTER JOIN like_place lp
                 ON lp.place_pk = p.place_pk
                 AND lp.user_pk = ${user_pk}
                 LEFT OUTER JOIN (SELECT place_pk, COUNT(*) AS like_cnt FROM like_place GROUP BY place_pk) llp
                 ON llp.place_pk = p.place_pk
                 LEFT OUTER JOIN (
                     SELECT place_pk, COUNT(*) AS view_cnt
                     FROM view_place
                     WHERE (view_time > DATE_SUB(now(), INTERVAL ${day} DAY))
                     GROUP BY place_pk
                 ) vp
                 ON vp.place_pk = p.place_pk
                 `

    if(keyword){
        query += `WHERE place_name LIKE ${mysql.escape(`%${keyword}%`)}`;
    }

    switch (sort){
        case 'LIKE':
            query += ' ORDER BY like_cnt DESC, p.place_pk ASC';
            break;
        case 'POPULAR':
            query += ' ORDER BY view_cnt DESC, p.place_pk ASC';
            break
        default:
            query += ' ORDER BY p.place_pk ASC';
    }

    if(type === 'MAIN'){
        query += ' LIMIT 3';
    }

    console.log(query);
    const result1 = await db.query(query);


    // 별점 나중에 수정
    const result = result1.map(place => {
        return {...place, star: 3}; 
    });

    return result;
};

// 장소 조회
exports.readPlace = async (place_pk) => {
    const query1 = `SELECT p.place_pk, place_name, place_addr, place_type, place_img, CASE WHEN like_pk IS NULL THEN 0 ELSE 1 END AS like_flag 
                    FROM places p
                    LEFT OUTER JOIN like_place lp
                    ON lp.place_pk = p.place_pk
                    WHERE p.place_pk=${place_pk}`;

    // 과반수 이상이 혼잡하다고 하면 혼잡도 O
    const query2 = `SELECT IFNULL(AVG(review_score),0) AS review_score, 
                           IFNULL(AVG(review_cleanliness),0) AS review_cleanliness, 
                           IFNULL(AVG(review_accessibility),0) AS review_accessibility, 
                           IFNULL(AVG(review_market),0) AS review_market,
                           CASE WHEN COUNT(review_congestion_morning) >= 2 THEN 1 ELSE 0 END AS review_congestion_morning,
                           CASE WHEN COUNT(review_congestion_afternoon) >= 2 THEN 1 ELSE 0 END AS review_congestion_afternoon,
                           CASE WHEN COUNT(review_congestion_evening) >= 2 THEN 1 ELSE 0 END AS review_congestion_evening,
                           CASE WHEN COUNT(review_congestion_night) >= 2 THEN 1 ELSE 0 END AS review_congestion_night,
                           COUNT(*) AS review_total_cnt
                    FROM place_reviews
                    WHERE place_pk =${place_pk}`

    // 2명 이상 해당할 때 보이기
    const query3 = `SELECT f.facility_pk, facility_name
                    FROM facility f
                    INNER JOIN (
                        SELECT facility_pk, COUNT(pfm_pk) AS cnt 
                        FROM place_facility_map
                        WHERE place_pk = ${place_pk} 
                        GROUP BY facility_pk 
                    ) fp
                    ON fp.facility_pk = f.facility_pk
                    WHERE cnt >= 2`

    const result1 = await db.query(query1);
    const result2 = await db.query(query2);
    const result3 = await db.query(query3);
    const facility = result3.map(facility => facility.facility_name);

    const result = {
        placeData : result1[0],
        review : {
            ...result2[0],
            facility
        }
    }
    return result;
};