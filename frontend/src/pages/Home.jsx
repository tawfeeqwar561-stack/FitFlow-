import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  // ✅ ADDED: Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ✅ FIXED: Added icons (were empty strings before)
  const features = [
    {
      icon: '',
      title: 'Workout Training',
      description: 'Beginner to Advanced exercises with guided routines',
      color: '#10b981',
    },
    {
      icon: '',
      title: 'AI Calorie Detection',
      description: 'Take a photo of your food and get instant calorie info',
      color: '#f97316',
    },
    {
      icon: '',
      title: 'Medical Tracking',
      description: 'Track symptoms and get doctor recommendations',
      color: '#3b82f6',
    },
    {
      icon: '',
      title: 'Mindfulness',
      description: 'Meditation timer and relaxation exercises',
      color: '#8b5cf6',
    },
  ];

  return (
    <div className={`home ${visible ? 'visible' : ''}`}>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content animate-fadeIn">
          <div className="hero-badge"> AI-Powered Fitness</div>

          <h1 className="hero-title">
            Transform Your Body with{' '}
            <span className="text-gradient">FitFlow</span>
          </h1>

          <p className="hero-subtitle">
            AI-powered fitness app for workouts, nutrition tracking,
            and health monitoring — all in one place.
          </p>

          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Go to Dashboard →
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                Get Started Free 
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Login
              </Link>
            </div>
          )}

          {/* ✅ ADDED: Quick stats row */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">4+</span>
              <span className="stat-label">Health Modules</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Food Detection</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">Free</span>
              <span className="stat-label">To Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────── */}
      <section className="features">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">
          One app for your complete health and fitness journey
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card animate-fadeIn"
              style={{
                animationDelay: `${index * 0.1}s`,  // ✅ stagger animation
                '--feature-color': feature.color,
              }}
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────── */}
      {!user && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join FitFlow today — it's completely free</p>
            <Link to="/signup" className="btn btn-primary btn-large">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;