import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Target,
  BarChart3,
  Compass,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Zap,
} from 'lucide-react';
import ThreeHeroNetwork from '../components/ThreeHeroNetwork';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navigate = useNavigate();
  const [quickSkills, setQuickSkills] = useState('Python, Machine Learning, Django, SQL');
  const howItWorksRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    // GSAP ScrollTrigger animation for the 5-step "How It Works" section
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-step-card',
        {
          opacity: 0,
          y: 45,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.gsap-feature-card',
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleQuickAnalyze = (e) => {
    e.preventDefault();
    const skillsList = quickSkills.split(',').map((s) => s.strip ? s.strip() : s.trim()).filter(Boolean);
    navigate('/analyzing', {
      state: {
        payload: {
          skills: skillsList,
          interests: ['Artificial Intelligence', 'Software Architecture'],
          experience_years: 2.0,
        },
      },
    });
  };

  const sampleSkillPresets = [
    'Python, Machine Learning, Django, SQL',
    'React, JavaScript, TypeScript, Node.js, CSS',
    'Docker, Kubernetes, Linux, AWS, CI/CD',
    'SQL, Tableau, Power BI, Python, Statistics',
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* ================= HERO SECTION WITH 3D NETWORK ================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0 60px 0',
        }}
      >
        {/* Full-screen 3D Constellation & Orbiting Nodes */}
        <ThreeHeroNetwork />

        {/* Ambient Gradient Glow Overlays */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(10, 12, 22, 0) 70%)',
            top: '10%',
            left: '10%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127, 0, 255, 0.14) 0%, rgba(10, 12, 22, 0) 70%)',
            bottom: '10%',
            right: '10%',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row justify-content-center text-center">
            <div className="col-12 col-lg-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Sparkles size={15} color="#00f2fe" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0f4fc', letterSpacing: '0.5px' }}>
                  Next-Gen TF-IDF & Cosine Similarity ML Engine
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
                  fontWeight: 900,
                  letterSpacing: '-1.5px',
                  lineHeight: '1.15',
                  marginBottom: '20px',
                }}
              >
                Architect Your Tech Career with <br />
                <span className="text-gradient">3D Intelligent Recommendations</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  color: '#94a3b8',
                  maxWidth: '750px',
                  margin: '0 auto 36px auto',
                  lineHeight: '1.6',
                }}
              >
                Match your exact skills, projects, and ambitions against 27+ industry tech roles.
                Receive computed similarity scores, targeted skill-gap diagnostics, and an actionable learning roadmap.
              </motion.p>

              {/* Quick Interactive Skill Analyzer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="glass-panel p-3 p-md-4 mx-auto mb-4"
                style={{ maxWidth: '680px', border: '1px solid rgba(0, 242, 254, 0.25)' }}
              >
                <form onSubmit={handleQuickAnalyze} className="d-flex flex-column flex-sm-row gap-2">
                  <input
                    type="text"
                    value={quickSkills}
                    onChange={(e) => setQuickSkills(e.target.value)}
                    placeholder="Enter your skills (e.g., Python, ML, React, Docker)..."
                    className="form-control form-control-futuristic flex-grow-1"
                    required
                  />
                  <button type="submit" className="btn-neon-primary px-4 py-2 w-100 w-sm-auto text-nowrap">
                    <Zap size={18} /> Analyze Now
                  </button>
                </form>

                {/* Preset Chips */}
                <div className="d-flex flex-wrap align-items-center gap-2 mt-3 text-start">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Try presets:</span>
                  {sampleSkillPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuickSkills(preset)}
                      className="btn btn-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        borderRadius: '16px',
                        padding: '2px 10px',
                      }}
                    >
                      {preset.split(',')[0]} + {preset.split(',')[1]}...
                    </button>
                  ))}
                </div>
              </motion.div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-center gap-2 gap-sm-3 mx-auto" style={{ maxWidth: '420px' }}>
                <Link to="/profile" className="btn-neon-primary text-center">
                  Build Full Profile <ArrowRight size={18} />
                </Link>
                <Link to="/roles" className="btn-neon-outline text-center">
                  <Layers size={18} /> Explore 27+ Roles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS COUNTER STRIP ================= */}
      <section style={{ background: 'rgba(15, 19, 36, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '30px 0' }}>
        <div className="container">
          <div className="row text-center gy-4">
            <div className="col-6 col-md-3">
              <div className="stat-number" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#00f2fe' }}>27+</div>
              <div className="stat-label" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Verified Tech Career Roles</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-number" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7f00ff' }}>100%</div>
              <div className="stat-label" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Real Cosine Similarity Scoring</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-number" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#00f5a0' }}>3-Phase</div>
              <div className="stat-label" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Tailored Learning Roadmaps</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-number" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f6d365' }}>ATS-Ready</div>
              <div className="stat-label" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Dynamic Resume Generator</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (GSAP 5 STEPS) ================= */}
      <section ref={howItWorksRef} style={{ padding: '100px 0', position: 'relative' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-2" style={{ background: 'rgba(127, 0, 255, 0.15)', color: '#a855f7', border: '1px solid rgba(127, 0, 255, 0.3)' }}>
              SYSTEM ARCHITECTURE
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800 }}>
              How It Works: <span className="text-gradient">The 5-Step Recommendation Pipeline</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '10px auto 0 auto' }}>
              Engineered with production machine learning methodologies. Never random, never hardcoded.
            </p>
          </div>

          <div className="row gy-4">
            {[
              {
                num: '01',
                title: 'Data Ingestion & Normalization',
                desc: 'Cleans, lowercases, and expands technical synonyms (e.g., "ml" → "machine learning", "k8s" → "kubernetes", "js" → "javascript").',
                icon: Cpu,
                color: '#00f2fe',
              },
              {
                num: '02',
                title: 'TF-IDF High-Dimensional Vectorization',
                desc: 'Computes unigram and bigram term frequencies with sublinear scaling, weighting required skills 3x and titles 2x.',
                icon: Target,
                color: '#7f00ff',
              },
              {
                num: '03',
                title: 'Cosine Similarity Role Ranking',
                desc: 'Projects your profile into high-dimensional vector space and calculates exact mathematical dot product angles against all 27+ roles.',
                icon: BarChart3,
                color: '#00f5a0',
              },
              {
                num: '04',
                title: 'Skill-Gap Matrix Diagnostic',
                desc: 'Identifies which required and nice-to-have skills you possess (matched) versus exact technologies you need to acquire (missing).',
                icon: Compass,
                color: '#f6d365',
              },
              {
                num: '05',
                title: 'Personalized Roadmap & Market Stats',
                desc: 'Generates an ordered progression from Beginner to Advanced with estimated duration, curated courses, salary projections, and ATS resume synthesis.',
                icon: Award,
                color: '#ff416c',
              },
            ].map((step, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div
                  className="glass-panel p-4 h-100 gsap-step-card"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '18px',
                      fontSize: '2.8rem',
                      fontWeight: 900,
                      color: 'rgba(255, 255, 255, 0.04)',
                      userSelect: 'none',
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${step.color}18`,
                      border: `1px solid ${step.color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <step.icon size={22} color={step.color} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                    {step.title}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features-section" style={{ padding: '80px 0', background: 'rgba(15, 19, 36, 0.4)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-2" style={{ background: 'rgba(0, 245, 160, 0.15)', color: '#00f5a0', border: '1px solid rgba(0, 245, 160, 0.3)' }}>
              CORE CAPABILITIES
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800 }}>
              Engineered For Career Breakthroughs
            </h2>
          </div>

          <div className="row gy-4">
            <div className="col-12 col-md-4">
              <div className="glass-panel p-4 h-100 gsap-feature-card">
                <div style={{ color: '#00f2fe', marginBottom: '16px' }}>
                  <TrendingUp size={32} />
                </div>
                <h4 style={{ fontWeight: 700, color: '#fff' }}>Market Salary & Growth</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Understand realistic compensation bands (₹6 LPA to ₹55 LPA+) and 10-year job growth projections for each recommended specialization.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-panel p-4 h-100 gsap-feature-card">
                <div style={{ color: '#7f00ff', marginBottom: '16px' }}>
                  <Cpu size={32} />
                </div>
                <h4 style={{ fontWeight: 700, color: '#fff' }}>Radar & 3D Visualizations</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Explore interactive React-Three-Fiber ring indicators and radar charts illustrating your skill coverage against target domain benchmarks.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-panel p-4 h-100 gsap-feature-card">
                <div style={{ color: '#00f5a0', marginBottom: '16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontWeight: 700, color: '#fff' }}>ATS Resume Studio</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Generate a tailored, ATS-compliant technical resume that highlights your matched skills, project impact, and target career direction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION (CTA) ================= */}
      <section style={{ padding: '90px 0', position: 'relative' }}>
        <div className="container">
          <div
            className="glass-panel p-5 text-center mx-auto"
            style={{
              maxWidth: '850px',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              background: 'radial-gradient(circle at 50% 50%, rgba(22, 27, 51, 0.9) 0%, rgba(10, 12, 22, 0.95) 100%)',
              boxShadow: '0 0 50px rgba(0, 242, 254, 0.15)',
            }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, marginBottom: '18px' }}>
              Ready to Discover Your <span className="text-gradient">Optimal Career Path</span>?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px auto' }}>
              Takes less than 2 minutes. Enter your skills or complete the profile wizard for full recommendations.
            </p>
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
              <Link to="/profile" className="btn-neon-primary px-5 py-3" style={{ fontSize: '1rem' }}>
                Launch Profile Wizard <ArrowRight size={18} />
              </Link>
              <Link to="/roles" className="btn-neon-outline px-4 py-3" style={{ fontSize: '1rem' }}>
                Browse Careers Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
