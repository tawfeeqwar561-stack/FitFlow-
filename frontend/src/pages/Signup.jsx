import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');  // ✅ ADDED
  const [loading, setLoading]               = useState(false);

  const { signup, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ ADDED: Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ── Client-side validation ──────────────────────────────
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // ✅ ADDED: Basic email format check
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);

      // ✅ FIXED: Show success message before redirecting
      //           User now knows WHY they're being sent to login
      setSuccess('Account created! Redirecting to login...');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);                                // ✅ 1.5s so user sees message

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Don't flash signup form while checking auth
  if (authLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="auth-title">Create Account </h1>
        <p className="auth-subtitle">Start your fitness journey today</p>

        {/* ✅ Error Message */}
        {error && (
          <div className="auth-error">
             {error}
          </div>
        )}

        {/* ✅ ADDED: Success Message */}
        {success && (
          <div className="auth-success">
             {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"            // ✅ ADDED
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 chars)"
              autoComplete="new-password"     // ✅ ADDED
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"     // ✅ ADDED
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !!success}   // ✅ disable after success too
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;