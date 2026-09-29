import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Calendar, ArrowRight, Sparkles, User, AlertCircle, RefreshCw } from 'lucide-react';
import { getRecommendationHistory } from '../api/recommender';
import { useToast } from '../context/ToastContext';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getRecommendationHistory();
      setHistoryItems(data.results || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      showToast('Could not load recommendation history.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenResults = (item) => {
    navigate('/results', {
      state: {
        recommendations: item.results,
        query_snapshot: item.query_snapshot,
      },
    });
  };

  return (
    <div style={{ minHeight: '88vh', padding: '50px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill" style={{ background: 'rgba(127, 0, 255, 0.15)', color: '#a855f7' }}>
                SESSION ARCHIVE
              </span>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '2.1rem', margin: 0 }}>
              Recommendation <span className="text-gradient">History</span>
            </h2>
          </div>
          <button onClick={fetchHistory} className="btn btn-sm btn-neon-outline">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading history...</span>
            </div>
            <p className="mt-3 text-muted">Retrieving past recommendation sessions...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="glass-panel p-5 text-center my-4">
            <History size={48} color="#64748b" className="mb-3" />
            <h4 style={{ fontWeight: 700, color: '#fff' }}>No Saved Recommendations Yet</h4>
            <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto 24px auto' }}>
              Whenever you run the recommendation engine while logged in, your full query snapshots and matching results are safely archived here.
            </p>
            <Link to="/profile" className="btn-neon-primary">
              Run Your First Recommendation <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {historyItems.map((item) => {
              const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const topRole = item.results?.[0];
              const skillsList = item.query_snapshot?.skills || [];
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="glass-panel p-4"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={16} color="#00f2fe" />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4fc' }}>
                        {dateStr}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => handleOpenResults(item)}
                        className="btn btn-sm btn-neon-primary py-1 px-3"
                        style={{ fontSize: '0.8rem' }}
                      >
                        View Dashboard <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Top Match Pill */}
                  {topRole && (
                    <div
                      className="p-3 mb-3 d-flex align-items-center justify-content-between"
                      style={{
                        background: 'rgba(0, 242, 254, 0.06)',
                        borderRadius: '10px',
                        border: '1px solid rgba(0, 242, 254, 0.2)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#00f2fe', fontWeight: 700, textTransform: 'uppercase' }}>
                          Primary Match
                        </span>
                        <h5 style={{ margin: '2px 0 0 0', fontWeight: 700, color: '#fff' }}>
                          {topRole.role}
                        </h5>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00f5a0' }}>
                        {topRole.match_percent}%
                      </div>
                    </div>
                  )}

                  {/* Skills Snapshot */}
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                      Skills Query:
                    </span>
                    {skillsList.map((skill) => (
                      <span key={skill} className="skill-chip skill-chip-neutral py-1 px-2" style={{ fontSize: '0.75rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
