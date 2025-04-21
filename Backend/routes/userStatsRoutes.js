const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all user stats
router.get('/', async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM user_stats');
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM user_stats WHERE user_id = ?', 
        [req.params.userId]);
        
        if (stats.length === 0) {
            return res.status(404).json({ message: 'Stats not found for this user' });
        }
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create user stats
router.post('/', async (req, res) => {
    try {
        const { user_id, workout_count, achievement_count, success_rate } = req.body;
        const [result] = await db.query(
            'INSERT INTO user_stats (user_id, workout_count, achievement_count, success_rate) VALUES (?, ?, ?, ?)',
            [user_id, workout_count, achievement_count, success_rate]
        );
        res.status(201).json({ stat_id: result.insertId, message: 'User stats created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user stats
router.put('/:userId', async (req, res) => {
    try {
        const { workout_count, achievement_count, success_rate } = req.body;
        const [result] = await db.query(
            'UPDATE user_stats SET workout_count = ?, achievement_count = ?, success_rate = ? WHERE user_id = ?',
            [workout_count, achievement_count, success_rate, req.params.userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User stats not found' });
        }
        res.json({ message: 'User stats updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user stats
router.delete('/:userId', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM user_stats WHERE user_id = ?', [req.params.userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User stats not found' });
        }
        res.json({ message: 'User stats deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;