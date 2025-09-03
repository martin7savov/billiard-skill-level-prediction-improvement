import styles from './TrainingDrills.module.css';

interface TrainingCategory {
  name: string;
  displayName: string;
  levels: {
    [key: string]: string[];
  };
}

interface TrainingDrillsProps {
  current_skill_level: number;
  categories: TrainingCategory[];
  recommendedHours: any;
}

export default function TrainingDrills({ current_skill_level, categories, recommendedHours }: TrainingDrillsProps) {
  const getSkillLevel = (skill: number): string => {
    if (skill <= 3) {
      return 'Beginner';
    } else if (skill <= 6) {
      return 'Intermediate';
    } else {
      return 'Advanced';
    }
  };

  const skillLevel = getSkillLevel(current_skill_level);

  return (
    <section className={styles.trainingSection}>
      <h2 className={styles.trainingTitle}>Recommended Training Exercises</h2>
      <p className={styles.trainingSubtitle}>Based on your skill level, here are some drills to practice</p>
      
      {categories.map((category) => {
        const images = category.levels[skillLevel] || [];
        if (images.length === 0) {
          return null; // Don't render if no images are found for the level
        }

        return (
          <div key={category.name} className={styles.exerciseContent}>
            <h3 className={styles.exerciseTitle}>
              {category.displayName} - {skillLevel} Level Drills - {recommendedHours[category.name]} Hours
            </h3>
            <div className={styles.exerciseGrid}>
              {images.map((imageName, index) => (
                <div key={imageName} className={styles.exerciseCard}>
                  <div className={styles.exerciseImageWrapper}>
                    <img
                      src={`/images/${imageName}`}
                      alt={`${category.displayName} ${skillLevel} Drill ${index + 1}`}
                      className={styles.exerciseImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>
                  <div className={styles.exerciseInfo}>
                    <h4 className={styles.exerciseCardTitle}>Drill {index + 1}</h4>
                    <p className={styles.exerciseDescription}>
                      {category.displayName} training drill for {skillLevel.toLowerCase()} level players.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}