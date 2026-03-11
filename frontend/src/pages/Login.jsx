import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login, user, loading: authLoading } = useAuth();
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
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true }); // ✅ replace: true prevents
    } catch (err) {                               //    back-button to login
      setError(
        err.response?.data?.detail ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Don't flash login form while checking auth
  if (authLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="auth-title">Welcome Back </h1>
        <p className="auth-subtitle">Login to continue your fitness journey</p>

        {/* ✅ Error Message */}
        {error && (
          <div className="auth-error">
             {error}
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
              autoComplete="email"           // ✅ ADDED: browser autofill
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
              placeholder="Enter your password"
              autoComplete="current-password" // ✅ ADDED: browser autofill
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup">Sign Up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;