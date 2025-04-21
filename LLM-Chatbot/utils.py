def calculate_bmi(weight, height):
    """Calculate BMI given weight in kg and height in cm."""
    height_m = height / 100
    return weight / (height_m ** 2)

def calculate_bmr(weight, height, age, gender):
    """Calculate Basal Metabolic Rate using the Mifflin-St Jeor Equation."""
    if gender.lower() == 'male':
        return (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        return (10 * weight) + (6.25 * height) - (5 * age) - 161

def calculate_tdee(bmr, activity_level):
    """Calculate Total Daily Energy Expenditure."""
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
        "extremely active": 1.9
    }
    return bmr * activity_multipliers.get(activity_level.lower(), 1.2)

def calculate_macros(tdee, goal):
    """Calculate recommended macronutrient distribution."""
    if goal.lower() == "weight loss":
        calories = tdee - 500
        protein_pct = 0.35
        fat_pct = 0.25
        carb_pct = 0.40
    elif goal.lower() == "muscle gain":
        calories = tdee + 300
        protein_pct = 0.30
        fat_pct = 0.25
        carb_pct = 0.45
    else:  # maintenance
        calories = tdee
        protein_pct = 0.30
        fat_pct = 0.30
        carb_pct = 0.40
    
    protein_g = (calories * protein_pct) / 4
    fat_g = (calories * fat_pct) / 9
    carbs_g = (calories * carb_pct) / 4
    
    return {
        "calories": round(calories),
        "protein": round(protein_g),
        "fat": round(fat_g),
        "carbs": round(carbs_g)
    }

def get_bmi_category(bmi):
    """Return BMI category based on BMI value."""
    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi < 25:
        return "Normal weight"
    elif 25 <= bmi < 30:
        return "Overweight"
    else:
        return "Obese"

def generate_workout_split(goal, days_per_week):
    """Generate a basic workout split based on goals and available days."""
    if days_per_week < 3:
        return ["Full Body"] * days_per_week
    
    if goal.lower() == "muscle gain":
        if days_per_week == 3:
            return ["Push", "Pull", "Legs"]
        elif days_per_week == 4:
            return ["Upper", "Lower", "Upper", "Lower"]
        else:
            return ["Push", "Pull", "Legs", "Upper", "Lower"][:days_per_week]
    
    elif goal.lower() == "weight loss":
        splits = ["Cardio + Full Body", "HIIT", "Strength + Cardio"]
        return (splits * 2)[:days_per_week]
    
    else:  # General fitness
        splits = ["Full Body", "Cardio", "Strength", "HIIT", "Mobility"]
        return splits[:days_per_week] 