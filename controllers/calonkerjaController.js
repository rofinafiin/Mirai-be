const upload = require('../middleware/uploadMemory');
const Biodata = require('../models/calonkerjaModels');

const insertBiodata = (req, res) => {
    const {
        nama,
        jenis_kelamin,
        nomor_paspor,
        phone_number,
        tanggal_lahir,
        tempat_lahir,
        nik_ktp,
        alamat,
        email
    } = req.body;

    if (!nama || !jenis_kelamin || !tanggal_lahir || !nik_ktp || !alamat || !email) {
        return res.status(400).json({ message: 'Beberapa field wajib diisi' });
    }

    const biodata = {
        userid: req.user.userId, // dari JWT token
        nama,
        jenis_kelamin,
        nomor_paspor,
        phone_number,
        tanggal_lahir,
        tempat_lahir,
        nik_ktp,
        alamat,
        email
    };

    Biodata.checkExisting('tbl_biodata', biodata.userid, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
            
            if (existingData) {
                return res.status(400).json({ message: 'Biodata sudah tersedia untuk user ini' });
            } 
            Biodata.insertBiodata(biodata, (err, result) => {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan biodata', error: err });
                res.status(201).json({ message: 'Biodata berhasil disimpan', biodata: result });
            });
        };
    });
};

const uploadDocuments = (req, res) => {
    const userId = req.user.userId; // dari token

    const files = {
        pas_foto: req.files['pas_foto']?.[0]?.buffer || null,
        scan_ktp: req.files['scan_ktp']?.[0]?.buffer || null,
        scan_ijazah: req.files['scan_ijazah']?.[0]?.buffer || null,
        sertifikat_bahasa: req.files['sertifikat_bahasa']?.[0]?.buffer || null,
        sertifikat_keahlian: req.files['sertifikat_keahlian']?.[0]?.buffer || null,
        surat_keterangan_sehat: req.files['surat_keterangan_sehat']?.[0]?.buffer || null
    };

    Biodata.checkExisting('tbl_documents', userId, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
            
            if (existingData) {
                return res.status(400).json({ message: 'Biodata sudah tersedia untuk user ini' });
            } 
            Biodata.insertDocument(userId, files, (err, result) => {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan dokumen', error: err });
                res.status(201).json({ message: 'Dokumen berhasil disimpan', document_id: result.document_id });
            });
        };
    });
};

const uploadTKD = (req, res) => {
    const userId = req.user.userId;

    const files = {
        tes_kognitif: req.files?.tes_kognitif?.[0]?.buffer || null,
        tes_bahasa_jepang: req.files?.tes_bahasa_jepang?.[0]?.buffer || null,
        tes_keahlian: req.files?.tes_keahlian?.[0]?.buffer || null
    };

    // Validasi wajib
    if (!files.tes_kognitif || !files.tes_keahlian) {
        return res.status(400).json({ message: 'Tes kognitif dan keahlian wajib diunggah.' });
    }

    Biodata.checkExisting('tbl_tkd', userId, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
            
            if (existingData) {
                return res.status(400).json({ message: 'Biodata sudah tersedia untuk user ini' });
            } 
            Biodata.insertTKD(userId, files, (err, result) => {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan TKD', error: err });
                res.status(201).json({ message: 'TKD berhasil disimpan', tkd_id: result.tkd_id });
            });
        };
    });

};

const uploadWawancara = (req, res) => {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Berkas wawancara harus diunggah.' });
    }
    
    Biodata.checkExisting('tbl_wawancara', userId, (err, existingData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Cek step:', existingData);
            
            if (existingData) {
                return res.status(400).json({ message: 'Biodata sudah tersedia untuk user ini' });
            } 
            Biodata.insertWawancara(userId, file.buffer, (err, result) => {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan bukti wawancara', error: err });
                res.status(201).json({ message: 'Bukti wawancara berhasil disimpan', wawancara_id: result.wawancara_id });
            });
        };
    });
};

const checkingStep = (req, res) => {
    Biodata.checkStep(req.user.userId, (err, steps) => {
        if (err) 
            return res.status(500).json({
            message: `Gagal Mengambil data`, 
            error: err
            });
            res.status(200).json(steps);
    });
};

module.exports = { 
    insertBiodata,
    uploadDocuments,
    uploadTKD,
    uploadWawancara,
    checkingStep
};