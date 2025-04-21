const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all progress records
router.get('/', async (req, res) => {
    try {
        const [records] = await db.query('SELECT * FROM progress_tracking ORDER BY date DESC');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get progress records by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const [records] = await db.query('SELECT * FROM progress_tracking WHERE user_id = ? ORDER BY date DESC', 
        [req.params.userId]);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single progress record
router.get('/:id', async (req, res) => {
    try {
        const [record] = await db.query('SELECT * FROM progress_tracking WHERE progress_id = ?', 
        [req.params.id]);
        
        if (record.length === 0) {
            return res.status(404).json({ message: 'Progress record not found' });
        }
        res.json(record[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create progress record
router.post('/', async (req, res) => {
    try {
        const { user_id, date, weight, strength_level, cardio_performance, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO progress_tracking (user_id, date, weight, strength_level, cardio_performance, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, date, weight, strength_level, cardio_performance, notes]
        );
        res.status(201).json({ progress_id: result.insertId, message: 'Progress record created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update progress record
router.put('/:id', async (req, res) => {
    try {
        const { user_id, date, weight, strength_level, cardio_performance, notes } = req.body;
        const [result] = await db.query(
            'UPDATE progress_tracking SET user_id = ?, date = ?, weight = ?, strength_level = ?, cardio_performance = ?, notes = ? WHERE progress_id = ?',
            [user_id, date, weight, strength_level, cardio_performance, notes, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Progress record not found' });
        }
        res.json({ message: 'Progress record updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete progress record
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM progress_tracking WHERE progress_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Progress record not found' });
        }
        res.json({ message: 'Progress record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;