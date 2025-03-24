const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all goals
router.get('/', async (req, res) => {
    try {
        const [goals] = await db.query('SELECT * FROM user_goals ORDER BY start_date DESC');
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's goals
router.get('/user/:userId', async (req, res) => {
    try {
        const [goals] = await db.query('SELECT * FROM user_goals WHERE user_id = ? ORDER BY start_date DESC', 
        [req.params.userId]);
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get goals by type
router.get('/type/:goalType', async (req, res) => {
    try {
        const [goals] = await db.query('SELECT * FROM user_goals WHERE goal_type = ? ORDER BY start_date DESC', 
        [req.params.goalType]);
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single goal
router.get('/:id', async (req, res) => {
    try {
        const [goal] = await db.query('SELECT * FROM user_goals WHERE goal_id = ?', 
        [req.params.id]);
        
        if (goal.length === 0) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json(goal[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create goal
router.post('/', async (req, res) => {
    try {
        const { user_id, goal_type, target_value, start_date, target_date } = req.body;
        const [result] = await db.query(
            'INSERT INTO user_goals (user_id, goal_type, target_value, start_date, target_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, goal_type, target_value, start_date, target_date, 'in_progress']
        );
        res.status(201).json({ goal_id: result.insertId, message: 'Goal created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update goal
router.put('/:id', async (req, res) => {
    try {
        const { goal_type, target_value, start_date, target_date, status } = req.body;
        const [result] = await db.query(
            'UPDATE user_goals SET goal_type = ?, target_value = ?, start_date = ?, target_date = ?, status = ? WHERE goal_id = ?',
            [goal_type, target_value, start_date, target_date, status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json({ message: 'Goal updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update goal status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const [result] = await db.query(
            'UPDATE user_goals SET status = ? WHERE goal_id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json({ message: 'Goal status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete goal
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM user_goals WHERE goal_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;