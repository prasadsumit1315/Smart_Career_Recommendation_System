import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Award,
  TrendingUp,
  DollarSign,
  Calendar,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import TiltCard from '../components/TiltCard';
import CircularProgress from '../components/CircularProgress';
import ThreeMatchRing from '../components/ThreeMatchRing';

export default function ResultsDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // If recommendations not in state, load default or fallback
  const initialRecs = location.state?.recommendations || [];
  const querySnapshot = location.state?.query_snapshot || {};

  const [recommendations, setRecommendations] = useState(initialRecs);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#7f00ff', '#00f5a0'],
      });
    } catch (e) {
      // non-blocking
    }
  }, []);

  // Fallback if user navigated directly without state
  useEffect(() => {
    if (!recommendations || recommendations.length === 0) {
      // Fetch or redirect
      navigate('/profile');
    }
  }, [recommendations, navigate]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const activeRole = recommendations[selectedIndex] || recommendations[0];

  // Prepare Radar Chart data from active role's skill scores
  const radarData = Object.entries(activeRole.skill_scores || {})
    .slice(0, 7)
    .map(([skill, score]) => ({
      subject: skill.length > 14 ? skill.substring(0, 12) + '...' : skill,
      coverage: Math.round(score * 100),
      fullMark: 100,
    }));

  // Ensure minimum items for nice radar polygon
  if (radarData.length < 3) {
    radarData.push({ subject: 'Core Arch', coverage: 70, fullMark: 100 });
    radarData.push({ subject: 'Engineering', coverage: 85, fullMark: 100 });
    radarData.push({ subject: 'Deployment', coverage: 60, fullMark: 100 });
  }

  return (
    <div style={{ minHeight: '90vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Top Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill" style={{ background: 'rgba(0, 245, 160, 0.15)', color: '#00f5a0', border: '1px solid rgba(0, 245, 160, 0.3)' }}>
                ● VECTOR ANALYSIS COMPLETE
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Cosine similarity computed against 27 tech career roles
              </span>
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', margin: 0 }}>
              AI Career <span className="text-gradient">Match Intelligence</span>
            </h1>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 w-100 w-md-auto">
            <Link to="/profile" className="btn btn-sm btn-neon-outline flex-grow-1 flex-md-grow-0">
              <RotateCcw size={15} /> Retune Profile
            </Link>
            <button
              onClick={() => navigate('/resume', { state: { targetRole: activeRole.role } })}
              className="btn btn-sm btn-neon-primary flex-grow-1 flex-md-grow-0"
            >
              <FileText size={15} /> Generate Resume
            </button>
          </div>
        </div>

        {/* 3D Match Score Ring + Overview Header */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-lg-7">
            <div className="glass-panel p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  TOP RECOMMENDED MATCH
                </span>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-2 mb-3">
                  <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {activeRole.role}
                  </h2>
                  <CircularProgress percent={activeRole.match_percent} size={80} />
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {activeRole.description}
                </p>
              </div>

              {/* Salary & Outlook Badges */}
              <div className="row g-3 pt-3 border-top border-secondary border-opacity-25 mt-3">
                <div className="col-6 col-sm-4">
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>COMPENSATION</div>
                  <div style={{ color: '#00f5a0', fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                    {activeRole.salary_range}
                  </div>
                </div>
                <div className="col-6 col-sm-4">
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>10-YR GROWTH</div>
                  <div style={{ color: '#00f2fe', fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                    {activeRole.growth_outlook}
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MATCH ACCURACY</div>
                  <div style={{ color: '#f6d365', fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                    {activeRole.match_percent}% Computed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Rotating Score Ring Visualization */}
          <div className="col-12 col-lg-5">
            <div className="glass-panel p-3 h-100 text-center d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between px-3 pt-2">
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                  3D Match Ring Visualization
                </span>
                <span className="badge" style={{ background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', fontSize: '11px' }}>
                  Live R3F Torus
                </span>
              </div>
              <ThreeMatchRing recommendations={recommendations} />
              <div style={{ fontSize: '0.78rem', color: '#64748b', paddingBottom: '6px' }}>
                Multi-tier arc lengths scale with vector cosine similarities
              </div>
            </div>
          </div>
        </div>

        {/* ================= TOP 5 RECOMMENDATIONS TILT CARDS ================= */}
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              Ranked Career Matches (Select to Inspect)
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Showing Top {recommendations.length} Roles
            </span>
          </div>

          <div className="row g-3">
            {recommendations.map((rec, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div key={rec.role} className="col-12 col-md-6 col-lg-4 col-xl">
                  <TiltCard
                    onClick={() => setSelectedIndex(idx)}
                    className="p-3 h-100"
                    style={{
                      cursor: 'pointer',
                      border: isSelected
                        ? '1.5px solid #00f2fe'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected
                        ? 'rgba(0, 242, 254, 0.06)'
                        : 'rgba(22, 27, 51, 0.7)',
                      boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.25)' : 'none',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        className="badge"
                        style={{
                          background: isSelected ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)',
                          color: isSelected ? '#0a0c16' : '#fff',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        #{idx + 1} RANK
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isSelected ? '#00f2fe' : '#fff' }}>
                        {rec.match_percent}%
                      </span>
                    </div>

                    <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                      {rec.role}
                    </h5>

                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        lineHeight: '1.4',
                        marginBottom: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {rec.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      <span>{rec.matched_skills.length} matched</span>
                      <span>{rec.missing_skills.length} gap</span>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= DETAILED BREAKDOWN TABS / RADAR & SKILL GAP ================= */}
        <div className="row g-4 mb-5">
          {/* Radar Chart */}
          <div className="col-12 col-lg-5">
            <div className="glass-panel p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                  Skill Competency Radar
                </h4>
                <span className="badge" style={{ background: 'rgba(127, 0, 255, 0.15)', color: '#a855f7' }}>
                  {activeRole.role}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                Visualizes your alignment across the role's primary technical competencies.
              </p>

              <div style={{ width: '100%', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.12)" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.1)" />
                    <Radar
                      name="Your Coverage"
                      dataKey="coverage"
                      stroke="#00f2fe"
                      fill="#00f2fe"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Skill Gap Matrix */}
          <div className="col-12 col-lg-7">
            <div className="glass-panel p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                  Skill Gap Matrix Diagnostic
                </h4>
                <div className="d-flex gap-2">
                  <span className="badge skill-chip-matched">
                    ✓ {activeRole.matched_skills.length} Matched
                  </span>
                  <span className="badge skill-chip-missing">
                    ! {activeRole.missing_skills.length} Missing
                  </span>
                </div>
              </div>

              {/* Matched Skills */}
              <div className="mb-4">
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#00f5a0', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} className="me-1 inline" /> Matched Proficiencies
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {activeRole.matched_skills.length > 0 ? (
                    activeRole.matched_skills.map((skill) => (
                      <span key={skill} className="skill-chip skill-chip-matched">
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      No exact overlap detected in your profile.
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f6d365', marginBottom: '8px' }}>
                  <AlertCircle size={16} className="me-1 inline" /> Recommended Target Skills to Bridge
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {activeRole.missing_skills.length > 0 ? (
                    activeRole.missing_skills.map((skill) => (
                      <span key={skill} className="skill-chip skill-chip-missing">
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#00f5a0' }}>
                      Exceptional! You possess all required technical skills for this role.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ORDERED LEARNING ROADMAP TIMELINE ================= */}
        <div className="glass-panel p-3 p-md-5 mb-5">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
            <div>
              <span className="badge rounded-pill mb-2" style={{ background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe' }}>
                ACTIONABLE PATHWAY
              </span>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, margin: 0, color: '#fff' }}>
                Personalized Learning Roadmap: <span className="text-gradient">{activeRole.role}</span>
              </h3>
            </div>
            <button
              onClick={() => navigate('/resume', { state: { targetRole: activeRole.role } })}
              className="btn btn-sm btn-neon-primary w-100 w-sm-auto text-nowrap"
            >
              <FileText size={16} /> Build Role Resume
            </button>
          </div>

          {/* Vertical Timeline */}
          <div style={{ position: 'relative', paddingLeft: '30px' }}>
            {/* Timeline vertical bar */}
            <div
              style={{
                position: 'absolute',
                left: '11px',
                top: '15px',
                bottom: '15px',
                width: '2px',
                background: 'linear-gradient(180deg, #00f2fe 0%, #7f00ff 50%, #00f5a0 100%)',
              }}
            />

            {activeRole.roadmap.map((step) => {
              const phaseColor =
                step.phase === 'Beginner'
                  ? '#00f2fe'
                  : step.phase === 'Intermediate'
                  ? '#7f00ff'
                  : '#00f5a0';

              return (
                <div key={step.step_number} className="mb-4 position-relative">
                  {/* Timeline Node Ring */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-30px',
                      top: '4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#0a0c16',
                      border: `2px solid ${phaseColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: phaseColor,
                      boxShadow: `0 0 10px ${phaseColor}66`,
                    }}
                  >
                    {step.step_number}
                  </div>

                  <div
                    className="p-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                    }}
                  >
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="badge"
                          style={{
                            background: `${phaseColor}22`,
                            color: phaseColor,
                            border: `1px solid ${phaseColor}44`,
                            fontSize: '11px',
                          }}
                        >
                          Phase: {step.phase}
                        </span>
                        <h5 style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                          {step.skill}
                        </h5>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        <Calendar size={13} className="me-1 inline" /> ~{step.estimated_weeks} Weeks
                      </div>
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                      {step.objective}
                    </p>

                    {/* Resources */}
                    {step.resources && step.resources.length > 0 && (
                      <div className="d-flex flex-wrap align-items-center gap-2 pt-2 border-top border-secondary border-opacity-25">
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          <BookOpen size={13} className="me-1 inline" /> Recommended Material:
                        </span>
                        {step.resources.map((res, rIdx) => (
                          <span
                            key={rIdx}
                            style={{
                              fontSize: '0.78rem',
                              color: '#00f2fe',
                              background: 'rgba(0, 242, 254, 0.08)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
