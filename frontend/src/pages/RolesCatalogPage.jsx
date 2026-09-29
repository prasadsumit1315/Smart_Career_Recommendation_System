import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layers, DollarSign, TrendingUp, BookOpen, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { getRoles } from '../api/recommender';

export default function RolesCatalogPage() {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getRoles(searchTerm)
      .then((data) => {
        setRoles(data.results || []);
      })
      .catch((err) => {
        console.error('Failed to load roles catalog:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm]);

  const handleTestRole = (role) => {
    // Run recommendation with this role's required skills to test alignment
    navigate('/analyzing', {
      state: {
        payload: {
          skills: role.required_skills,
          interests: [role.title],
          experience_years: 2.0,
        },
      },
    });
  };

  return (
    <div style={{ minHeight: '88vh', padding: '50px 0 80px 0' }}>
      <div className="container">
        {/* Header Title */}
        <div className="text-center mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-2" style={{ background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
            CAREER TAXONOMY
          </span>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '10px' }}>
            Explore All <span className="text-gradient">27+ Tech Career Roles</span>
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto 30px auto' }}>
            Discover industry-benchmarked skill requirements, average compensation brackets, and growth outlooks.
          </p>

          {/* Search Input */}
          <div className="position-relative mx-auto" style={{ maxWidth: '550px' }}>
            <input
              type="text"
              className="form-control form-control-futuristic has-icon ps-5 py-3"
              placeholder="Search by role title or skill (e.g., Python, Cloud, Security)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '52px' }}
            />
            <Search
              size={20}
              color="#00f2fe"
              className="input-icon-left"
              style={{ left: '18px' }}
            />
          </div>
        </div>

        {/* Roles Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading roles...</span>
            </div>
            <p className="mt-3 text-muted">Retrieving career taxonomy from database...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="glass-panel p-5 text-center my-4">
            <p style={{ color: '#94a3b8' }}>No career roles found matching "{searchTerm}".</p>
            <button onClick={() => setSearchTerm('')} className="btn btn-sm btn-neon-outline">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {roles.map((role) => (
              <div key={role.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="glass-panel p-4 h-100 d-flex flex-column justify-content-between"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                        {role.title}
                      </h4>
                      <span className="badge rounded-pill" style={{ background: 'rgba(0, 245, 160, 0.1)', color: '#00f5a0', fontSize: '11px' }}>
                        Active
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
                      {role.description}
                    </p>

                    {/* Required Skills */}
                    <div className="mb-3">
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                        REQUIRED COMPETENCIES:
                      </span>
                      <div className="d-flex flex-wrap gap-1">
                        {role.required_skills?.map((s) => (
                          <span key={s} className="skill-chip skill-chip-neutral py-1 px-2" style={{ fontSize: '0.75rem' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Salary & Outlook */}
                    <div className="p-2 mb-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: '#94a3b8' }}>Avg Salary:</span>
                        <span style={{ color: '#00f5a0', fontWeight: 600 }}>{role.avg_salary_range}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: '#94a3b8' }}>10-Yr Outlook:</span>
                        <span style={{ color: '#00f2fe', fontWeight: 600 }}>{role.growth_outlook}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 pt-2 border-top border-secondary border-opacity-25">
                    <button
                      onClick={() => handleTestRole(role)}
                      className="btn btn-sm btn-neon-primary w-100"
                      style={{ fontSize: '0.82rem' }}
                    >
                      <Zap size={14} /> Analyze My Fit
                    </button>
                    <button
                      onClick={() => navigate('/resume', { state: { targetRole: role.title } })}
                      className="btn btn-sm btn-neon-outline"
                      title="Build tailored resume for this role"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
