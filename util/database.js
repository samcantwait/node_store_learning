const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_store',
    password: 'H5lloM0t0!'
});

module.exports = pool.promise();