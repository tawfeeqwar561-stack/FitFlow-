import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/common/Navbar';
import Loader from './components/common/Loader';

// Pages
import Home       from './pages/Home';
import Login      from './pages/Login';
import Signup     from './pages/Signup';
import Dashboard  from './pages/Dashboard';
import Workouts   from './pages/Workouts';
import Mindfulness from './pages/Mindfulness';
import Calories   from './pages/Calories';
import Medical    from './pages/Medical';       // ✅ ADD THIS

// Styles
import './styles/main.css';

// ── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user)   return <Navigate to="/login" />;

  return children;
};

// ── App Routes ────────────────────────────────────────────────────────────────
const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/"       element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workouts/:level"
          element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mindfulness"
          element={
            <ProtectedRoute>
              <Mindfulness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calories"
          element={
            <ProtectedRoute>
              <Calories />
            </ProtectedRoute>
          }
        />

        {/* ✅ Medical Route */}
        <Route
          path="/medical"
          element={
            <ProtectedRoute>
              <Medical />
            </ProtectedRoute>
          }
        />

        {/* Catch all → redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;