import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import { StarIcon, ChartIcon, MessageCircleIcon } from './Icons'; // Re-importing original Icons
import TrainingDrills from './TrainingDrills'; // Re-importing original TrainingDrills

interface FormData {
    years_of_experience: string;
    years_of_tournament_experience: string;
    win_percentage: string;
    practice_hours_per_week: string;
    bu_drill_1: string;
    bu_drill_2: string;
    bu_drill_3: string;
    bu_drill_4: string;
    bu_drill_5: string;
    bu_drill_6: string;
    bu_drill_7: string;
    bu_drill_8: string;
    bu_total: string;
    fargorate: string;
    table_difficulty: string;
    mental_drills: string;
}

interface PredictionResult {
    current_skill_level: number;
    projected_skill_level: number;
    projected_improvement: number;
    message: string;
    recommended_hours: any;
}

interface TrainingCategory {
    name: string;
    displayName: string;
    levels: {
        [key: string]: string[];
    };
}

export default function App() {
    const [formData, setFormData] = useState<FormData>({
        years_of_experience: '',
        years_of_tournament_experience: '',
        win_percentage: '',
        practice_hours_per_week: '',
        bu_drill_1: '',
        bu_drill_2: '',
        bu_drill_3: '',
        bu_drill_4: '',
        bu_drill_5: '',
        bu_drill_6: '',
        bu_drill_7: '',
        bu_drill_8: '',
        bu_total: '',
        fargorate: '',
        table_difficulty: '',
        mental_drills: '0',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [buTotal, setBuTotal] = useState<number>(0);
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
    const [useFargoRate, setUseFargoRate] = useState<boolean>(true);
    const [isPredictingFargoLr, setIsPredictingFargoLr] = useState<boolean>(false);

    // Effect to calculate BU Total whenever drill scores change
    useEffect(() => {
        const buDrills = [
            formData.bu_drill_1, formData.bu_drill_2, formData.bu_drill_3, formData.bu_drill_4,
            formData.bu_drill_5, formData.bu_drill_6, formData.bu_drill_7, formData.bu_drill_8,
        ];

        const total = buDrills.reduce((sum, current) => {
            const value = typeof current === 'string' && !isNaN(Number(current)) ? Number(current) : 0;
            return sum + value;
        }, 0);

        setFormData(prevFormData => ({
            ...prevFormData,
            bu_total: String(total),
        }));
        setBuTotal(total);
    }, [
        formData.bu_drill_1, formData.bu_drill_2, formData.bu_drill_3, formData.bu_drill_4,
        formData.bu_drill_5, formData.bu_drill_6, formData.bu_drill_7, formData.bu_drill_8,
    ]);

    const categories: TrainingCategory[] = [
        {
            name: 'Ball_Pocketing',
            displayName: 'Ball Pocketing',
            levels: {
                'Beginner': ['Ball_Pocketing_Beginner_1.png', 'Ball_Pocketing_Beginner_2.png', 'Ball_Pocketing_Beginner_3.png'],
                'Intermediate': ['Ball_Pocketing_Intermediate_1.png', 'Ball_Pocketing_Intermediate_2.png', 'Ball_Pocketing_Intermediate_3.png'],
                'Advanced': ['Ball_Pocketing_Advanced_1.png', 'Ball_Pocketing_Advanced_2.png', 'Ball_Pocketing_Advanced_3.png']
            }
        },
        {
            name: 'Cue_Ball_Control',
            displayName: 'Cue Ball Control',
            levels: {
                'Beginner': ['Cue_Ball_Control_Beginner_1.png', 'Cue_Ball_Control_Beginner_2.png', 'Cue_Ball_Control_Beginner_3.png'],
                'Intermediate': ['Cue_Ball_Control_Intermediate_1.png', 'Cue_Ball_Control_Intermediate_2.png', 'Cue_Ball_Control_Intermediate_3.png'],
                'Advanced': ['Cue_Ball_Control_Advanced_1.png', 'Cue_Ball_Control_Advanced_2.png', 'Cue_Ball_Control_Advanced_3.png']
            }
        },
        {
            name: 'Pattern_Play',
            displayName: 'Pattern Play',
            levels: {
                'Beginner': ['Pattern_Play_Beginner_1.png', 'Pattern_Play_Beginner_2.png', 'Pattern_Play_Beginner_3.png'],
                'Intermediate': ['Pattern_Play_Intermediate_1.png', 'Pattern_Play_Intermediate_2.png', 'Pattern_Play_Intermediate_3.png'],
                'Advanced': ['Pattern_Play_Advanced_1.png', 'Pattern_Play_Advanced_2.png', 'Pattern_Play_Advanced_3.png']
            }
        },
        {
            name: 'Stroke_Quality',
            displayName: 'Stroke Quality',
            levels: {
                'Beginner': ['Beginner_Stroke_Quality_1.png', 'Beginner_Stroke_Quality_2.png', 'Beginner_Stroke_Quality_3.png'],
                'Intermediate': ['Stroke_Quality_Intermediate_1.png', 'Stroke_Quality_Intermediate_2.png', 'Stroke_Quality_Intermediate_3.png'],
                'Advanced': ['Stroke_Quality_Advanced_1.png', 'Stroke_Quality_Advanced_2.png', 'Stroke_Quality_Advanced_3.png']
            }
        }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement; // Type assertion
        if (type === 'checkbox') {
            setUseFargoRate(checked);
            if (!checked) {
                setFormData(prev => ({ ...prev, fargorate: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePredictFargoLr = async () => {
        setIsPredictingFargoLr(true);
        setError(null);

        // Ensure all required fields for LR prediction are available
        const requiredLrFields = [
            'years_of_experience', 'years_of_tournament_experience', 'win_percentage',
            'bu_drill_1', 'bu_drill_2', 'bu_drill_3', 'bu_drill_4', 'bu_drill_5',
            'bu_drill_6', 'bu_drill_7', 'bu_drill_8', 'bu_total',
            'table_difficulty', 'mental_drills'
        ];

        // Check if all fields are filled.
        const missingFields = requiredLrFields.filter(field => !formData[field as keyof FormData]);
        if (missingFields.length > 0) {
            setError(`Please fill all fields to predict FargoRate: ${missingFields.join(', ')}`);
            setIsPredictingFargoLr(false);
            return;
        }

        const dataToSend = {
            years_of_experience_playing: Number(formData.years_of_experience) || 0,
            years_of_tournament_experience: Number(formData.years_of_tournament_experience) || 0,
            win_pct_tournaments: (Number(formData.win_percentage) || 0) / 100, // Convert percentage to decimal
            bu_drill_1: Number(formData.bu_drill_1) || 0,
            bu_drill_2: Number(formData.bu_drill_2) || 0,
            bu_drill_3: Number(formData.bu_drill_3) || 0,
            bu_drill_4: Number(formData.bu_drill_4) || 0,
            bu_drill_5: Number(formData.bu_drill_5) || 0,
            bu_drill_6: Number(formData.bu_drill_6) || 0,
            bu_drill_7: Number(formData.bu_drill_7) || 0,
            bu_drill_8: Number(formData.bu_drill_8) || 0,
            bu_total: Number(formData.bu_total) || 0,
            table_difficulty_total: Number(formData.table_difficulty) || 0,
            mental_drills: Number(formData.mental_drills) || 0, // Ensure this is an integer
        };

        try {
            const response = await fetch('http://localhost:5000/predict_fargo_lr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred during LR prediction.');
            }

            const result = await response.json();
            const predictedFargo = result.predicted_fargo_rate_lr;

            setFormData(prev => ({ ...prev, fargorate: String(predictedFargo) }));
            setUseFargoRate(true); // Automatically check the box and use the predicted value

        } catch (err: any) {
            setError(err.message || 'Failed to predict Fargo Rate. Please check the network and server status.');
        } finally {
            setIsPredictingFargoLr(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPredictionResult(null);

        // Prepare data for submission, conditionally including fargorate
        const dataToSend = {
            // Use the fargorate value only if the checkbox is checked, otherwise send 0
            fargorate: useFargoRate ? (Number(formData.fargorate) || 0) : 0,
            bu_total: Number(formData.bu_total) || 0,
            win_percentage: (Number(formData.win_percentage) || 0) / 100, // percentage to decimal
            years_of_experience: Number(formData.years_of_experience) || 0,
            bu_drill_2: Number(formData.bu_drill_2) || 0,
            bu_drill_6: Number(formData.bu_drill_6) || 0,
            bu_drill_7: Number(formData.bu_drill_7) || 0,
            bu_drill_8: Number(formData.bu_drill_8) || 0,
            practice_hours_per_week: Number(formData.practice_hours_per_week) || 0,
            // The `calculate_and_project_skill` function also has optional kwargs for
            // years_of_tournament_experience, table_difficulty_total, mental_drills
            // These are included in dataToSend as they might be used by the backend if fargorate is 0.
            years_of_tournament_experience: Number(formData.years_of_tournament_experience) || 0,
            table_difficulty_total: Number(formData.table_difficulty) || 1, // Default to 1 if not provided, as per backend
            mental_drills: Number(formData.mental_drills) || 0, // Default to 0 if not provided
        };

        try {
            const response = await fetch('http://localhost:5000/calculate_skill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred during communication with the server.');
            }

            const result = await response.json();
            setPredictionResult(result);

        } catch (err: any) {
            setError(err.message || 'Failed to connect to the server. Please check the network and server status.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContentWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Billiard Skill Level Forecast</h1>
                    <p className={styles.subtitle}>Analysis and forecast for improvement of billiard players with the help of a coach</p>
                </header>

                <main>
                    <div className={styles.formSection}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGrid}>
                                {/* Player Info */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="years_of_experience" className={styles.label}>Years of playing billiards</label>
                                    <input type="number" id="years_of_experience" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} className={styles.input} placeholder="e.g. 5" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="years_of_tournament_experience" className={styles.label}>Years of tournament experience</label>
                                    <input type="number" id="years_of_tournament_experience" name="years_of_tournament_experience" value={formData.years_of_tournament_experience} onChange={handleChange} className={styles.input} placeholder="e.g. 2" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="win_percentage" className={styles.label}>% Tournament wins</label>
                                    <input type="number" id="win_percentage" name="win_percentage" min="0" max="100" value={formData.win_percentage} onChange={handleChange} className={styles.input} placeholder="e.g. 65" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="practice_hours_per_week" className={styles.label}>Practice hours per week</label>
                                    <input type="number" id="practice_hours_per_week" min="0" max="60" name="practice_hours_per_week" value={formData.practice_hours_per_week} onChange={handleChange} className={styles.input} placeholder="e.g. 8" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="table_difficulty" className={styles.label}>Table difficulty (0.9-1.1)</label>
                                    <input type="number" id="table_difficulty" min="0.90" max="1.10" step="0.01" name="table_difficulty" value={formData.table_difficulty} onChange={handleChange} className={styles.input} placeholder="0.9 - 1.1" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="mental_drills" className={styles.label}>Mental Drills (0=No, 1=Yes)</label>
                                    <select id="mental_drills" name="mental_drills" value={formData.mental_drills} onChange={handleChange} className={styles.input} required>
                                        <option value="0">0 (No)</option>
                                        <option value="1">1 (Yes)</option>
                                    </select>
                                </div>

                                {/* FargoRate Input and Predict Button */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="fargorate" className={styles.label}>FargoRate Rating</label>
                                    <div className={styles.fargoInputGroup}>
                                        <input
                                            type="number"
                                            min="0" max="900"
                                            step="0.1"
                                            id="fargorate"
                                            name="fargorate"
                                            value={formData.fargorate}
                                            onChange={handleChange}
                                            className={`${styles.input} ${!useFargoRate ? styles.disabled : ''}`}
                                            placeholder="Enter rating"
                                            disabled={!useFargoRate}
                                            required={useFargoRate}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePredictFargoLr}
                                    disabled={isPredictingFargoLr}
                                    className={styles.predictFargoButton}
                                >
                                    {isPredictingFargoLr ? 'Predicting...' : 'Predict FargoRate'}
                                </button>
                            </div>

                            <h3 className={styles.sectionTitle}>Drill Scores</h3>
                            <div className={styles.formGrid}> {/* Reusing formGrid for drills */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_1" className={styles.label}>BU Drill 1 (max 10)</label>
                                    <input type="number" id="bu_drill_1" name="bu_drill_1" value={formData.bu_drill_1} onChange={handleChange} className={styles.input} min="0" max="10" placeholder="max 10" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_2" className={styles.label}>BU Drill 2 (max 10)</label>
                                    <input type="number" id="bu_drill_2" name="bu_drill_2" value={formData.bu_drill_2} onChange={handleChange} className={styles.input} min="0" max="10" placeholder="max 10" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_3" className={styles.label}>BU Drill 3 (max 10)</label>
                                    <input type="number" id="bu_drill_3" name="bu_drill_3" value={formData.bu_drill_3} onChange={handleChange} className={styles.input} min="0" max="10" placeholder="max 10" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_4" className={styles.label}>BU Drill 4 (max 10)</label>
                                    <input type="number" id="bu_drill_4" name="bu_drill_4" value={formData.bu_drill_4} onChange={handleChange} className={styles.input} min="0" max="10" placeholder="max 10" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_5" className={styles.label}>BU Drill 5 (max 10)</label>
                                    <input type="number" id="bu_drill_5" name="bu_drill_5" value={formData.bu_drill_5} onChange={handleChange} className={styles.input} min="0" max="10" placeholder="max 10" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_6" className={styles.label}>BU Drill 6 (max 10)</label>
                                    <input type="number" id="bu_drill_6" name="bu_drill_6" value={formData.bu_drill_6} onChange={handleChange} className={styles.input} min="0" max="10" placeholder="max 10" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_7" className={styles.label}>BU Drill 7 (max 20)</label>
                                    <input type="number" id="bu_drill_7" name="bu_drill_7" value={formData.bu_drill_7} onChange={handleChange} className={styles.input} min="0" max="20" placeholder="max 20" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="bu_drill_8" className={styles.label}>BU Drill 8 (max 20)</label>
                                    <input type="number" id="bu_drill_8" name="bu_drill_8" value={formData.bu_drill_8} onChange={handleChange} className={styles.input} min="0" max="20" placeholder="max 20" required />
                                </div>
                            </div>

                            <div className={styles.buttonWrapper}>
                                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                                    {isLoading ? 'Analyzing...' : 'Make a prediction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                {(isLoading || isPredictingFargoLr) && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>{isLoading ? 'Please wait. The model is processing your data...' : 'Predicting Fargo Rate...'}</p>
                    </div>
                )}

                {error && <div className={styles.errorBox}>{error}</div>}

                {predictionResult && (
                    <>
                        <section className={styles.resultsSection}>
                            <h2 className={styles.resultsTitle}>Your Personal Analysis</h2>
                            <h2 className={styles.resultsTitle}>Total BU Drills Score: <span style={{ color: '#4ade80' }}>{buTotal}</span></h2>

                            <div className={styles.resultsGrid}>
                                <div className={styles.resultCard}>
                                    <h3 className={styles.cardTitle}><StarIcon />Current Skill Level</h3>
                                    <p className={styles.resultValue}>{predictionResult.current_skill_level}<span className={styles.resultUnit}> / 10</span></p>
                                </div>
                                <div className={styles.resultCard}>
                                    <h3 className={styles.cardTitle}><ChartIcon />Projected Improvement</h3>
                                    <p className={styles.resultValue}>{predictionResult.projected_improvement}<span className={styles.resultUnit}> level(s)</span></p>
                                </div>
                                <div className={`${styles.resultCard} ${styles.resultCardColSpan2}`}>
                                    <h3 className={styles.cardTitle}><MessageCircleIcon />Personalized Message</h3>
                                    <p style={{ color: '#cbd5e1' }} className="text-center">{predictionResult.message}</p>
                                </div>
                            </div>
                        </section>

                        <TrainingDrills
                            current_skill_level={predictionResult.current_skill_level}
                            categories={categories}
                            recommendedHours={predictionResult.recommended_hours}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
