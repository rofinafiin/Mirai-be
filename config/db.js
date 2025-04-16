const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.HOSTDB,
    port: process.env.PORTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,     
    database: process.env.DATABASE  
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;

// console.log('db:', db);