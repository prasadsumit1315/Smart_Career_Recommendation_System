import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Printer, Download, Sparkles, User, Briefcase, GraduationCap, Code2, Check, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ResumePage() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  const selectedRole = location.state?.targetRole || 'AI/ML Engineer';

  // Customizable Resume Data pre-populated from user profile or sensible defaults
  const [resumeData, setResumeData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'Alex Morgan',
    title: selectedRole,
    email: user?.email || 'alex.morgan.dev@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (Open to Remote)',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan',
    summary: `Results-driven ${selectedRole} with strong hands-on experience in building scalable backend services, designing predictive machine learning architectures, and deploying reliable production software. Proficient in Python, modern web frameworks, SQL, and cloud infrastructure with a passion for high-impact engineering.`,
    skills: {
      languages: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Bash'],
      frameworks: ['Django', 'Django REST Framework', 'FastAPI', 'React', 'Scikit-Learn'],
      cloudDevOps: ['Docker', 'AWS (EC2, S3)', 'PostgreSQL', 'Git', 'CI/CD Pipelines'],
      methodologies: ['RESTful APIs', 'Microservices', 'System Design', 'Agile/Scrum'],
    },
    experience: [
      {
        role: `Software Engineer / ${selectedRole}`,
        company: 'Apex Cloud Solutions',
        duration: '2023 - Present',
        location: 'Remote',
        bullets: [
          `Architected and deployed high-throughput backend APIs processing over 1.2M queries monthly, cutting response latency by 28%.`,
          `Engineered feature extraction pipelines and automated model evaluation workflows utilizing Python and Scikit-Learn.`,
          `Spearheaded the migration of monolithic endpoints into containerized microservices orchestrated via Docker and AWS.`,
        ],
      },
      {
        role: 'Junior Software Engineer',
        company: 'DataMetrics Technologies',
        duration: '2021 - 2023',
        location: 'San Francisco, CA',
        bullets: [
          `Collaborated in the development of real-time reporting dashboards using React, Django, and PostgreSQL.`,
          `Wrote unit and integration test suites covering critical authentication and data transformation services, boosting test coverage to 92%.`,
          `Optimized complex SQL queries and database indexes, reducing report generation times from 14s to under 2s.`,
        ],
      },
    ],
    projects: [
      {
        name: 'AI-Powered Smart Career Recommendation Engine',
        tech: 'Python, Django, Scikit-Learn, React, Three.js, Docker',
        bullets: [
          'Engineered a machine learning career recommendation engine applying TF-IDF vectorization and cosine similarity across 27+ industry roles.',
          'Built an interactive 3D particle neural constellation UI with React Three Fiber, Framer Motion, and Bootstrap 5.',
          'Implemented secure JWT token authentication with automated token refresh interceptors.',
        ],
      },
      {
        name: 'Distributed Analytics & Event Streaming Service',
        tech: 'Python, FastAPI, Redis, PostgreSQL, Celery',
        bullets: [
          'Developed an asynchronous queue worker architecture handling 5,000+ background events per minute.',
          'Integrated Redis caching layers for sub-millisecond retrieval of user preference vectors.',
        ],
      },
    ],
    education: {
      degree: profile?.education_level || "Bachelor of Science in Computer Science",
      field: profile?.education_field || "Computer Science & Engineering",
      institution: profile?.education_institution || "University of California, Berkeley",
      year: profile?.education_year || "2024",
      gpa: "3.85 / 4.0",
    },
    certifications: [
      'AWS Certified Solutions Architect – Associate',
      'DeepLearning.AI Machine Learning Specialization',
      'Meta Backend Developer Professional Certificate',
    ],
  });

  // Sync profile skills if available
  useEffect(() => {
    if (profile && profile.skills && profile.skills.length > 0) {
      setResumeData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          languages: profile.skills.slice(0, 5),
          frameworks: profile.skills.slice(5, 10).length > 0 ? profile.skills.slice(5, 10) : prev.skills.frameworks,
        },
      }));
    }
  }, [profile]);

  const handlePrint = () => {
    window.print();
  };

  const handleRoleChange = (newRole) => {
    setResumeData((prev) => ({
      ...prev,
      title: newRole,
      summary: `Results-driven ${newRole} with strong hands-on experience in building scalable backend services, designing predictive architectures, and deploying reliable production systems. Proficient in modern engineering workflows, technical problem-solving, and cross-functional leadership.`,
    }));
    showToast(`Resume tailored for ${newRole}!`, 'success');
  };

  return (
    <div style={{ minHeight: '90vh', padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Controls Toolbar (hidden during print) */}
        <div className="glass-panel p-3 mb-4 no-print d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <Link to="/results" className="btn btn-sm btn-neon-outline">
              <ArrowLeft size={15} /> Back to Results
            </Link>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Target Role: <strong style={{ color: '#00f2fe' }}>{resumeData.title}</strong>
            </span>
          </div>

          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto">
            <select
              className="form-select form-select-sm w-100 w-sm-auto"
              style={{
                background: 'rgba(15, 19, 36, 0.9)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
              value={resumeData.title}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="ML Engineer">ML Engineer</option>
              <option value="Python Developer">Python Developer</option>
              <option value="Django Developer">Django Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Cloud Engineer">Cloud Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>

            <button onClick={handlePrint} className="btn btn-sm btn-neon-primary w-100 w-sm-auto text-nowrap">
              <Printer size={16} /> Print / Save as PDF
            </button>
          </div>
        </div>

        {/* ================= ATS-OPTIMIZED RESUME DOCUMENT ================= */}
        <div
          className="resume-paper p-3 p-md-5"
          style={{
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
            lineHeight: '1.5',
            overflowX: 'hidden',
          }}
        >
          {/* Header */}
          <div className="text-center pb-3 border-bottom border-2 border-dark mb-3">
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {resumeData.fullName}
            </h1>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2563eb', marginBottom: '8px' }}>
              {resumeData.title}
            </div>
            <div className="resume-contact-links" style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              <span>📍 {resumeData.location}</span>
              <span>✉️ {resumeData.email}</span>
              <span>📞 {resumeData.phone}</span>
              <span style={{ wordBreak: 'break-all' }}>🔗 {resumeData.linkedin}</span>
              <span style={{ wordBreak: 'break-all' }}>💻 {resumeData.github}</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-3">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
              Professional Summary
            </h5>
            <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: '1.6' }}>
              {resumeData.summary}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="mb-3">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
              Technical Proficiencies
            </h5>
            <div style={{ fontSize: '0.86rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Programming Languages: </strong>
                {resumeData.skills.languages.join(', ')}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Frameworks & Libraries: </strong>
                {resumeData.skills.frameworks.join(', ')}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Cloud, Database & DevOps: </strong>
                {resumeData.skills.cloudDevOps.join(', ')}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Concepts & Methodologies: </strong>
                {resumeData.skills.methodologies.join(', ')}
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="mb-3">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>
              Professional Experience
            </h5>
            <div className="d-flex flex-column gap-3">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                      {exp.role} — <span style={{ color: '#2563eb' }}>{exp.company}</span>
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                      {exp.duration} | {exp.location}
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#334155' }}>
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '3px' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Projects */}
          <div className="mb-3">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>
              Key Technical Projects
            </h5>
            <div className="d-flex flex-column gap-3">
              {resumeData.projects.map((proj, pIdx) => (
                <div key={pIdx}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      {proj.name}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                      {proj.tech}
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#334155' }}>
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '3px' }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="row g-3">
            <div className="col-12 col-md-7">
              <h5 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                Education
              </h5>
              <div style={{ fontSize: '0.86rem', color: '#334155' }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {resumeData.education.degree} ({resumeData.education.field})
                </div>
                <div>{resumeData.education.institution}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Graduation: {resumeData.education.year} • GPA: {resumeData.education.gpa}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-5">
              <h5 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                Certifications
              </h5>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.82rem', color: '#334155' }}>
                {resumeData.certifications.map((cert, cIdx) => (
                  <li key={cIdx} style={{ marginBottom: '2px' }}>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
