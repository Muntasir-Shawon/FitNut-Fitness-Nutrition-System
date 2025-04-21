const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all workouts
router.get('/', async (req, res) => {
    try {
        const [workouts] = await db.query('SELECT * FROM workouts');
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single workout
router.get('/:id', async (req, res) => {
    try {
        const [workout] = await db.query('SELECT * FROM workouts WHERE workout_id = ?', 
        [req.params.id]);
        
        if (workout.length === 0) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(workout[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create workout
router.post('/', async (req, res) => {
    try {
        const { name, description, difficulty_level, duration_minutes, calorie_burn, image_url } = req.body;
        const [result] = await db.query(
            'INSERT INTO workouts (name, description, difficulty_level, duration_minutes, calorie_burn, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, difficulty_level, duration_minutes, calorie_burn, image_url]
        );
        res.status(201).json({ workout_id: result.insertId, message: 'Workout created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update workout
router.put('/:id', async (req, res) => {
    try {
        const { name, description, difficulty_level, duration_minutes, calorie_burn, image_url } = req.body;
        const [result] = await db.query(
            'UPDATE workouts SET name = ?, description = ?, difficulty_level = ?, duration_minutes = ?, calorie_burn = ?, image_url = ? WHERE workout_id = ?',
            [name, description, difficulty_level, duration_minutes, calorie_burn, image_url, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json({ message: 'Workout updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete workout
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM workouts WHERE workout_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;