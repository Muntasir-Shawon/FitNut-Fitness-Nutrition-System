import { UserProfile } from './authStorage';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: 'nutrition' | 'workout' | 'general';
}

export function calculateNutritionTargets(user: UserProfile) {
  // Mifflin-St Jeor Equation
  let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
  if (user.gender === 'Male') {
    bmr += 5;
  } else if (user.gender === 'Female') {
    bmr -= 161;
  } else {
    bmr -= 80;
  }

  const tdee = Math.round(bmr * 1.45); // Active lifestyle multiplier

  let targetCalories = tdee;
  let goalDescription = 'Maintain current body weight & energy balance';

  if (user.primaryGoal === 'Weight Loss') {
    targetCalories = Math.max(1200, tdee - 450);
    goalDescription = 'Caloric deficit for steady, healthy fat loss (-0.5kg/week)';
  } else if (user.primaryGoal === 'Muscle Gain') {
    targetCalories = tdee + 350;
    goalDescription = 'Lean surplus to support muscle protein synthesis & hypertrophy';
  } else if (user.primaryGoal === 'Endurance') {
    targetCalories = tdee + 150;
    goalDescription = 'Fuel for stamina, cardiovascular performance & glycogen replenishment';
  }

  // Protein targets
  const proteinGrams = Math.round(user.weight * (user.primaryGoal === 'Muscle Gain' ? 2.0 : 1.8));
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.max(50, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    goalDescription,
  };
}

export function generateAIResponse(userQuery: string, user: UserProfile, history: ChatMessage[]): string {
  const query = userQuery.toLowerCase();
  const targets = calculateNutritionTargets(user);
  const pronoun = user.gender === 'Female' ? 'her' : user.gender === 'Male' ? 'him' : 'them';
  const name = user.name || 'Friend';

  // 1. Target & Calorie & Macro inquiries
  if (
    query.includes('calorie') ||
    query.includes('target') ||
    query.includes('macro') ||
    query.includes('calculate') ||
    query.includes('tdee') ||
    query.includes('bmr')
  ) {
    return (
      `📊 **Personalized Daily Energy & Macro Target for ${name}**:\n\n` +
      `• **Profile**: ${user.gender}, ${user.age} yrs • **Weight**: ${user.weight}kg • **Height**: ${user.height}cm\n` +
      `• **Current BMI**: ${user.bmi} (${user.bmiCategory})\n` +
      `• **Primary Goal**: ${user.primaryGoal} (${targets.goalDescription})\n\n` +
      `🎯 **Daily Recommended Targets**:\n` +
      `🔥 **Daily Calories**: **${targets.targetCalories} kcal** (Maintenance TDEE: ${targets.tdee} kcal)\n` +
      `🥩 **Protein**: **${targets.proteinGrams}g** (~${Math.round((targets.proteinGrams * 4 / targets.targetCalories) * 100)}% of intake)\n` +
      `🍚 **Carbohydrates**: **${targets.carbGrams}g** (Clean energy sources)\n` +
      `🥑 **Healthy Fats**: **${targets.fatGrams}g** (Hormone & cell support)\n\n` +
      `💡 *Tip: For ${pronoun}, consistent protein distribution across 3-4 meals will optimize metabolism and recovery!*`
    );
  }

  // 2. Breakfast recommendations
  if (query.includes('breakfast') || query.includes('morning')) {
    if (user.dietaryPreference === 'Vegetarian' || user.dietaryPreference === 'Vegan') {
      return (
        `🌅 **Personalized Breakfast for ${name} (${user.dietaryPreference})**:\n\n` +
        `🥣 **High-Protein Overnight Oats & Chia Bowl**\n` +
        `• 50g Rolled Oats + 1 scoop Plant/Soy Protein Powder\n` +
        `• 1 tbsp Chia Seeds + 150ml Almond/Soy Milk\n` +
        `• Topped with 1/2 cup blueberries & 1 tbsp crushed walnuts\n\n` +
        `⚡ **Nutritional Breakdown**:\n` +
        `• Calories: ~390 kcal | Protein: 28g | Carbs: 45g | Fats: 11g\n\n` +
        `✨ *Why it's great for your ${user.primaryGoal} goal*: High fiber stabilizes morning glucose and curbs snacking impulses!`
      );
    }

    if (user.dietaryPreference === 'Keto') {
      return (
        `🌅 **Keto Morning Fuel for ${name}**:\n\n` +
        `🍳 **Avocado, Spinach & Egg Scramble**\n` +
        `• 3 Whole Organic Eggs scrambled in 1 tsp olive oil\n` +
        `• 1/2 sliced ripe Avocado\n` +
        `• 1 cup sauteed baby spinach & a sprinkle of feta cheese\n\n` +
        `⚡ **Nutritional Breakdown**:\n` +
        `• Calories: ~430 kcal | Protein: 24g | Net Carbs: 4g | Fats: 35g\n\n` +
        `✨ *Helps you sustain ketosis with healthy mono-unsaturated fats!*`
      );
    }

    return (
      `🌅 **Power Breakfast for ${name} (${user.primaryGoal})**:\n\n` +
      `🍳 **Classic Egg White & Whole Grain Toast Combo**\n` +
      `• 3 Large Eggs (2 whites + 1 whole) with bell peppers\n` +
      `• 2 slices Whole Wheat Sourdough or 100g Greek Yogurt with berries\n` +
      `• 1 cup Green Tea or Black Coffee\n\n` +
      `⚡ **Nutritional Breakdown**:\n` +
      `• Calories: ~410 kcal | Protein: 32g | Carbs: 38g | Fats: 12g\n\n` +
      `✨ *Fuels ${user.name}'s daily metabolic rate and keeps you full for 4+ hours.*`
    );
  }

  // 3. Lunch / Dinner / Meal recommendations
  if (
    query.includes('meal') ||
    query.includes('lunch') ||
    query.includes('dinner') ||
    query.includes('food') ||
    query.includes('eat') ||
    query.includes('diet') ||
    query.includes('nutrition')
  ) {
    return (
      `🥗 **Personalized Meal & Food Guide for ${name}**:\n\n` +
      `Based on your **${user.primaryGoal}** goal and **${user.dietaryPreference}** diet:\n\n` +
      `🍽️ **Balanced Lunch Option**:\n` +
      `• **Lean Protein**: 160g Grilled Chicken Breast / Tofu / Salmon\n` +
      `• **Complex Carb**: 120g Steamed Quinoa or Brown Jasmine Rice\n` +
      `• **Fibrous Veggies**: 2 cups Steamed Broccoli, Zucchini, and Cherry Tomatoes\n` +
      `• **Healthy Fat Dressing**: 1 tsp Extra Virgin Olive Oil & Lemon Juice\n\n` +
      `🌙 **Dinner Option**:\n` +
      `• Lean Fish or Paneer / Lentil Curry bowl with massive green salad\n` +
      `• Half a sweet potato or roasted squash\n\n` +
      `✅ **Best Foods for You**: Eggs, Salmon, Lentils, Greek Yogurt, Spinach, Quinoa, Berries, Almonds.\n` +
      `❌ **Foods to Minimize**: Deep-fried foods, high-sugar soda, refined flour pastries, trans fats.`
    );
  }

  // 4. Workout & Exercise recommendations
  if (
    query.includes('workout') ||
    query.includes('exercise') ||
    query.includes('routine') ||
    query.includes('gym') ||
    query.includes('training') ||
    query.includes('fitness')
  ) {
    if (user.primaryGoal === 'Weight Loss') {
      return (
        `🏋️‍♂️ **Recommended Fat-Loss & Toning Routine for ${name}**:\n\n` +
        `Combining resistance training with short metabolic intervals gives the highest EPOC (afterburn effect):\n\n` +
        `🔥 **35-Minute Metabolic Circuit (4 Rounds)**:\n` +
        `1. **Goblet Squats or Bodyweight Squats**: 15 reps (Rest 45s)\n` +
        `2. **Push-ups (or incline)**: 12 reps (Rest 45s)\n` +
        `3. **Dumbbell Romanian Deadlifts**: 12 reps (Rest 60s)\n` +
        `4. **Dumbbell Overhead Press**: 12 reps (Rest 45s)\n` +
        `5. **Plank Hold**: 45 seconds (Rest 60s)\n\n` +
        `🏃 **Cardio Recommendation**: 8,000–10,000 daily steps + 20 min brisk incline walking 3x/week.`
      );
    }

    if (user.primaryGoal === 'Muscle Gain') {
      return (
        `💪 **Hypertrophy & Strength Program for ${name}**:\n\n` +
        `Targeting progressive overload with 8–12 rep hypertrophy range:\n\n` +
        `🗓️ **4-Day Upper / Lower Split**:\n` +
        `• **Day 1: Upper Strength** (Bench Press, Barbell Rows, Shoulder Press, Lat Pulldowns, Bicep/Tricep)\n` +
        `• **Day 2: Lower Power** (Barbell Back Squats, Romanian Deadlifts, Leg Press, Calf Raises)\n` +
        `• **Day 3: Rest / Active Recovery**\n` +
        `• **Day 4: Upper Hypertrophy** (Incline Dumbbell Press, Cable Rows, Lateral Raises, Face Pulls)\n` +
        `• **Day 5: Lower Hypertrophy** (Bulgarian Split Squats, Hamstring Curls, Walking Lunges)\n\n` +
        `📈 *Aim to increase weight or reps every 1-2 weeks!*`
      );
    }

    return (
      `🏃 **Endurance & Full-Body Conditioning for ${name}**:\n\n` +
      `• **Day 1**: 5K Tempo Run or 30 min cycling at 70% max heart rate\n` +
      `• **Day 2**: Full-body functional mobility & Kettlebell compound circuit\n` +
      `• **Day 3**: High Intensity Interval Sprints (30s on / 60s off × 10 rounds)\n` +
      `• **Day 4**: Active recovery & core stability (Planks, bird-dogs, deadbugs)\n` +
      `• **Day 5**: Long slow distance (LSD) run / bike / row`
    );
  }

  // 5. Snacks and Craving options
  if (query.includes('snack') || query.includes('craving') || query.includes('hunger')) {
    return (
      `🍎 **Smart & Nutritious Snacks for ${name}**:\n\n` +
      `1. **Greek Yogurt Crunch**: 150g Non-fat Greek Yogurt + 1 tbsp chia seeds + dash of cinnamon (18g protein, 130 kcal)\n` +
      `2. **Apple & Natural Peanut Butter**: 1 sliced apple + 1 tbsp peanut butter (Clean carbs & good fats)\n` +
      `3. **Hard-boiled Eggs**: 2 eggs sprinkled with black pepper & sea salt (12g protein)\n` +
      `4. **Roasted Edamame / Roasted Chickpeas**: High-fiber crunchy craving crusher (10g protein)\n` +
      `5. **Protein Shake**: 1 scoop whey/plant protein blended with water and ice.`
    );
  }

  // 6. Water and Hydration
  if (query.includes('water') || query.includes('hydration') || query.includes('drink')) {
    const waterLiters = (user.weight * 0.038).toFixed(1);
    return (
      `💧 **Daily Hydration Guideline for ${name}**:\n\n` +
      `• **Target Intake**: Approximately **${waterLiters} Liters** of pure water daily.\n` +
      `• **Morning Ritual**: Drink 500ml of room temperature water right after waking up to jumpstart metabolism.\n` +
      `• **Workout Hydration**: Sip 250ml every 15-20 minutes during exercise.\n` +
      `• **Tip**: Add lemon slices or cucumber for refreshing electrolyte support without extra sugar!`
    );
  }

  // Default context-aware general coaching
  return (
    `👋 Hello **${name}**! I'm your dedicated **FitNut AI Coach**.\n\n` +
    `I'm constantly analyzing your health parameters:\n` +
    `• **Gender**: ${user.gender} | **Age**: ${user.age}\n` +
    `• **Weight**: ${user.weight}kg | **Height**: ${user.height}cm\n` +
    `• **BMI**: ${user.bmi} (${user.bmiCategory})\n` +
    `• **Primary Goal**: ${user.primaryGoal} | **Diet**: ${user.dietaryPreference}\n\n` +
    `You can ask me anything about:\n` +
    `• 🥗 *"What food should I eat for my goal today?"*\n` +
    `• 🏋️ *"Give me a tailored workout routine"* \n` +
    `• 🔢 *"What are my exact daily calories and protein?"*\n` +
    `• 🍎 *"Best healthy snacks to stay on track"*`
  );
}
