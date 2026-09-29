import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Lock, Mail, User, AlertCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      showToast('Account created successfully! Welcome aboard.', 'success');
      navigate('/profile');
    } catch (err) {
      const errors = err.response?.data;
      let msg = 'Registration failed. Please check inputs.';
      if (errors) {
        if (typeof errors === 'string') msg = errors;
        else if (errors.username) msg = `Username: ${errors.username[0]}`;
        else if (errors.email) msg = `Email: ${errors.email[0]}`;
        else if (errors.password) msg = `Password: ${errors.password[0]}`;
      }
      setErrorMsg(msg);
      showToast(msg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 15px',
        position: 'relative',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(127, 0, 255, 0.12) 0%, transparent 70%)',
          bottom: '10%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-4 p-sm-5 w-100"
        style={{ maxWidth: '520px', border: '1px solid rgba(127, 0, 255, 0.25)', position: 'relative', zIndex: 1 }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7f00ff 0%, #00f2fe 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(127, 0, 255, 0.35)',
              marginBottom: '14px',
            }}
          >
            <Compass size={26} color="#fff" />
          </div>
          <h2 style={{ fontWeight: 800, color: '#fff', fontSize: '1.75rem', marginBottom: '6px' }}>
            Create Your Account
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Get instant AI recommendations tailored to your skills
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
          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                className="form-control form-control-futuristic"
                placeholder="Alex"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                className="form-control form-control-futuristic"
                placeholder="Morgan"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Username *
            </label>
            <div className="position-relative">
              <input
                type="text"
                name="username"
                className="form-control form-control-futuristic has-icon ps-5"
                placeholder="alexmorgan"
                value={formData.username}
                onChange={handleChange}
                style={{ paddingLeft: '48px' }}
                required
              />
              <User
                size={18}
                className="input-icon-left"
              />
            </div>
          </div>

          <div className="mb-3">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Email Address *
            </label>
            <div className="position-relative">
              <input
                type="email"
                name="email"
                className="form-control form-control-futuristic has-icon ps-5"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '48px' }}
                required
              />
              <Mail
                size={18}
                className="input-icon-left"
              />
            </div>
          </div>

          <div className="row g-2 mb-4">
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Password *
              </label>
              <div className="position-relative">
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-futuristic has-icon ps-5"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '48px' }}
                  required
                />
                <Lock
                  size={18}
                  className="input-icon-left"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Confirm Password *
              </label>
              <div className="position-relative">
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control form-control-futuristic has-icon ps-5"
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  style={{ paddingLeft: '48px' }}
                  required
                />
                <Lock
                  size={18}
                  className="input-icon-left"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-neon-primary w-100 py-2 mb-4"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : (
              <UserPlus size={18} />
            )}
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center" style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
