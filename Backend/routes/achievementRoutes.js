const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all achievements
router.get('/', async (req, res) => {
    try {
        const [achievements] = await db.query('SELECT * FROM achievements ORDER BY date_achieved DESC');
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get achievements by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const [achievements] = await db.query('SELECT * FROM achievements WHERE user_id = ? ORDER BY date_achieved DESC', 
        [req.params.userId]);
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single achievement
router.get('/:id', async (req, res) => {
    try {
        const [achievement] = await db.query('SELECT * FROM achievements WHERE achievement_id = ?', 
        [req.params.id]);
        
        if (achievement.length === 0) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create achievement
router.post('/', async (req, res) => {
    try {
        const { user_id, name, description, milestone_value } = req.body;
        const [result] = await db.query(
            'INSERT INTO achievements (user_id, name, description, milestone_value) VALUES (?, ?, ?, ?)',
            [user_id, name, description, milestone_value]
        );
        res.status(201).json({ achievement_id: result.insertId, message: 'Achievement created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update achievement
router.put('/:id', async (req, res) => {
    try {
        const { user_id, name, description, milestone_value } = req.body;
        const [result] = await db.query(
            'UPDATE achievements SET user_id = ?, name = ?, description = ?, milestone_value = ? WHERE achievement_id = ?',
            [user_id, name, description, milestone_value, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json({ message: 'Achievement updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete achievement
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM achievements WHERE achievement_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;