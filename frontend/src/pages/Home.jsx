import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your Body with <span>FitFlow</span>
          </h1>
          <p className="hero-subtitle">
            AI-powered fitness app for workouts, nutrition tracking, and health monitoring
          </p>
          
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Go to Dashboard
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
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon"></span>
            <h3>Workout Training</h3>
            <p>Beginner to Advanced exercises with guided routines</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon"></span>
            <h3>AI Calorie Detection</h3>
            <p>Take a photo of your food and get instant calorie info</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon"></span>
            <h3>Medical Tracking</h3>
            <p>Track symptoms and get doctor recommendations</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon"></span>
            <h3>Mindfulness</h3>
            <p>Meditation timer and relaxation exercises</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;