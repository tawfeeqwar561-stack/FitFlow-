import React, { useState, useEffect, useRef } from 'react';
import './BreathingExercise.css';

const breathingPatterns = [
  {
    id: 'relaxing',
    name: 'Relaxing Breath',
    description: '4-7-8 pattern for deep relaxation',
    icon: '',
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: '#6366f1',
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: '4-4-4 pattern for energy boost',
    icon: '',
    inhale: 4,
    hold: 4,
    exhale: 4,
    color: '#f59e0b',
  },
  {
    id: 'calming',
    name: 'Calming Breath',
    description: '5-5-5 pattern for anxiety relief',
    icon: '',
    inhale: 5,
    hold: 5,
    exhale: 5,
    color: '#10b981',
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4-4-4-4 pattern used by Navy SEALs',
    icon: '📦',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: '#8b5cf6',
  },
];

const BreathingExercise = () => {
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, holdAfter
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startExercise = () => {
    setIsActive(true);
    setCycles(0);
    runPhase('inhale', selectedPattern.inhale);
  };

  const runPhase = (phaseName, duration) => {
    setPhase(phaseName);
    setCountdown(duration);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          nextPhase(phaseName);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextPhase = (currentPhase) => {
    switch (currentPhase) {
      case 'inhale':
        runPhase('hold', selectedPattern.hold);
        break;
      case 'hold':
        runPhase('exhale', selectedPattern.exhale);
        break;
      case 'exhale':
        if (selectedPattern.holdAfter) {
          runPhase('holdAfter', selectedPattern.holdAfter);
        } else {
          completeCycle();
        }
        break;
      case 'holdAfter':
        completeCycle();
        break;
      default:
        break;
    }
  };

  const completeCycle = () => {
    setCycles((prev) => {
      const newCycles = prev + 1;
      if (newCycles >= totalCycles) {
        stopExercise();
        return newCycles;
      }
      runPhase('inhale', selectedPattern.inhale);
      return newCycles;
    });
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCountdown(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
      case 'holdAfter':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Get Ready';
    }
  };

  const getPhaseClass = () => {
    switch (phase) {
      case 'inhale':
        return 'phase-inhale';
      case 'hold':
      case 'holdAfter':
        return 'phase-hold';
      case 'exhale':
        return 'phase-exhale';
      default:
        return '';
    }
  };

  return (
    <div className="breathing-exercise">
      {/* Pattern Selection */}
      {!isActive && (
        <div className="pattern-selection">
          <h3>Choose Breathing Pattern</h3>
          <div className="pattern-grid">
            {breathingPatterns.map((pattern) => (
              <button
                key={pattern.id}
                className={`pattern-card ${selectedPattern.id === pattern.id ? 'active' : ''}`}
                onClick={() => setSelectedPattern(pattern)}
                style={{ '--pattern-color': pattern.color }}
              >
                <span className="pattern-icon">{pattern.icon}</span>
                <h4>{pattern.name}</h4>
                <p>{pattern.description}</p>
                <div className="pattern-timing">
                  <span>In: {pattern.inhale}s</span>
                  <span>Hold: {pattern.hold}s</span>
                  <span>Out: {pattern.exhale}s</span>
                  {pattern.holdAfter && <span>Hold: {pattern.holdAfter}s</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Cycles Selection */}
          <div className="cycles-selection">
            <label>Number of Cycles:</label>
            <div className="cycles-buttons">
              {[3, 5, 7, 10].map((num) => (
                <button
                  key={num}
                  className={`cycle-btn ${totalCycles === num ? 'active' : ''}`}
                  onClick={() => setTotalCycles(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breathing Circle */}
      <div className={`breathing-circle-container ${isActive ? 'active' : ''}`}>
        <div 
          className={`breathing-circle ${getPhaseClass()}`}
          style={{ '--pattern-color': selectedPattern.color }}
        >
          <div className="breathing-inner">
            <span className="breathing-text">{getPhaseText()}</span>
            {isActive && <span className="breathing-countdown">{countdown}</span>}
          </div>
        </div>
        
        {isActive && (
          <div className="cycle-indicator">
            Cycle {cycles + 1} of {totalCycles}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="breathing-controls">
        {!isActive ? (
          <button className="btn btn-primary btn-large" onClick={startExercise}>
             Start Breathing Exercise
          </button>
        ) : (
          <button className="btn btn-danger btn-large" onClick={stopExercise}>
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Benefits */}
      {!isActive && (
        <div className="breathing-benefits">
          <h4> Benefits of Breathing Exercises</h4>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span></span>
              <p>Better Sleep</p>
            </div>
            <div className="benefit-item">
              <span></span>
              <p>Reduced Stress</p>
            </div>
            <div className="benefit-item">
              <span></span>
              <p>Mental Clarity</p>
            </div>
            <div className="benefit-item">
              <span></span>
              <p>Lower Heart Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;