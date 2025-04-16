const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};

const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required: name, email, password' });
    }

    // bisa ditambahkan validasi regex untuk email/password jika perlu
    next();
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

module.exports = {
    logger,
    validateRegistration,
    errorHandler
};