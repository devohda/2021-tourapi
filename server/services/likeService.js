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