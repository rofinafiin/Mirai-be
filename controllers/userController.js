const user = require(`../models/userModels`);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getRoles = (req, res) => {
    user.SelectRole((err, users) => {
        if (err) 
            return res.status(500).json({
            message: `Gagal Mengambil data`, 
            error: err
            });
            res.status(200).json(users);
    });
};

const registerUserStart = async (req, res) => {
    const { username, password, email, phone_number, nama } = req.body;

    console.log('Request Body:', req.body);

    if (!username || !password || !email || !phone_number || !nama) {
        return res.status(400).json({ message: 'Semua field harus diisi.' });
    }

    try {
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            phone_number,
            nama
        };

        user.registerUser(newUser, (err, result) => {
            if (err) return res.status(500).json({ message: 'Gagal mendaftar', error: err });
            res.status(201).json({ message: 'Registrasi berhasil', userId: result.insertId });
        });

    } catch (err) {
        res.status(500).json({ message: 'Error saat hashing password', error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
        user.findUserByUsername(username, async (err, user) => {
            if (err) return res.status(500).json({ message: 'Gagal mencari user', error: err });
            if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Password salah' });

            // ✅ Generate JWT
            const token = jwt.sign(
                {
                    userId: user.UserID,
                    username: user.username,
                    roleid: user.roleid
                },
                process.env.JWT_SECRET, // ganti dengan env
                { expiresIn: '2h' }
            );

            res.status(200).json({
                message: 'Login berhasil',
                token
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat login', error: error.message });
    }
};

module.exports = {
    getRoles,
    registerUserStart,
    loginUser
}