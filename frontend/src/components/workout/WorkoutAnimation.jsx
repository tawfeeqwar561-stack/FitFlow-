import React from 'react';
import './WorkoutAnimation.css';

// ── Each exercise gets its own CSS animation class ────────────────────────────
const getAnimationClass = (exerciseName) => {
  const name = exerciseName.toLowerCase();
  if (name.includes('push'))            return 'anim-pushup';
  if (name.includes('squat'))           return 'anim-squat';
  if (name.includes('plank'))           return 'anim-plank';
  if (name.includes('jumping'))         return 'anim-jumping-jack';
  if (name.includes('lunge'))           return 'anim-lunge';
  if (name.includes('mountain'))        return 'anim-mountain-climber';
  if (name.includes('burpee'))          return 'anim-burpee';
  if (name.includes('bicycle'))         return 'anim-bicycle';
  if (name.includes('crunch'))          return 'anim-bicycle';
  if (name.includes('box jump'))        return 'anim-jumping-jack';
  if (name.includes('dragon'))          return 'anim-plank';
  if (name.includes('pistol'))          return 'anim-squat';
  if (name.includes('archer'))          return 'anim-pushup';
  if (name.includes('hanging'))         return 'anim-hanging';
  if (name.includes('bulgarian'))       return 'anim-lunge';
  if (name.includes('side plank'))      return 'anim-plank';
  if (name.includes('diamond'))         return 'anim-pushup';
  return 'anim-jumping-jack';           // default
};

// ── SVG Stick Figure Components ───────────────────────────────────────────────

// Push Up Figure
const PushUpFigure = ({ paused }) => (
  <svg viewBox="0 0 120 100" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="pushup-body">
      {/* Head */}
      <circle cx="90" cy="22" r="10" fill="#6366f1" />
      {/* Body */}
      <line x1="90" y1="32" x2="55" y2="50" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Left Arm */}
      <line x1="80" y1="38" x2="90" y2="60" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Right Arm */}
      <line x1="65" y1="44" x2="55" y2="60" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Legs */}
      <line x1="55" y1="50" x2="30" y2="55" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="30" y1="55" x2="15" y2="58" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Ground hands */}
      <circle cx="90" cy="62" r="4" fill="#8b5cf6"/>
      <circle cx="55" cy="62" r="4" fill="#8b5cf6"/>
      {/* Ground feet */}
      <circle cx="15" cy="60" r="4" fill="#8b5cf6"/>
    </g>
  </svg>
);

// Squat Figure
const SquatFigure = ({ paused }) => (
  <svg viewBox="0 0 100 120" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="squat-body">
      {/* Head */}
      <circle cx="50" cy="18" r="10" fill="#6366f1" />
      {/* Body */}
      <line x1="50" y1="28" x2="50" y2="58" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Arms out */}
      <line x1="50" y1="38" x2="20" y2="48" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="38" x2="80" y2="48" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Upper legs */}
      <line x1="50" y1="58" x2="30" y2="82" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="58" x2="70" y2="82" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Lower legs */}
      <line x1="30" y1="82" x2="25" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="70" y1="82" x2="75" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Feet */}
      <line x1="18" y1="108" x2="32" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="68" y1="108" x2="82" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// Plank Figure
const PlankFigure = ({ paused }) => (
  <svg viewBox="0 0 140 80" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="plank-body">
      {/* Head */}
      <circle cx="118" cy="28" r="10" fill="#6366f1" />
      {/* Body straight */}
      <line x1="108" y1="32" x2="30" y2="52" stroke="#6366f1" strokeWidth="5" strokeLinecap="round"/>
      {/* Arms */}
      <line x1="95" y1="36" x2="95" y2="60" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="70" y1="42" x2="70" y2="60" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Forearms on ground */}
      <line x1="82" y1="60" x2="108" y2="60" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Feet */}
      <circle cx="25" cy="54" r="5" fill="#8b5cf6"/>
      <circle cx="35" cy="54" r="5" fill="#8b5cf6"/>
    </g>
  </svg>
);

// Jumping Jack Figure
const JumpingJackFigure = ({ paused }) => (
  <svg viewBox="0 0 120 130" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="jack-body">
      {/* Head */}
      <circle cx="60" cy="18" r="11" fill="#6366f1" />
      {/* Body */}
      <line x1="60" y1="29" x2="60" y2="72" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Arms up */}
      <line x1="60" y1="42" x2="18" y2="20" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="60" y1="42" x2="102" y2="20" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Hands */}
      <circle cx="16" cy="19" r="4" fill="#8b5cf6"/>
      <circle cx="104" cy="19" r="4" fill="#8b5cf6"/>
      {/* Legs apart */}
      <line x1="60" y1="72" x2="28" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="60" y1="72" x2="92" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Feet */}
      <line x1="20" y1="108" x2="36" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="84" y1="108" x2="100" y2="108" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// Lunge Figure
const LungeFigure = ({ paused }) => (
  <svg viewBox="0 0 130 120" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="lunge-body">
      {/* Head */}
      <circle cx="75" cy="18" r="10" fill="#6366f1" />
      {/* Body */}
      <line x1="75" y1="28" x2="70" y2="62" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Arms */}
      <line x1="72" y1="42" x2="45" y2="55" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="72" y1="42" x2="99" y2="55" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Front leg (bent) */}
      <line x1="70" y1="62" x2="90" y2="85" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="90" y1="85" x2="95" y2="112" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Back leg (extended) */}
      <line x1="70" y1="62" x2="40" y2="80" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="40" y1="80" x2="25" y2="112" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Feet */}
      <line x1="88" y1="112" x2="108" y2="112" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="15" y1="112" x2="35" y2="112" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// Mountain Climber Figure
const MountainClimberFigure = ({ paused }) => (
  <svg viewBox="0 0 140 90" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="climber-body">
      {/* Head */}
      <circle cx="118" cy="22" r="10" fill="#6366f1" />
      {/* Body */}
      <line x1="108" y1="28" x2="60" y2="48" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Arms straight */}
      <line x1="95" y1="35" x2="95" y2="62" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="75" y1="42" x2="75" y2="62" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Hands on ground */}
      <line x1="82" y1="62" x2="108" y2="62" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Legs alternating */}
      <line x1="60" y1="48" x2="40" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="40" y1="30" x2="35" y2="18" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="60" y1="48" x2="30" y2="65" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="30" y1="65" x2="15" y2="68" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// Hanging Figure
const HangingFigure = ({ paused }) => (
  <svg viewBox="0 0 100 140" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="hanging-body">
      {/* Bar */}
      <line x1="10" y1="10" x2="90" y2="10" stroke="#374151" strokeWidth="6" strokeLinecap="round"/>
      {/* Arms up */}
      <line x1="38" y1="10" x2="38" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="62" y1="10" x2="62" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Hands */}
      <circle cx="38" cy="12" r="5" fill="#8b5cf6"/>
      <circle cx="62" cy="12" r="5" fill="#8b5cf6"/>
      {/* Head */}
      <circle cx="50" cy="40" r="11" fill="#6366f1" />
      {/* Body */}
      <line x1="50" y1="51" x2="50" y2="90" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Arms to bar */}
      <line x1="50" y1="60" x2="38" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="60" x2="62" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Legs raised */}
      <line x1="50" y1="90" x2="35" y2="118" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="90" x2="65" y2="118" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// Bicycle Crunch Figure
const BicycleFigure = ({ paused }) => (
  <svg viewBox="0 0 130 100" className={`figure ${paused ? 'paused' : ''}`}>
    <g className="bicycle-body">
      {/* Head on ground */}
      <circle cx="105" cy="35" r="10" fill="#6366f1" />
      {/* Body reclined */}
      <line x1="95" y1="40" x2="45" y2="55" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Arms behind head */}
      <line x1="95" y1="42" x2="112" y2="28" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="95" y1="42" x2="115" y2="48" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      {/* Legs cycling */}
      <line x1="45" y1="55" x2="25" y2="38" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="25" y1="38" x2="12" y2="30" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="45" y1="55" x2="30" y2="78" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
      <line x1="30" y1="78" x2="15" y2="85" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>
);

// ── Figure Selector ───────────────────────────────────────────────────────────
const getFigure = (exerciseName, paused) => {
  const name = exerciseName.toLowerCase();
  if (name.includes('push') || name.includes('archer') || name.includes('diamond'))
    return <PushUpFigure paused={paused} />;
  if (name.includes('squat') || name.includes('pistol'))
    return <SquatFigure paused={paused} />;
  if (name.includes('plank') || name.includes('dragon'))
    return <PlankFigure paused={paused} />;
  if (name.includes('jumping') || name.includes('burpee') || name.includes('box'))
    return <JumpingJackFigure paused={paused} />;
  if (name.includes('lunge') || name.includes('bulgarian'))
    return <LungeFigure paused={paused} />;
  if (name.includes('mountain'))
    return <MountainClimberFigure paused={paused} />;
  if (name.includes('hanging'))
    return <HangingFigure paused={paused} />;
  if (name.includes('bicycle') || name.includes('crunch'))
    return <BicycleFigure paused={paused} />;
  return <JumpingJackFigure paused={paused} />;
};

// ── Main Component ────────────────────────────────────────────────────────────
const WorkoutAnimation = ({ exerciseName, isRunning }) => {
  const animClass = getAnimationClass(exerciseName);

  return (
    <div className={`workout-animation-wrap ${animClass} ${!isRunning ? 'paused' : ''}`}>
      {getFigure(exerciseName, !isRunning)}
      <div className="animation-ground" />
      {isRunning && (
        <div className="animation-particles">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
};

export default WorkoutAnimation;