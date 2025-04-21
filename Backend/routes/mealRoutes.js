const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all meals
router.get('/', async (req, res) => {
    try {
        const [meals] = await db.query('SELECT * FROM meals');
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get meals by meal plan ID
router.get('/meal-plan/:mealPlanId', async (req, res) => {
    try {
        const [meals] = await db.query('SELECT * FROM meals WHERE meal_plan_id = ?', 
        [req.params.mealPlanId]);
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single meal
router.get('/:id', async (req, res) => {
    try {
        const [meal] = await db.query('SELECT * FROM meals WHERE meal_id = ?', 
        [req.params.id]);
        
        if (meal.length === 0) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.json(meal[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create meal
router.post('/', async (req, res) => {
    try {
        const { 
            meal_plan_id, name, ingredients, cooking_instructions, 
            calories, protein_grams, carbs_grams, fats_grams, 
            fiber_grams, image_url 
        } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO meals (meal_plan_id, name, ingredients, cooking_instructions, calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [meal_plan_id, name, ingredients, cooking_instructions, calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url]
        );
        res.status(201).json({ meal_id: result.insertId, message: 'Meal created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update meal
router.put('/:id', async (req, res) => {
    try {
        const { 
            meal_plan_id, name, ingredients, cooking_instructions, 
            calories, protein_grams, carbs_grams, fats_grams, 
            fiber_grams, image_url 
        } = req.body;
        
        const [result] = await db.query(
            'UPDATE meals SET meal_plan_id = ?, name = ?, ingredients = ?, cooking_instructions = ?, calories = ?, protein_grams = ?, carbs_grams = ?, fats_grams = ?, fiber_grams = ?, image_url = ? WHERE meal_id = ?',
            [meal_plan_id, name, ingredients, cooking_instructions, calories, protein_grams, carbs_grams, fats_grams, fiber_grams, image_url, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.json({ message: 'Meal updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete meal
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM meals WHERE meal_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.json({ message: 'Meal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;