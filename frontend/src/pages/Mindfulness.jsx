import React, { useState } from 'react';
import MeditationTimer from '../components/mindfulness/MeditationTimer';
import BreathingExercise from '../components/mindfulness/BreathingExercise';
import QuotesSection from '../components/mindfulness/QuotesSection';
import './Mindfulness.css';

const Mindfulness = () => {
  const [activeTab, setActiveTab] = useState('meditation');

  const tabs = [
    { id: 'meditation', label: 'Meditation', icon: '' },
    { id: 'breathing', label: 'Breathing', icon: '' },
    { id: 'quotes', label: 'Quotes', icon: '' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'meditation':
        return <MeditationTimer />;
      case 'breathing':
        return <BreathingExercise />;
      case 'quotes':
        return <QuotesSection />;
      default:
        return <MeditationTimer />;
    }
  };

  return (
    <div className="mindfulness-page">
      <div className="container">
        {/* Header */}
        <div className="mindfulness-header">
          <h1> Mindfulness</h1>
          <p>Relax your mind, body, and soul</p>
        </div>

        {/* Tabs */}
        <div className="mindfulness-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mindfulness-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;