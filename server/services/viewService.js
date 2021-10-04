const db = require('../database/database');
const mysql = require('mysql2');

exports.createViewPlace = async (user_pk, place_pk) => {
    const query = `INSERT INTO view_place (user_pk, place_pk) 
                   VALUES (${user_pk}, ${place_pk})`;

    const result = await db.query(query);

    return result ? true : false;
}

exports.createViewCollection = async (user_pk, collection_pk) => {
    const query = `INSERT INTO view_collection (user_pk, collection_pk) 
                   VALUES (${user_pk}, ${collection_pk})`;

    const result = await db.query(query);

    return result ? true : false;
}