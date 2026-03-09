import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import workoutService from '../services/workoutService';
import useTimer from '../hooks/useTimer';
import Loader from '../components/common/Loader';
import './Workouts.css';

const exerciseData = {
  beginner: [
    { id: 1, name: 'Push Ups', category: 'Chest', duration: 60, reps: 10 },
    { id: 2, name: 'Squats', category: 'Legs', duration: 60, reps: 15 },
    { id: 3, name: 'Plank', category: 'Core', duration: 30, reps: null },
    { id: 4, name: 'Jumping Jacks', category: 'Cardio', duration: 60, reps: 20 },
    { id: 5, name: 'Lunges', category: 'Legs', duration: 60, reps: 10 },
    { id: 6, name: 'Mountain Climbers', category: 'Core', duration: 45, reps: null },
  ],
  intermediate: [
    { id: 7, name: 'Diamond Push Ups', category: 'Chest', duration: 60, reps: 15 },
    { id: 8, name: 'Jump Squats', category: 'Legs', duration: 60, reps: 20 },
    { id: 9, name: 'Side Plank', category: 'Core', duration: 45, reps: null },
    { id: 10, name: 'Burpees', category: 'Cardio', duration: 60, reps: 15 },
    { id: 11, name: 'Walking Lunges', category: 'Legs', duration: 60, reps: 15 },
    { id: 12, name: 'Bicycle Crunches', category: 'Core', duration: 60, reps: 20 },
  ],
  advanced: [
    { id: 13, name: 'Archer Push Ups', category: 'Chest', duration: 60, reps: 20 },
    { id: 14, name: 'Pistol Squats', category: 'Legs', duration: 60, reps: 10 },
    { id: 15, name: 'Dragon Flag', category: 'Core', duration: 45, reps: 8 },
    { id: 16, name: 'Box Jumps', category: 'Cardio', duration: 60, reps: 20 },
    { id: 17, name: 'Bulgarian Split Squats', category: 'Legs', duration: 60, reps: 12 },
    { id: 18, name: 'Hanging Leg Raises', category: 'Core', duration: 60, reps: 15 },
  ],
};

const categoryIcons = {
  Chest: '',
  Legs: '',
  Core: '',
  Cardio: '',
  Back: '',
  Shoulder: '',
  Arms: '',
};

const Workouts = () => {
  const { level } = useParams();
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const { seconds, isRunning, start, pause, reset, formatTime } = useTimer();

  useEffect(() => {
    loadExercises();
  }, [level]);

  const loadExercises = () => {
    setLoading(true);
    // Using local data for now
    const data = exerciseData[level] || [];
    setExercises(data);
    setLoading(false);
  };

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsWorkoutActive(true);
    reset();
    start();
  };

  const completeExercise = () => {
    pause();
    setCompletedExercises([...completedExercises, selectedExercise.id]);
    setIsWorkoutActive(false);
    setSelectedExercise(null);
    reset();
  };

  const cancelExercise = () => {
    pause();
    setIsWorkoutActive(false);
    setSelectedExercise(null);
    reset();
  };

  const getLevelTitle = () => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getLevelColor = () => {
    switch (level) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#4f46e5';
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="workouts-page">
      <div className="container">
        <div className="workouts-header" style={{ '--level-color': getLevelColor() }}>
          <h1>{getLevelTitle()} Workouts</h1>
          <p>Complete these exercises to build strength and endurance</p>
          <div className="progress-info">
            <span>Completed: {completedExercises.length} / {exercises.length}</span>
          </div>
        </div>

        {/* Active Workout Modal */}
        {isWorkoutActive && selectedExercise && (
          <div className="workout-modal-overlay">
            <div className="workout-modal">
              <div className="workout-modal-header">
                <span className="exercise-category-icon">
                  {categoryIcons[selectedExercise.category]}
                </span>
                <h2>{selectedExercise.name}</h2>
                <p>{selectedExercise.category}</p>
              </div>

              <div className="timer-display">
                <span className="timer-value">{formatTime()}</span>
                <p className="timer-label">Time Elapsed</p>
              </div>

              {selectedExercise.reps && (
                <div className="reps-info">
                  <span className="reps-value">{selectedExercise.reps}</span>
                  <span className="reps-label">Reps</span>
                </div>
              )}

              <div className="workout-modal-actions">
                {isRunning ? (
                  <button onClick={pause} className="btn btn-warning">
                    ⏸ Pause
                  </button>
                ) : (
                  <button onClick={start} className="btn btn-primary">
                    ▶ Resume
                  </button>
                )}
                <button onClick={completeExercise} className="btn btn-secondary">
                   Complete
                </button>
                <button onClick={cancelExercise} className="btn btn-danger">
                   Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="exercises-grid">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`exercise-card ${
                completedExercises.includes(exercise.id) ? 'completed' : ''
              }`}
            >
              <div className="exercise-icon">
                {categoryIcons[exercise.category] || '🏃'}
              </div>
              <div className="exercise-info">
                <h3>{exercise.name}</h3>
                <p className="exercise-category">{exercise.category}</p>
                <div className="exercise-meta">
                  <span>⏱ {exercise.duration}s</span>
                  {exercise.reps && <span> {exercise.reps} reps</span>}
                </div>
              </div>
              <button
                onClick={() => startExercise(exercise)}
                className="btn btn-primary"
                disabled={completedExercises.includes(exercise.id)}
              >
                {completedExercises.includes(exercise.id) ? ' Done' : 'Start'}
              </button>
            </div>
          ))}
        </div>

        {/* Start All Button */}
        {exercises.length > 0 && completedExercises.length < exercises.length && (
          <div className="start-all-section">
            <button
              onClick={() => startExercise(exercises.find(e => !completedExercises.includes(e.id)))}
              className="btn btn-primary btn-large"
            >
               Start Next Exercise
            </button>
          </div>
        )}

        {/* Completion Message */}
        {completedExercises.length === exercises.length && exercises.length > 0 && (
          <div className="completion-message">
            <h2> Congratulations!</h2>
            <p>You've completed all {level} exercises!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;