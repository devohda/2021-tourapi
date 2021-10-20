const db = require('../database/database');
const mysql = require('mysql2');

exports.readMostVisitant = async () => {
    const query = `SELECT v1.*, v2.sigungu_code 
                   FROM (
                       SELECT v.sigungu_name, SUM(visitant_cnt) AS visitant_cnt 
                       FROM visitant v
                       GROUP BY (sigungu_name)
                   ) v1
                   LEFT OUTER JOIN(
                       SELECT DISTINCT sigungu_code, sigungu_name AS name FROM visitant v
                   ) v2
                   ON v2.name = v1.sigungu_name
                   ORDER BY visitant_cnt DESC
                   LIMIT 5`
    const result = await db.query(query);
    return result;
}