const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) 
        return res.status(401).json({ message: 'Token tidak ditemukan' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });
        req.user = user; // payload dari jwt.sign
        next();
    });
};

// Role checking
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const { roleid } = req.user;
        if (!allowedRoles.includes(roleid)) {
            return res.status(403).json({ message: 'Akses ditolak, role tidak sesuai' });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRole
};