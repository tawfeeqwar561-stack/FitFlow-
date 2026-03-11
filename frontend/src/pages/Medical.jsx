import React, { useState } from 'react';
import MedicalChatbot from '../components/medical/MedicalChatbot';
import MedicationTracker from '../components/medical/MedicationTracker';
import './Medical.css';

const TABS = [
  { id: 'chatbot',     label: ' AI Assistant',       desc: 'Symptom analysis & exercise tips' },
  { id: 'medications', label: ' Medication Tracker',  desc: 'Track & manage your medications' },
];

const Medical = () => {
  const [activeTab, setActiveTab] = useState('chatbot');

  return (
    <div className="medical-page">
      <div className="container">

        {/* ── Page Header ── */}
        <div className="medical-header">
          <div className="medical-header-text">
            <h1> Medical Dashboard</h1>
            <p>
              AI-powered symptom analysis, doctor recommendations,
              exercise guidance and medication tracking — all in one place.
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="medical-info-cards">
            <div className="info-card">
              <span className="info-card-icon"></span>
              <div>
                <strong>Gemini AI</strong>
                <p>Powered assistant</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-card-icon">⚕️</span>
              <div>
                <strong>Not a Doctor</strong>
                <p>Always consult professionals</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-card-icon"></span>
              <div>
                <strong>Private</strong>
                <p>Your data is secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="medical-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`medical-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
              <span className="tab-desc">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="medical-content">

          {/* ── Chatbot Tab ── */}
          {activeTab === 'chatbot' && (
            <div className="tab-panel">
              <div className="tab-panel-header">
                <h2> Medical AI Assistant</h2>
                <p>
                  Describe your workout symptoms and get instant doctor
                  recommendations and safe exercise guidance.
                </p>
              </div>

              {/* How it works steps */}
              <div className="how-it-works">
                <div className="step-card">
                  <div className="step-num">1</div>
                  <div>
                    <strong>Describe Symptoms</strong>
                    <p>Tell the AI about pain or discomfort during workouts</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step-card">
                  <div className="step-num">2</div>
                  <div>
                    <strong>Get Doctor Suggestion</strong>
                    <p>AI recommends which specialist to consult</p>
                  </div>
                </div>
                <div className="step-arrow">→</div>
                <div className="step-card">
                  <div className="step-num">3</div>
                  <div>
                    <strong>Exercise Tips</strong>
                    <p>Get safe exercises and recovery advice</p>
                  </div>
                </div>
              </div>

              {/* Chatbot Component */}
              <MedicalChatbot />
            </div>
          )}

          {/* ── Medications Tab ── */}
          {activeTab === 'medications' && (
            <div className="tab-panel">
              <div className="tab-panel-header">
                <h2> Medication Tracker</h2>
                <p>
                  Keep track of all your medications, dosages, frequencies
                  and prescribed doctors in one place.
                </p>
              </div>

              {/* Medication Tips Banner */}
              <div className="med-tips-banner">
                <div className="med-tip-item">
                  <span></span>
                  <span>Take medications at the same time each day</span>
                </div>
                <div className="med-tip-item">
                  <span></span>
                  <span>Take most medications with a full glass of water</span>
                </div>
                <div className="med-tip-item">
                  <span></span>
                  <span>Check if medications should be taken with food</span>
                </div>
                <div className="med-tip-item">
                  <span></span>
                  <span>Never stop medications without consulting your doctor</span>
                </div>
              </div>

              {/* Medication Tracker Component */}
              <MedicationTracker />
            </div>
          )}

        </div>

        {/* ── Bottom Disclaimer ── */}
        <div className="medical-disclaimer">
          <p>
             <strong>Medical Disclaimer:</strong> FitFlow's medical features
            are for informational purposes only and do not constitute medical advice,
            diagnosis or treatment. Always seek the advice of your physician or other
            qualified health provider with any questions you may have regarding a
            medical condition.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Medical;