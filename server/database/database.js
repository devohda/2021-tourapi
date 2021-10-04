const mysql = require('mysql2/promise')
const dbConfig = require('../config/database')

const pool = mysql.createPool(dbConfig)

const execute = async (query, params) => {
    try {
        // console.log(`[Execute] => ${query}`)
        const [rows] = await pool.execute(query, params);
        // console.log(`[SUCCESS] Result : ${rows}`)
        return rows
    } catch (err) {
        console.log(`[ERROR] Error while performing Query : ${query}`, err)
        return false
    }
}

const query = async (query, params) => {
    try {
        // console.log(`[Query] => ${query}`)
        const [rows] = await pool.query(query, params);
        // console.log(`[SUCCESS] Result : ${rows}`)
        return rows
    } catch (err) {
        console.log(`[ERROR] Error while performing Query : ${query}`, err)
        return false
    }
}

module.exports = {
    execute,
    query,
    pool
}

