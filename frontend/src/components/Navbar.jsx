import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  Sparkles,
  User,
  History,
  BookOpen,
  FileText,
  LogOut,
  LogIn,
  Menu,
  X,
  Layers,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully.', 'info');
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#00f2fe' : '#94a3b8',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(10, 12, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 0',
      }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #7f00ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
            }}
          >
            <Compass color="#fff" size={22} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.3px' }}>
              Career<span style={{ color: '#00f2fe' }}>AI</span>
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                color: '#94a3b8',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginTop: '-2px',
              }}
            >
              Smart Recommender
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="d-none d-lg-flex align-items-center gap-1">
          <NavLink to="/" style={navLinkStyle}>
            <Sparkles size={16} /> Home
          </NavLink>
          <NavLink to="/roles" style={navLinkStyle}>
            <Layers size={16} /> Explore Roles
          </NavLink>
          <NavLink to="/profile" style={navLinkStyle}>
            <User size={16} /> Profile Wizard
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/history" style={navLinkStyle}>
              <History size={16} /> History
            </NavLink>
          )}
          <NavLink to="/resume" style={navLinkStyle}>
            <FileText size={16} /> Resume Studio
          </NavLink>
        </div>

        {/* Auth Actions / User Menu */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7f00ff, #00f2fe)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {user?.first_name || user?.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-neon-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-neon-outline">
                <LogIn size={15} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-neon-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="d-lg-none btn text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', padding: '6px' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none py-3 px-4"
          style={{
            background: 'rgba(15, 19, 36, 0.98)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <NavLink to="/" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Sparkles size={16} /> Home
          </NavLink>
          <NavLink to="/roles" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Layers size={16} /> Explore Roles
          </NavLink>
          <NavLink to="/profile" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <User size={16} /> Profile Wizard
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/history" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              <History size={16} /> History
            </NavLink>
          )}
          <NavLink to="/resume" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <FileText size={16} /> Resume Studio
          </NavLink>
          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="btn btn-sm btn-neon-outline w-100"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <div className="d-flex flex-column gap-2">
              <Link
                to="/login"
                className="btn btn-sm btn-neon-outline text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-sm btn-neon-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
