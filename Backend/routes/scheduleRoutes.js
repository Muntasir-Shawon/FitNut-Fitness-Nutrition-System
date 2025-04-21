const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all training schedules
router.get('/', async (req, res) => {
    try {
        const [schedules] = await db.query('SELECT * FROM training_schedule ORDER BY scheduled_date');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's training schedule
router.get('/user/:userId', async (req, res) => {
    try {
        const [schedules] = await db.query(
            'SELECT ts.*, w.name as workout_name FROM training_schedule ts ' +
            'JOIN workouts w ON ts.workout_id = w.workout_id ' +
            'WHERE ts.user_id = ? ORDER BY scheduled_date',
            [req.params.userId]
        );
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single schedule entry
router.get('/:id', async (req, res) => {
    try {
        const [schedule] = await db.query(
            'SELECT ts.*, w.name as workout_name FROM training_schedule ts ' +
            'JOIN workouts w ON ts.workout_id = w.workout_id ' +
            'WHERE ts.schedule_id = ?',
            [req.params.id]
        );
        
        if (schedule.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json(schedule[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create schedule entry
router.post('/', async (req, res) => {
    try {
        const { user_id, workout_id, scheduled_date, completion_status } = req.body;
        const [result] = await db.query(
            'INSERT INTO training_schedule (user_id, workout_id, scheduled_date, completion_status) VALUES (?, ?, ?, ?)',
            [user_id, workout_id, scheduled_date, completion_status || 'pending']
        );
        res.status(201).json({ schedule_id: result.insertId, message: 'Schedule created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update schedule entry
router.put('/:id', async (req, res) => {
    try {
        const { user_id, workout_id, scheduled_date, completion_status } = req.body;
        const [result] = await db.query(
            'UPDATE training_schedule SET user_id = ?, workout_id = ?, scheduled_date = ?, completion_status = ? WHERE schedule_id = ?',
            [user_id, workout_id, scheduled_date, completion_status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json({ message: 'Schedule updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update completion status
router.patch('/:id/status', async (req, res) => {
    try {
        const { completion_status } = req.body;
        const [result] = await db.query(
            'UPDATE training_schedule SET completion_status = ? WHERE schedule_id = ?',
            [completion_status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete schedule entry
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM training_schedule WHERE schedule_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;