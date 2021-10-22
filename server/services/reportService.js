const db = require('../database/database');
const mysql = require('mysql2');

exports.createReportComment = async (user_pk, cc_pk) => {
    const query = `INSERT INTO report_comment (user_pk, cc_pk)
                   VALUES (${user_pk}, ${cc_pk})`;
    const result = await db.query(query);
    return result;
};

exports.createReportCollection = async (user_pk, collection_pk) => {
    const query = `INSERT INTO report_collection (user_pk, collection_pk)
                   VALUES (${user_pk}, ${collection_pk})`;
    const result = await db.query(query);
    return result;
};