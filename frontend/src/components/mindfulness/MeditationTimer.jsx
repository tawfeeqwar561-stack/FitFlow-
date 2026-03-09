import React, { useState, useEffect, useRef } from 'react';
import './MeditationTimer.css';

const ambientSounds = [
  { id: 'rain', name: 'Rain', icon: '', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
  { id: 'forest', name: 'Forest', icon: '', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
  { id: 'ocean', name: 'Ocean', icon: '', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
  { id: 'fire', name: 'Fireplace', icon: '', url: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3' },
  { id: 'wind', name: 'Wind', icon: '', url: 'https://assets.mixkit.co/sfx/preview/mixkit-blizzard-cold-wind-1153.mp3' },
  { id: 'none', name: 'Silence', icon: '', url: null },
];

const presetDurations = [
  { label: '1 min', value: 60 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '30 min', value: 1800 },
];

const MeditationTimer = () => {
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSound, setSelectedSound] = useState(ambientSounds[0]);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startTimer = () => {
    setIsRunning(true);
    setIsComplete(false);

    // Start ambient sound
    if (selectedSound.url) {
      audioRef.current = new Audio(selectedSound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) audioRef.current.pause();
  };

  const resumeTimer = () => {
    setIsRunning(true);
    if (audioRef.current) audioRef.current.play().catch(console.error);
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const completeSession = () => {
    setIsRunning(false);
    setIsComplete(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Play completion sound
    const completionSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    completionSound.play().catch(console.error);
  };

  const selectDuration = (value) => {
    setDuration(value);
    setTimeLeft(value);
    setIsComplete(false);
  };

  const selectSound = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedSound(sound);
    
    if (isRunning && sound.url) {
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="meditation-timer">
      {/* Timer Display */}
      <div className="timer-container">
        <div className="timer-circle" style={{ '--progress': `${progress}%` }}>
          <div className="timer-inner">
            <span className="timer-time">{formatTime(timeLeft)}</span>
            <span className="timer-label">
              {isComplete ? 'Complete! ' : isRunning ? 'Breathe...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      {!isRunning && !isComplete && (
        <div className="duration-selection">
          <h3>Select Duration</h3>
          <div className="duration-grid">
            {presetDurations.map((preset) => (
              <button
                key={preset.value}
                className={`duration-btn ${duration === preset.value ? 'active' : ''}`}
                onClick={() => selectDuration(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sound Selection */}
      <div className="sound-selection">
        <h3>Ambient Sound</h3>
        <div className="sound-grid">
          {ambientSounds.map((sound) => (
            <button
              key={sound.id}
              className={`sound-btn ${selectedSound.id === sound.id ? 'active' : ''}`}
              onClick={() => selectSound(sound)}
            >
              <span className="sound-icon">{sound.icon}</span>
              <span className="sound-name">{sound.name}</span>
            </button>
          ))}
        </div>
        
        {/* Volume Control */}
        {selectedSound.url && (
          <div className="volume-control">
            <span></span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="timer-controls">
        {!isRunning && !isComplete && (
          <button className="btn btn-primary btn-large" onClick={startTimer}>
             Start Meditation
          </button>
        )}
        
        {isRunning && (
          <>
            <button className="btn btn-warning btn-large" onClick={pauseTimer}>
              ⏸ Pause
            </button>
            <button className="btn btn-danger" onClick={resetTimer}>
              ⏹ Stop
            </button>
          </>
        )}
        
        {!isRunning && timeLeft < duration && !isComplete && (
          <>
            <button className="btn btn-primary btn-large" onClick={resumeTimer}>
              ▶ Resume
            </button>
            <button className="btn btn-ghost" onClick={resetTimer}>
               Reset
            </button>
          </>
        )}
        
        {isComplete && (
          <button className="btn btn-primary btn-large" onClick={resetTimer}>
             Start Again
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="meditation-tips">
        <h4> Tips for Better Meditation</h4>
        <ul>
          <li>Find a quiet, comfortable place</li>
          <li>Sit in a relaxed position</li>
          <li>Focus on your breath</li>
          <li>Let thoughts pass without judgment</li>
        </ul>
      </div>
    </div>
  );
};

export default MeditationTimer;