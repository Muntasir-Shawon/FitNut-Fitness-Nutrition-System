const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all meal plans
router.get('/', async (req, res) => {
    try {
        const [mealPlans] = await db.query('SELECT * FROM meal_plans');
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single meal plan
router.get('/:id', async (req, res) => {
    try {
        const [mealPlan] = await db.query('SELECT * FROM meal_plans WHERE meal_plan_id = ?', 
        [req.params.id]);
        
        if (mealPlan.length === 0) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        res.json(mealPlan[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create meal plan
router.post('/', async (req, res) => {
    try {
        const { name, description, total_calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url } = req.body;
        const [result] = await db.query(
            'INSERT INTO meal_plans (name, description, total_calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, total_calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url]
        );
        res.status(201).json({ meal_plan_id: result.insertId, message: 'Meal plan created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update meal plan
router.put('/:id', async (req, res) => {
    try {
        const { name, description, total_calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url } = req.body;
        const [result] = await db.query(
            'UPDATE meal_plans SET name = ?, description = ?, total_calories = ?, protein_grams = ?, carbs_grams = ?, fats_grams = ?, fiber_grams = ?, image_url = ? WHERE meal_plan_id = ?',
            [name, description, total_calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        res.json({ message: 'Meal plan updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete meal plan
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM meal_plans WHERE meal_plan_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;