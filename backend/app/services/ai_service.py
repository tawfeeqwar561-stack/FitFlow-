from typing import Dict, List
import random


class AIService:
    """
    AI Service for food detection and recommendations.
    Note: This is a simplified version. In production, 
    you would integrate with actual ML models.
    """
    
    # Simplified food database (In production, use ML model)
    FOOD_DATABASE = {
        "pizza": {"calories": 285, "protein": 12, "carbs": 36, "fat": 10},
        "burger": {"calories": 354, "protein": 20, "carbs": 29, "fat": 17},
        "salad": {"calories": 152, "protein": 5, "carbs": 12, "fat": 9},
        "rice": {"calories": 206, "protein": 4, "carbs": 45, "fat": 0.4},
        "chicken": {"calories": 239, "protein": 27, "carbs": 0, "fat": 14},
        "pasta": {"calories": 288, "protein": 10, "carbs": 56, "fat": 2},
        "sandwich": {"calories": 252, "protein": 10, "carbs": 32, "fat": 9},
        "soup": {"calories": 150, "protein": 8, "carbs": 18, "fat": 5},
        "fruit": {"calories": 95, "protein": 1, "carbs": 25, "fat": 0.3},
        "egg": {"calories": 155, "protein": 13, "carbs": 1, "fat": 11},
    }
    
    @staticmethod
    async def detect_food_from_image(image_url: str) -> Dict:
        """
        Detect food from image and return nutritional info.
        Note: In production, integrate with a real CV model.
        """
        
        # Simulate food detection (random for demo)
        foods = list(AIService.FOOD_DATABASE.keys())
        detected_food = random.choice(foods)
        nutrition = AIService.FOOD_DATABASE[detected_food]
        
        return {
            "detected_food": detected_food,
            "calories": nutrition["calories"],
            "protein": nutrition["protein"],
            "carbs": nutrition["carbs"],
            "fat": nutrition["fat"],
            "confidence": round(random.uniform(0.75, 0.98), 2)
        }
    
    @staticmethod
    def get_workout_recommendation(calories: float, user_weight: float = 70) -> List[Dict]:
        """
        Recommend workouts based on calories consumed.
        """
        
        recommendations = []
        
        # Calculate calories to burn (roughly 30% of consumed)
        calories_to_burn = calories * 0.3
        
        exercises = [
            {"name": "Push Ups", "calories_per_min": 7},
            {"name": "Jumping Jacks", "calories_per_min": 10},
            {"name": "Running", "calories_per_min": 12},
            {"name": "Squats", "calories_per_min": 8},
            {"name": "Plank", "calories_per_min": 5},
        ]
        
        for exercise in exercises[:3]:
            duration = int(calories_to_burn / exercise["calories_per_min"])
            recommendations.append({
                "exercise_name": exercise["name"],
                "duration_minutes": duration,
                "calories_to_burn": round(calories_to_burn, 1),
                "reason": f"Burns approximately {exercise['calories_per_min']} calories/minute"
            })
        
        return recommendations
    
    @staticmethod
    def analyze_symptoms(description: str, body_part: str = None) -> List[Dict]:
        """
        Analyze symptoms and suggest doctors.
        Note: In production, use proper medical ML models with disclaimers.
        """
        
        suggestions = []
        description_lower = description.lower()
        
        # Simple keyword-based analysis
        if any(word in description_lower for word in ["joint", "knee", "ankle", "bone", "fracture"]):
            suggestions.append({
                "doctor_type": "Orthopedic",
                "reason": "Joint or bone-related symptoms detected",
                "urgency": "medium"
            })
        
        if any(word in description_lower for word in ["muscle", "strain", "sprain", "pain"]):
            suggestions.append({
                "doctor_type": "Physiotherapist",
                "reason": "Muscle or soft tissue issue detected",
                "urgency": "low"
            })
        
        if any(word in description_lower for word in ["breath", "chest", "heart", "palpitation"]):
            suggestions.append({
                "doctor_type": "Cardiologist",
                "reason": "Cardiovascular symptoms detected",
                "urgency": "high"
            })
        
        if any(word in description_lower for word in ["dizzy", "headache", "fatigue", "weak"]):
            suggestions.append({
                "doctor_type": "General Physician",
                "reason": "General health symptoms detected",
                "urgency": "low"
            })
        
        # Default suggestion
        if not suggestions:
            suggestions.append({
                "doctor_type": "General Physician",
                "reason": "General checkup recommended",
                "urgency": "low"
            })
        
        return suggestions