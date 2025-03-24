const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query('SELECT user_id, email, first_name, last_name, profile_image_url, bio, created_at, updated_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single user
router.get('/:id', async (req, res) => {
    try {
        const [user] = await db.query('SELECT user_id, email, first_name, last_name, profile_image_url, bio, created_at, updated_at FROM users WHERE user_id = ?', 
        [req.params.id]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create user
router.post('/', async (req, res) => {
    try {
        const { email, password_hash, first_name, last_name, bio } = req.body;
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, bio) VALUES (?, ?, ?, ?, ?)',
            [email, password_hash, first_name, last_name, bio]
        );
        res.status(201).json({ user_id: result.insertId, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { email, first_name, last_name, bio } = req.body;
        const [result] = await db.query(
            'UPDATE users SET email = ?, first_name = ?, last_name = ?, bio = ? WHERE user_id = ?',
            [email, first_name, last_name, bio, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;