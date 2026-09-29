import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Code2,
  FolderGit2,
  Heart,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import { getProfile, updateProfile } from '../api/profile';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Autocomplete skill catalogue
const POPULAR_SKILLS = [
  'Python', 'Machine Learning', 'Django', 'SQL', 'Deep Learning',
  'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Docker', 'Kubernetes',
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js',
  'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Linux',
  'Git', 'Pandas', 'NumPy', 'Tableau', 'Power BI',
  'CI/CD', 'FastAPI', 'HTML', 'CSS', 'Tailwind CSS',
  'Rest APIs', 'Microservices', 'GraphQL', 'System Design', 'C++',
];

const POPULAR_INTERESTS = [
  'Artificial Intelligence & Deep Learning',
  'Scalable Cloud Architecture',
  'Full Stack Web Applications',
  'Data Engineering & Big Data',
  'Cybersecurity & Network Defense',
  'DevOps & Automated Infrastructure',
  'Mobile App Development',
  'Human-Computer Interaction & UI/UX',
  'Natural Language Processing & LLMs',
  'Computer Vision & Robotics',
];

export default function ProfileBuilderPage() {
  const { isAuthenticated, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  // Form State
  const [profileData, setProfileData] = useState({
    education_level: "Bachelor's Degree",
    education_field: 'Computer Science',
    education_institution: '',
    education_year: 2025,
    skills: ['Python', 'Machine Learning', 'Django', 'SQL'],
    interests: ['Artificial Intelligence & Deep Learning', 'Full Stack Web Applications'],
    experience_years: 1.5,
    experience_text: 'Experienced in developing Python backend applications, REST APIs, and training predictive machine learning models.',
    projects: [
      {
        title: 'Intelligent Career Engine',
        description: 'Engineered a full-stack recommendation platform using scikit-learn TF-IDF vectorization and Django REST Framework.',
        tech: 'Python, Django, Scikit-Learn, React',
      },
      {
        title: 'Real-Time Analytics Pipeline',
        description: 'Developed automated ETL data workflows using SQL, Pandas, and PostgreSQL with Dockerized containers.',
        tech: 'Python, SQL, PostgreSQL, Docker',
      },
    ],
    target_role: 'AI/ML Engineer',
    preferred_work_type: 'Remote',
  });

  // Load existing profile from backend if available
  useEffect(() => {
    if (isAuthenticated) {
      getProfile()
        .then((data) => {
          if (data && data.skills && data.skills.length > 0) {
            setProfileData((prev) => ({
              ...prev,
              ...data,
              skills: Array.isArray(data.skills) ? data.skills : [],
              interests: Array.isArray(data.interests) ? data.interests : [],
              projects: Array.isArray(data.projects) ? data.projects : prev.projects,
            }));
          }
        })
        .catch((err) => {
          console.log('Using default profile template for guest/new user');
        });
    }
  }, [isAuthenticated]);

  // Autocomplete skill filter
  useEffect(() => {
    if (skillInput.trim().length > 0) {
      const filtered = POPULAR_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(skillInput.toLowerCase()) &&
          !profileData.skills.includes(s)
      );
      setSuggestedSkills(filtered.slice(0, 6));
    } else {
      setSuggestedSkills([]);
    }
  }, [skillInput, profileData.skills]);

  // Skills Tag management
  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !profileData.skills.includes(trimmed)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setSkillInput('');
    setSuggestedSkills([]);
  };

  const removeSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  // Interests Tag management
  const toggleInterest = (interest) => {
    setProfileData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  // Projects management
  const addProject = () => {
    setProfileData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', description: '', tech: '' },
      ],
    }));
  };

  const removeProject = (index) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index),
    }));
  };

  const updateProjectField = (index, field, value) => {
    setProfileData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSaveAndAnalyze = async () => {
    if (profileData.skills.length === 0) {
      showToast('Please add at least 1 technical skill to run recommendation.', 'danger');
      setCurrentStep(2);
      return;
    }

    setLoading(true);

    if (isAuthenticated) {
      try {
        await updateProfile(profileData);
        await refreshUser();
        showToast('Profile saved successfully!', 'success');
      } catch (err) {
        console.warn('Could not save profile to account:', err);
      }
    }

    // Navigate to Analyzing screen with full profile payload
    navigate('/analyzing', { state: { payload: profileData } });
  };

  const steps = [
    { id: 1, label: 'Education', icon: GraduationCap },
    { id: 2, label: 'Skills', icon: Code2 },
    { id: 3, label: 'Projects', icon: FolderGit2 },
    { id: 4, label: 'Interests', icon: Heart },
    { id: 5, label: 'Experience', icon: Briefcase },
  ];

  return (
    <div style={{ minHeight: '88vh', padding: '50px 0 80px 0', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header Title */}
        <div className="text-center mb-4">
          <span
            className="badge rounded-pill px-3 py-1 mb-2"
            style={{
              background: 'rgba(0, 242, 254, 0.12)',
              color: '#00f2fe',
              border: '1px solid rgba(0, 242, 254, 0.3)',
            }}
          >
            STEP {currentStep} OF 5
          </span>
          <h2 style={{ fontWeight: 800, fontSize: '2.2rem', marginBottom: '8px' }}>
            Profile & Career <span className="text-gradient">Intelligence Wizard</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Our ML model matches your complete technical footprint against all 27+ industry roles.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="glass-panel p-3 mb-4 d-flex justify-content-between align-items-center">
          {steps.map((s) => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            return (
              <div
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flex: 1,
                  opacity: isActive || isCompleted ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  className="step-node-circle"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isActive
                      ? 'linear-gradient(135deg, #00f2fe, #7f00ff)'
                      : isCompleted
                      ? '#00f5a0'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: isCompleted ? '#0a0c16' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 0 15px rgba(0, 242, 254, 0.4)' : 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {isCompleted ? <Check size={18} /> : <s.icon size={16} />}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isActive ? '#00f2fe' : '#94a3b8',
                    display: 'none',
                    marginTop: '2px',
                  }}
                  className="d-sm-block"
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Form Container */}
        <div className="glass-panel p-4 p-md-5 position-relative">
          <AnimatePresence mode="wait">
            {/* ================= STEP 1: EDUCATION ================= */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex align-items-center gap-2 mb-4">
                  <GraduationCap size={24} color="#00f2fe" />
                  <h4 style={{ fontWeight: 700, margin: 0 }}>Academic Background</h4>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Education Level
                    </label>
                    <select
                      className="form-control form-control-futuristic"
                      value={profileData.education_level}
                      onChange={(e) => setProfileData({ ...profileData, education_level: e.target.value })}
                    >
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Ph.D.">Ph.D.</option>
                      <option value="Bootcamp Graduate">Bootcamp Graduate</option>
                      <option value="Self-Taught / Associate">Self-Taught / Associate</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Field of Study
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-futuristic"
                      placeholder="Computer Science, IT, Data Science..."
                      value={profileData.education_field}
                      onChange={(e) => setProfileData({ ...profileData, education_field: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-8">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      University / Institution Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-futuristic"
                      placeholder="e.g. Stanford University, MIT, IIT, Coursera..."
                      value={profileData.education_institution}
                      onChange={(e) => setProfileData({ ...profileData, education_institution: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-futuristic"
                      value={profileData.education_year}
                      onChange={(e) => setProfileData({ ...profileData, education_year: parseInt(e.target.value) || 2025 })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 2: SKILLS ================= */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Code2 size={24} color="#00f2fe" />
                  <h4 style={{ fontWeight: 700, margin: 0 }}>Technical Skill Stack</h4>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Type a skill name and press <kbd style={{ background: '#1e2546', padding: '2px 6px' }}>Enter</kbd> or click from popular skills.
                </p>

                {/* Tag Input */}
                <div className="position-relative mb-3">
                  <div
                    className="form-control form-control-futuristic d-flex flex-wrap align-items-center gap-2"
                    style={{ minHeight: '52px', cursor: 'text' }}
                  >
                    {profileData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="skill-chip skill-chip-matched"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#00f5a0',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder={profileData.skills.length === 0 ? 'Type skill (e.g. Python, SQL, Docker)...' : 'Add another...'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        outline: 'none',
                        flexGrow: 1,
                        minWidth: '120px',
                      }}
                    />
                  </div>

                  {/* Autocomplete dropdown */}
                  {suggestedSkills.length > 0 && (
                    <div
                      className="glass-panel p-2 position-absolute w-100 mt-1"
                      style={{ zIndex: 10, background: 'rgba(15, 19, 36, 0.98)', border: '1px solid rgba(0, 242, 254, 0.3)' }}
                    >
                      <div className="d-flex flex-wrap gap-2">
                        {suggestedSkills.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => addSkill(s)}
                            className="btn btn-sm btn-neon-outline"
                            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Popular Skill Badges */}
                <div className="mt-4">
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Quick-add common technologies:
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    {POPULAR_SKILLS.slice(0, 15).map((skill) => {
                      const isAdded = profileData.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => (isAdded ? removeSkill(skill) : addSkill(skill))}
                          className="btn btn-sm"
                          style={{
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            background: isAdded ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isAdded ? 'rgba(0, 245, 160, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                            color: isAdded ? '#00f5a0' : '#cbd5e1',
                          }}
                        >
                          {isAdded ? '✓ ' : '+ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 3: PROJECTS ================= */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <FolderGit2 size={24} color="#00f2fe" />
                    <h4 style={{ fontWeight: 700, margin: 0 }}>Projects & Practical Work</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addProject}
                    className="btn btn-sm btn-neon-outline"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {profileData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: '0.82rem', color: '#00f2fe', fontWeight: 600 }}>
                          Project #{idx + 1}
                        </span>
                        {profileData.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProject(idx)}
                            className="btn btn-sm text-danger p-0"
                            style={{ background: 'transparent', border: 'none' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control form-control-futuristic"
                          placeholder="Project Title (e.g. Distributed Task Queue)"
                          value={proj.title}
                          onChange={(e) => updateProjectField(idx, 'title', e.target.value)}
                        />
                      </div>

                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control form-control-futuristic"
                          placeholder="Technologies Used (e.g. Python, Redis, Celery, Docker)"
                          value={proj.tech}
                          onChange={(e) => updateProjectField(idx, 'tech', e.target.value)}
                        />
                      </div>

                      <div>
                        <textarea
                          rows={2}
                          className="form-control form-control-futuristic"
                          placeholder="Brief description of what you designed, built, or optimized..."
                          value={proj.description}
                          onChange={(e) => updateProjectField(idx, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ================= STEP 4: INTERESTS ================= */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Heart size={24} color="#00f2fe" />
                  <h4 style={{ fontWeight: 700, margin: 0 }}>Domains & Areas of Interest</h4>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Select the technology domains you are most passionate about exploring.
                </p>

                <div className="d-flex flex-wrap gap-2">
                  {POPULAR_INTERESTS.map((interest) => {
                    const isSelected = profileData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className="btn p-3 text-start"
                        style={{
                          flex: '1 1 calc(50% - 10px)',
                          borderRadius: '12px',
                          background: isSelected ? 'rgba(127, 0, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${isSelected ? '#7f00ff' : 'rgba(255, 255, 255, 0.08)'}`,
                          color: '#fff',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{interest}</span>
                        {isSelected && <Check size={18} color="#00f2fe" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ================= STEP 5: EXPERIENCE ================= */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex align-items-center gap-2 mb-4">
                  <Briefcase size={24} color="#00f2fe" />
                  <h4 style={{ fontWeight: 700, margin: 0 }}>Experience & Aspirations</h4>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Years of Technical Experience
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="40"
                      className="form-control form-control-futuristic"
                      value={profileData.experience_years}
                      onChange={(e) => setProfileData({ ...profileData, experience_years: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Preferred Work Arrangement
                    </label>
                    <select
                      className="form-control form-control-futuristic"
                      value={profileData.preferred_work_type}
                      onChange={(e) => setProfileData({ ...profileData, preferred_work_type: e.target.value })}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-Site">On-Site</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Aspirational Career Title (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-futuristic"
                      placeholder="e.g. AI/ML Engineer, Full Stack Architect..."
                      value={profileData.target_role}
                      onChange={(e) => setProfileData({ ...profileData, target_role: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Professional Experience Summary
                    </label>
                    <textarea
                      rows={3}
                      className="form-control form-control-futuristic"
                      placeholder="Summarize your hands-on background, daily responsibilities, tools, and achievements..."
                      value={profileData.experience_text}
                      onChange={(e) => setProfileData({ ...profileData, experience_text: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-2 mt-5 pt-3 border-top border-secondary border-opacity-25">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-neon-outline w-100 w-sm-auto order-2 order-sm-1"
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div className="d-none d-sm-block" />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-neon-primary w-100 w-sm-auto order-1 order-sm-2"
                style={{ padding: '8px 24px', fontSize: '0.9rem' }}
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndAnalyze}
                disabled={loading}
                className="btn-neon-primary w-100 w-sm-auto px-4 py-2 order-1 order-sm-2"
                style={{ fontSize: '0.92rem' }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                ) : (
                  <Zap size={18} />
                )}
                {loading ? 'Calculating Vectors...' : 'Compute AI Recommendations'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
