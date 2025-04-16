const db = require('../config/db');

const SelectRole = (callback) => {
    const sql = `SELECT * FROM role_mst LIMIT 5`;
    db.query(sql, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

const generateUserID = (callback) => {
    const sql = `SELECT UserID FROM user ORDER BY UserID DESC LIMIT 1`;

    db.query(sql, (err, results) => {
        if (err) return callback(err, null);

        let newId = 'U001'; // default jika belum ada data

        if (results.length > 0) {
            const lastId = results[0].UserID;
            const number = parseInt(lastId.slice(1)) + 1;
            newId = 'U' + number.toString().padStart(3, '0');
        }

        callback(null, newId);
    });
};

const registerUser = (data, callback) => {
    generateUserID((err, newUserID) => {
        if (err) return callback(err, null);

        const sql = `
            INSERT INTO user (UserID, username, password, email, phone_number, nama)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            newUserID,
            data.username,
            data.password,
            data.email,
            data.phone_number,
            data.nama
        ], callback);
    });
};

const findUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM user WHERE username = ?`;
    db.query(sql, [username], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, null); // user tidak ditemukan
        callback(null, results[0]);
    });
};


module.exports = {
    SelectRole,
    registerUser,
    findUserByUsername
};