import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Cpu } from 'lucide-react';
import ThreeConvergenceCore from '../components/ThreeConvergenceCore';
import { getRecommendations } from '../api/recommender';
import { useToast } from '../context/ToastContext';

export default function AnalyzingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const payload = location.state?.payload || {
    skills: ['Python', 'Machine Learning', 'Django', 'SQL'],
    interests: ['Artificial Intelligence & Deep Learning'],
    experience_years: 1.5,
  };

  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    'Normalizing technical tokens & expanding skill synonyms...',
    'Fitting TF-IDF high-dimensional n-gram feature vectors...',
    'Computing cosine similarity angles against 27+ career models...',
    'Performing skill-gap coverage diagnostics & milestone roadmaps...',
    'Synthesizing final ranked career recommendations...',
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < pipelineSteps.length) {
        setActiveStep(current);
      }
    }, 450);

    // Call real recommendation API
    getRecommendations(payload)
      .then((data) => {
        // Ensure at least 1.6s has elapsed for the 3D visual convergence animation
        setTimeout(() => {
          navigate('/results', {
            state: {
              recommendations: data.recommendations,
              query_snapshot: data.query_snapshot,
            },
            replace: true,
          });
        }, 1800);
      })
      .catch((err) => {
        console.error('Recommendation API error:', err);
        showToast('Error computing recommendations. Please try again.', 'danger');
        navigate('/profile');
      });

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 15px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '580px', width: '100%' }}>
        {/* 3D Convergence Animation */}
        <ThreeConvergenceCore />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-3"
        >
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill" style={{ background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
            <Cpu size={15} color="#00f2fe" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#00f2fe' }}>
              Cosine Vector Engine In Progress
            </span>
          </div>

          <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '1.8rem', marginBottom: '8px' }}>
            Analyzing Your Technical Profile
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '24px' }}>
            Extracting matching career roles, missing skill targets, and learning roadmaps.
          </p>

          {/* Stepper Status Indicators */}
          <div
            className="glass-panel p-3 text-start mx-auto"
            style={{ maxWidth: '480px', background: 'rgba(15, 19, 36, 0.8)' }}
          >
            {pipelineSteps.map((stepText, idx) => {
              const isPast = activeStep > idx;
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={idx}
                  className="d-flex align-items-center gap-2 py-2"
                  style={{
                    opacity: isPast || isCurrent ? 1 : 0.35,
                    color: isCurrent ? '#00f2fe' : isPast ? '#00f5a0' : '#64748b',
                    fontSize: '0.84rem',
                    fontWeight: isCurrent ? 600 : 400,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isPast ? (
                    <CheckCircle2 size={16} color="#00f5a0" />
                  ) : isCurrent ? (
                    <div className="spinner-border spinner-border-sm text-info" style={{ width: '14px', height: '14px' }} />
                  ) : (
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #64748b' }} />
                  )}
                  <span>{stepText}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
