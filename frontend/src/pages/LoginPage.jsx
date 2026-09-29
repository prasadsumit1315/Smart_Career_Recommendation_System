import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, User, AlertCircle, Compass, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login({ username, password });
      showToast('Logged in successfully! Welcome back.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Invalid username or password.';
      setErrorMsg(msg);
      showToast(msg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setUsername('testdeveloper');
    setPassword('Password123!');
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 15px',
        position: 'relative',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, transparent 70%)',
          top: '20%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-4 p-sm-5 w-100"
        style={{ maxWidth: '440px', border: '1px solid rgba(0, 242, 254, 0.25)', position: 'relative', zIndex: 1 }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #7f00ff 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.35)',
              marginBottom: '14px',
            }}
          >
            <Compass size={26} color="#fff" />
          </div>
          <h2 style={{ fontWeight: 800, color: '#fff', fontSize: '1.75rem', marginBottom: '6px' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Access your career intelligence dashboard
          </p>
        </div>

        {errorMsg && (
          <div
            className="alert p-3 mb-3 d-flex align-items-center gap-2"
            style={{
              background: 'rgba(255, 65, 108, 0.15)',
              border: '1px solid rgba(255, 65, 108, 0.3)',
              color: '#ff416c',
              fontSize: '0.85rem',
              borderRadius: '10px',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Username
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-futuristic has-icon ps-5"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
              <User
                size={18}
                className="input-icon-left"
              />
            </div>
          </div>

          <div className="mb-4">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Password
            </label>
            <div className="position-relative">
              <input
                type="password"
                className="form-control form-control-futuristic has-icon ps-5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
              <Lock
                size={18}
                className="input-icon-left"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-neon-primary w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          {/* Quick Demo Fill button */}
          <button
            type="button"
            onClick={handleDemoFill}
            className="btn btn-sm btn-neon-outline w-100 py-2 mb-4"
            style={{ fontSize: '0.82rem' }}
          >
            <Zap size={14} color="#00f2fe" /> Auto-fill Demo Account
          </button>
        </form>

        <div className="text-center" style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 600 }}>
            Create one now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
