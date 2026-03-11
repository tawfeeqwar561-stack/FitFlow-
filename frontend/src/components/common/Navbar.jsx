import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout }   = useAuth();
  const navigate           = useNavigate();
  const location           = useLocation();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);  // ✅ ADDED: mobile menu

  // ── Scroll detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ ADDED: Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ✅ ADDED: Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.navbar-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // ── Nav links config ─────────────────────────────────────────────────────
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/calories',  label: ' Calories' },
    { path: '/medical',   label: ' Medical' },
    { path: '/profile',   label: ' About' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span>FitFlow</span>
        </Link>

        {/* ✅ ADDED: Hamburger button for mobile */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Menu */}
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`navbar-link ${isActive(path) ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}
              <ThemeToggle />
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/login"  className="btn btn-ghost">Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;