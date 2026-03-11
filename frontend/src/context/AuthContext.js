import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Check auth on mount ─────────────────────────────────────────────────────
  // ✅ useCallback so checkAuth is stable (no re-render loop)
  const checkAuth = useCallback(async () => {
    if (!authService.isLoggedIn()) {       // ✅ now exists in authService
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser(); // ✅ now exists
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      // ✅ Token expired or invalid — clear it
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);                   // ✅ always runs, even on error
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    // ✅ FIXED: Added try/catch — was crashing silently before
    try {
      const response = await authService.login(email, password);

      // ✅ Token is stored inside authService.login() now
      //    Fetch user data after successful login
      const userData = await authService.getCurrentUser();
      setUser(userData);

      return response;
    } catch (error) {
      // ✅ Re-throw so Login page can show error message
      throw error;
    }
  };

  // ── Signup ──────────────────────────────────────────────────────────────────
  const signup = async (email, password) => {
    try {
      const response = await authService.signup(email, password);
      // ✅ Don't auto-login after signup
      //    Let user verify email or login manually
      return response;
    } catch (error) {
      throw error;
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // ── Context Value ───────────────────────────────────────────────────────────
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,                             // ✅ expose for manual refresh if needed
    isAuthenticated: !!user,               // ✅ convenience boolean
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};