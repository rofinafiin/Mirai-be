// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require(`../controllers/userController`);
const { verifyToken, authorizeRole } = require('../middleware/auth');
const ckController = require('../controllers/calonkerjaController');
const upload = require('../middleware/uploadMemory');



// Contoh route sementara
router.get('/', (req, res) => {
    res.json({ message: 'User route is working!' });
});

const mst = 'mst';
router.get(`/${mst}/roles`, userController.getRoles);


const usr = 'logs';
router.post(`/${usr}/register`, userController.registerUserStart)
router.post(`/${usr}/login`, userController.loginUser)

const thp = 'administrasi';
router.post(`/${thp}/biodata`, verifyToken, authorizeRole([14]), ckController.insertBiodata);
router.get(`/${thp}/checks`, verifyToken, authorizeRole([14]), ckController.checkingStep);
router.post(
    `/${thp}/document`,
    verifyToken,
    authorizeRole([14]),
    upload.fields([
      { name: 'pas_foto', maxCount: 1 },
      { name: 'scan_ktp', maxCount: 1 },
      { name: 'scan_ijazah', maxCount: 1 },
      { name: 'sertifikat_bahasa', maxCount: 1 },
      { name: 'sertifikat_keahlian', maxCount: 1 },
      { name: 'surat_keterangan_sehat', maxCount: 1 }
    ]),
    ckController.uploadDocuments
  );

  router.post(
    `/${thp}/tkd`,
    verifyToken,
    authorizeRole([14]),
    upload.fields([
      { name: 'tes_kognitif', maxCount: 1 },
      { name: 'tes_bahasa_jepang', maxCount: 1 },
      { name: 'tes_keahlian', maxCount: 1 }
    ]),
    ckController.uploadTKD
  );

  router.post(
    `/${thp}/wawancara`,
    verifyToken,
    authorizeRole([14]),
    upload.single('bukti_wawancara'), 
    ckController.uploadWawancara
);


module.exports = router;