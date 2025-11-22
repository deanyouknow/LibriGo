import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, password, registrationCode } = req.body;

        // Validasi input
        if (!username || !password || !registrationCode) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Cek apakah username sudah ada
        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Validasi kode registrasi
        const [codeCheck] = await db.query(
            'SELECT * FROM registration_codes WHERE code = ? AND is_used = FALSE',
            [registrationCode]
        );

        if (codeCheck.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or already used registration code'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user baru
        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, 'user']
        );

        // Update kode registrasi menjadi used
        await db.query(
            'UPDATE registration_codes SET is_used = TRUE, used_by = ? WHERE code = ?',
            [result.insertId, registrationCode]
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user_id: result.insertId,
                username: username,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Cek user di database
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const user = users[0];

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token: token,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, username, role, created_at FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};