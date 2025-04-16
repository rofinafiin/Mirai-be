const multer = require('multer');

// Menyimpan file di memory sebagai buffer
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;