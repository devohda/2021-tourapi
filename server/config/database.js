const dbConfig = {
    host: '34.146.76.44',
    port: '3306',
    user: 'tourapi',
    password: 'tourapi2021',
    database: 'tourapi_db',
    multipleStatements: true,
    connectionLimit : 100,
    waitForConnections : true
}

module.exports = dbConfig;