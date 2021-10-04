const db = require('../database/database');
const mysql = require('mysql2');

exports.readFacilityList = async () => {
    const query = 'SELECT * FROM facility';
    const result = await db.query(query);
    return result;
};