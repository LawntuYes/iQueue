import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const role = user?.role;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-wrapper">
            <span className="logo-text">
              <span className="logo-primary">i</span>
              <span className="logo-secondary">Queue</span>
            </span>
          </div>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>

            {role === 'admin' && (
              <>
                <Link to="/dashboard/admin" className={`nav-item ${isActive('/dashboard/admin') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Admin Panel
                </Link>
                <Link to="/admin/businesses" className={`nav-item ${isActive('/admin/businesses') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Businesses
                </Link>
              </>
            )}

            {role === 'business' && (
              <><Link to="/dashboard/business" className={`nav-item ${isActive('/dashboard/business') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                Business Dashboard
              </Link><Link to="/dashboard/queues" className={`nav-item ${isActive('/dashboard/queues') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Queues
                </Link></>
            )}

            {role === 'user' && (
              <Link to="/user/dashboard" className={`nav-item ${isActive('/user/dashboard') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                My Appointments
              </Link>
            )}
          </div>

          <div className="user-section">
            {user ? (
              <>
                <div className="user-info">
                  <span className="user-greeting">Hi, {user.name}</span>
                  <span className="user-role">{role}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className={`btn-login ${isActive('/login') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className={`btn-register ${isActive('/register') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;