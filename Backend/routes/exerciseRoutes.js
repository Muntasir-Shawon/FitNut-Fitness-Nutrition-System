const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all exercises
router.get('/', async (req, res) => {
    try {
        const [exercises] = await db.query('SELECT * FROM exercises');
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get exercises by workout ID
router.get('/workout/:workoutId', async (req, res) => {
    try {
        const [exercises] = await db.query('SELECT * FROM exercises WHERE workout_id = ?', 
        [req.params.workoutId]);
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single exercise
router.get('/:id', async (req, res) => {
    try {
        const [exercise] = await db.query('SELECT * FROM exercises WHERE exercise_id = ?', 
        [req.params.id]);
        
        if (exercise.length === 0) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json(exercise[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create exercise
router.post('/', async (req, res) => {
    try {
        const { workout_id, name, description, sets, reps, rest_period_seconds, tips, image_url } = req.body;
        const [result] = await db.query(
            'INSERT INTO exercises (workout_id, name, description, sets, reps, rest_period_seconds, tips, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [workout_id, name, description, sets, reps, rest_period_seconds, tips, image_url]
        );
        res.status(201).json({ exercise_id: result.insertId, message: 'Exercise created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update exercise
router.put('/:id', async (req, res) => {
    try {
        const { workout_id, name, description, sets, reps, rest_period_seconds, tips, image_url } = req.body;
        const [result] = await db.query(
            'UPDATE exercises SET workout_id = ?, name = ?, description = ?, sets = ?, reps = ?, rest_period_seconds = ?, tips = ?, image_url = ? WHERE exercise_id = ?',
            [workout_id, name, description, sets, reps, rest_period_seconds, tips, image_url, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json({ message: 'Exercise updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete exercise
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM exercises WHERE exercise_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;