import numpy as np

def calculate_and_project_skill(fargorate, bu_total, win_percentage, years_of_experience, bu_drill_7, bu_drill_8, practice_hours_per_week, bu_drill_2, bu_drill_6, **kwargs):
    """
    This function contains the complete model logic from the notebook.
    It calculates the current skill level and then projects the future skill.
    It now includes logic to calculate a fargorate if the provided fargorate is 0 or None.
    It also calculates and returns recommended hours for four key skill components.
    """
    
   
    # === Part 1: Calculate Current Skill Level ===
    
    # Normalize and clip the features
    nf = np.clip(fargorate / 1000, 0, 1)
    nb = np.clip(bu_total / 100, 0, 1)
    nw = np.clip(win_percentage , 0, 1)
    ny = np.clip(years_of_experience / 35.0, 0, 1)
    d7 = np.clip(bu_drill_7 / 20.0, 0, 1)
    d8 = np.clip(bu_drill_8 / 20.0, 0, 1)
    
    # Apply the "Top Boost" logic
    fargo_threshold = 650
    bu_total_threshold = 75
    max_boost = 2.5
    fargo_boost_factor = 0.006
    bu_total_boost_factor = 0.06
    
    boost_amount = 0
    if fargorate > fargo_threshold and bu_total > bu_total_threshold:
        boost_amount = min(
            (fargorate - fargo_threshold) * fargo_boost_factor +
            (bu_total - bu_total_threshold) * bu_total_boost_factor,
            max_boost
        )
    
    # Calculate the base score using the weighted formula
    base_score = (
        0.45 * (nf**1.1) +
        0.30 * (nb**1.05) +
        0.10 * nw +
        0.05 * ny +
        0.05 * d7 +
        0.05 * d8
    )
    
    current_skill_level = (11.5 * base_score + boost_amount)
    
    # Ensure the calculated skill level is within the desired range (1-10)
    current_skill_level = int(round(np.clip(current_skill_level, 1, 10)))
    
    # === Part 2: Project Future Skill Level ===
    
    def calculate_improvement_speed(skill_level):
        if 1 <= skill_level <= 3:
            return 3
        elif 4 <= skill_level <= 6:
            return 2
        elif 7 <= skill_level <= 10:
            return 1
        else:
            return 0.1

    improvement_speed_factor = calculate_improvement_speed(current_skill_level)
    
    projected_improvement_value = (
        (practice_hours_per_week / 10) *
        (improvement_speed_factor)
    )
    
   
    
    projected_skill_level = current_skill_level + projected_improvement_value
    projected_skill_level = int(round(np.clip(projected_skill_level, 1, 10)))
    
    projected_improvement = projected_skill_level - current_skill_level
    
    # === Part 3: Calculate Recommended Practice Hours for Skill Components ===
    
    min_time_slot = 0.5
    
    # Calculate skill component proficiency (normalized 0-1)
    cue_ball_control = np.clip(bu_drill_8 / 20.0, 0, 1)
    ball_pocketing = np.clip(bu_drill_6 / 10.0, 0, 1)
    pattern_play = np.clip(win_percentage , 0, 1)
    stroke_quality = np.clip((bu_drill_7 + bu_drill_2) / 30.0, 0, 1)
    
    # Calculate the "lacking" amount for each component
    lacking = {
        'Cue_Ball_Control': 1.00 - cue_ball_control,
        'Ball_Pocketing': 1.00 - ball_pocketing,
        'Pattern_Play': 1.00 - pattern_play,
        'Stroke_Quality': 1.00 - stroke_quality
    }
    
    # Calculate total lacking amount
    total_lacking = sum(lacking.values())
    
    # Handle the case where total_lacking is zero to avoid division by zero
    if total_lacking == 0:
        recommended_hours = {
            'Cue_Ball_Control': 0.0,
            'Ball_Pocketing': 0.0,
            'Pattern_Play': 0.0,
            'Stroke_Quality': 0.0
        }
    else:
        # Calculate raw allocated time
        raw_hours = {key: (value / total_lacking) * practice_hours_per_week for key, value in lacking.items()}
        
        # Apply the minimum time slot rule
        adjusted_hours = {key: max(value, min_time_slot) for key, value in raw_hours.items()}
        
        # Re-normalize if the total exceeds practice hours
        total_adjusted = sum(adjusted_hours.values())
        if total_adjusted > practice_hours_per_week:
            scale_factor = practice_hours_per_week / total_adjusted
            recommended_hours = {key: value * scale_factor for key, value in adjusted_hours.items()}
        else:
            recommended_hours = adjusted_hours
            
    # Round the final hours to the nearest 0.5
    recommended_hours = {key: (round(value * 2) / 2) for key, value in recommended_hours.items()}
    
    # Final adjustment to ensure sum equals practice_hours_per_week
    final_sum = sum(recommended_hours.values())
    difference = practice_hours_per_week - final_sum
    if abs(difference) > 0.01:
        # Find the component with the largest value to absorb the difference
        largest_comp = max(recommended_hours, key=recommended_hours.get)
        recommended_hours[largest_comp] += difference

    # === Part 4: Generate Message and Return Results ===
    if projected_improvement > 0:
        message = (
            f"Based on your stats and practice hours, your current skill level is a {current_skill_level}. "
            f"By practicing for {practice_hours_per_week} hours per week, you are projected to reach "
            f"a skill level of {projected_skill_level} in one year. That's an improvement of "
            f"{projected_improvement} level(s)! Keep up the great work."
        )
    else:
        message = (
            f"Based on your stats, your current skill level is a {current_skill_level}. "
            f"Your current practice schedule is great for maintaining this high level of play!"
        )
        
    return {
        "current_skill_level": current_skill_level,
        "projected_skill_level": projected_skill_level,
        "projected_improvement": projected_improvement,
        "recommended_hours": recommended_hours, # this is a dict with a key of each category
        "message": message
    }