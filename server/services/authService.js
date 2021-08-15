const db = require('../database/database')

exports.addUser = async (userData) => {
    const query = `INSERT INTO users SET ?`;
    const result = await db.query(query, userData);
    return result;
}