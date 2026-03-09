import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const workoutLevels = [
    {
      title: 'Beginner',
      description: 'Perfect for those starting their fitness journey',
      icon: '',
      color: '#10b981',
      path: '/workouts/beginner',
    },
    {
      title: 'Intermediate',
      description: 'For those with some fitness experience',
      icon: '',
      color: '#f59e0b',
      path: '/workouts/intermediate',
    },
    {
      title: 'Advanced',
      description: 'Challenge yourself with intense workouts',
      icon: '',
      color: '#ef4444',
      path: '/workouts/advanced',
    },
    {
      title: 'Mindfulness',
      description: 'Meditation and relaxation exercises',
      icon: '',
      color: '#8b5cf6',
      path: '/mindfulness',
    },
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.email?.split('@')[0] || 'User'}! </h1>
          <p>Choose your workout level to get started</p>
        </div>

        <div className="workout-levels">
          {workoutLevels.map((level) => (
            <Link
              to={level.path}
              key={level.title}
              className="level-card"
              style={{ '--card-color': level.color }}
            >
              <span className="level-icon">{level.icon}</span>
              <h2 className="level-title">{level.title}</h2>
              <p className="level-description">{level.description}</p>
              <span className="level-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/calories" className="action-card">
              <span className="action-icon"></span>
              <span>Track Calories</span>
            </Link>
            <Link to="/medical" className="action-card">
              <span className="action-icon"></span>
              <span>Medical Tracker</span>
            </Link>
            <Link to="/history" className="action-card">
              <span className="action-icon"></span>
              <span>View History</span>
            </Link>
            <Link to="/profile" className="action-card">
              <span className="action-icon"></span>
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;