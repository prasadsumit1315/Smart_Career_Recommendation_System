import React from 'react';
import { Compass, Heart, Github, Cpu, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'rgba(10, 12, 22, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '50px 0 30px 0',
        marginTop: 'auto',
      }}
      className="no-print"
    >
      <div className="container">
        <div className="row gy-4 mb-4">
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00f2fe 0%, #7f00ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass color="#fff" size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                Career<span style={{ color: '#00f2fe' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '380px' }}>
              Next-generation AI-powered career recommendation platform combining TF-IDF vectorization,
              cosine similarity, dynamic skill gap analysis, and interactive 3D visualizations.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill" style={{ background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                <Cpu size={12} className="me-1" /> TF-IDF + Cosine Sim
              </span>
              <span className="badge rounded-pill" style={{ background: 'rgba(127, 0, 255, 0.12)', color: '#a855f7', border: '1px solid rgba(127, 0, 255, 0.3)' }}>
                <ShieldCheck size={12} className="me-1" /> SimpleJWT & Django 5
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Platform
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Interactive 3D Home
                </Link>
              </li>
              <li>
                <Link to="/roles" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
                  27+ Career Roles Catalog
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Multi-step Profile Wizard
                </Link>
              </li>
              <li>
                <Link to="/resume" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
                  ATS Resume Studio
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Engine Architecture
            </h6>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Cosine similarity computed in high-dimensional n-gram TF-IDF vector space with real-time skill coverage mapping,
              curated learning roadmaps, and salary insights.
            </p>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              Status: <span style={{ color: '#00f5a0', fontWeight: 600 }}>● Models Active (27 Roles)</span>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '24px 0' }} />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2" style={{ color: '#64748b', fontSize: '0.82rem' }}>
          <div>
            © {new Date().getFullYear()} AI-Powered Smart Career Recommendation System. All rights reserved.
          </div>
          <div>
            Built with modern React 18, Three.js, R3F, Framer Motion & Django REST Framework.
          </div>
        </div>
      </div>
    </footer>
  );
}
