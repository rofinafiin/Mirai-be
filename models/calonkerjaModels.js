const db = require('../config/db');
const generateId = require('../utils/generateId');

const insertBiodata = (data, callback) => {
    const biodataId = generateId('bio_');
    const sql = `
        INSERT INTO tbl_biodata (
            biodataid, nama, jenis_kelamin, nomor_paspor, phone_number,
            tanggal_lahir, tempat_lahir, nik_ktp, alamat, email, userid
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    getStep(data.userid, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
    
            if (existingData) {
                updateStep('biodata_id', biodataId, data.userid, (err, res) => {
                    if (err) {
                        console.error('Update Error:', err);
                    } else {
                        console.log('Update Success:', res);
                    }
                });
            } else {
                insertStep('biodata_id', biodataId, data.userid, (err, res) => {
                    if (err) {
                        console.error('Insert Error:', err);
                    } else {
                        console.log('Insert Success:', res);
                    }
                });
            }
        }
    });

    db.query(sql, [
        biodataId,
        data.nama,
        data.jenis_kelamin,
        data.nomor_paspor,
        data.phone_number,
        data.tanggal_lahir,
        data.tempat_lahir,
        data.nik_ktp,
        data.alamat,
        data.email,
        data.userid
    ], (err, result) => {
        if (err) return callback(err, null);
        callback(null, { biodataid: biodataId, ...data });
    });
};


const insertStep = (column, value, userId, callback) => {
    const tahapan_id = generateId('thp_');
    const sql = `INSERT INTO tbl_tahapan (tahapan_id, ??, user_id) VALUES (?, ?, ?)`;
    const inserts = [column, tahapan_id, value, userId];

    db.query(sql, inserts, (err, result) => {
        if (err) return callback(err, null);
        callback(null, { message: 'Insert berhasil', result });
    });
};

const insertDocument = (userId, files, callback) => {
    const documentId = generateId('doc_');

    const sql = `
        INSERT INTO tbl_documents (
            document_id, userid, pas_foto, scan_ktp, scan_ijazah,
            sertifikat_bahasa, sertifikat_keahlian, surat_keterangan_sehat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    getStep(userId, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
    
            if (existingData) {
                updateStep('document_id', documentId, userId, (err, res) => {
                    if (err) {
                        console.error('Update Error:', err);
                    } else {
                        console.log('Update Success:', res);
                    }
                });
            } else {
                insertStep('document_id', documentId, userId, (err, res) => {
                    if (err) {
                        console.error('Insert Error:', err);
                    } else {
                        console.log('Insert Success:', res);
                    }
                });
            }
        }
    });

    const values = [
        documentId,
        userId,
        files.pas_foto,
        files.scan_ktp,
        files.scan_ijazah,
        files.sertifikat_bahasa,
        files.sertifikat_keahlian,
        files.surat_keterangan_sehat
    ];

    db.query(sql, values, (err, result) => {
        if (err) return callback(err, null);
        callback(null, { document_id: documentId });
    });
};

const insertTKD = (userId, files, callback) => {
    const tkdId = generateId('tkd_');

    const sql = `
        INSERT INTO tbl_tkd (
            tkd_id, userid, tes_kognitif, tes_bahasa_jepang, tes_keahlian
        ) VALUES (?, ?, ?, ?, ?)
    `;

    getStep(userId, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
    
            if (existingData) {
                updateStep('tkd_id', tkdId, userId, (err, res) => {
                    if (err) {
                        console.error('Update Error:', err);
                    } else {
                        console.log('Update Success:', res);
                    }
                });
            } else {
                insertStep('tkd_id', tkdId, userId, (err, res) => {
                    if (err) {
                        console.error('Insert Error:', err);
                    } else {
                        console.log('Insert Success:', res);
                    }
                });
            }
        }
    });

    const values = [
        tkdId,
        userId,
        files.tes_kognitif,
        files.tes_bahasa_jepang,
        files.tes_keahlian
    ];

    db.query(sql, values, (err, result) => {
        if (err) return callback(err, null);
        callback(null, { tkd_id: tkdId });
    });
};

const insertWawancara = (userId, fileBuffer, callback) => {
    const wawancaraId = generateId('wcr_');

    const sql = `
        INSERT INTO tbl_wawancara (wawancara_id, userid, bukti_wawancara)
        VALUES (?, ?, ?)
    `;

    getStep(userId, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
    
            if (existingData) {
                updateStep('wawancara_id', wawancaraId, userId, (err, res) => {
                    if (err) {
                        console.error('Update Error:', err);
                    } else {
                        console.log('Update Success:', res);
                    }
                });
            } else {
                insertStep('wawancara_id', wawancaraId, userId, (err, res) => {
                    if (err) {
                        console.error('Insert Error:', err);
                    } else {
                        console.log('Insert Success:', res);
                    }
                });
            }
        }
    });


    db.query(sql, [wawancaraId, userId, fileBuffer], (err, result) => {
        if (err) return callback(err, null);
        callback(null, { wawancara_id: wawancaraId });
    });
};

const updateStep = (column, value, userId, callback) => {
    const sql = `UPDATE tbl_tahapan SET ?? = ? WHERE user_id = ?`;
    const params = [column, value, userId];

    db.query(sql, params, (err, result) => {
        if (err) return callback(err, null);
        callback(null, { message: 'Update berhasil', result });
    });
};

const getStep = (userid, callback) => {
    const sql = `SELECT user_id FROM tbl_tahapan WHERE user_id = ?`;
    const params = [userid];

    db.query(sql, params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

const checkExisting = (table, userid, callback) => {
    const sql = `SELECT userid FROM ?? WHERE userid = ?`;
    const params = [table, userid];

    db.query(sql, params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

const checkStep = (userid, callback) => {
    const sql = `SELECT * FROM tbl_tahapan WHERE user_id = ?`;
    const params = [userid];

    db.query(sql, params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

module.exports = { 
    insertBiodata,
    insertStep,
    insertDocument,
    insertTKD,
    insertWawancara,
    updateStep,
    getStep,
    checkExisting,
    checkStep
};