import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES, MATURITY_LEVELS } from '../../../utils/constants';
import CriteriaReview from './CriteriaReview';
import ReviewNotes from './ReviewNotes';
import ValidationForm from './ValidationForm';
import EvidenceViewer from './EvidenceViewer';

const ReviewInterface = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPrinciples, setExpandedPrinciples] = useState([1]);
  const [expandedPractices, setExpandedPractices] = useState({});
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.status === 'submitted') {
        parsed.status = 'under-review';
        localStorage.setItem(`evaluation_${id}`, JSON.stringify(parsed));
      }
      setEvaluation(parsed);
    }
    setLoading(false);
  }, [id]);

  const handleApproveReject = (decision, comment) => {
    const updated = {
      ...evaluation,
      status: decision,
      reviewedBy: user.fullName,
      reviewedDate: new Date().toISOString(),
      reviewComment: comment,
    };
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updated));
    alert(`Evaluation ${decision === 'approved' ? 'approved' : 'rejected'} successfully!`);
    navigate('/evaluator/queue');
  };

  const togglePrinciple = (pid) => {
    setExpandedPrinciples(prev =>
      prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]
    );
  };

  const togglePractice = (pid, practiceId) => {
    const key = `${pid}-${practiceId}`;
    setExpandedPractices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateScore = () => {
    if (!evaluation?.responses) return 0;
    const responses = Object.values(evaluation.responses);
    if (!responses.length) return 0;
    const total = responses.reduce((sum, r) => sum + (r.maturityLevel || 0), 0);
    return Math.round((total / (responses.length * 3)) * 100);
  };

  const getPrincipleProgress = (principle) => {
    const total = principle.practices.reduce((s, p) => s + p.criteria.length, 0);
    const completed = principle.practices.reduce((s, p) =>
      s + p.criteria.filter(c => {
        const key = `${principle.id}-${p.id}-${c.id}`;
        return evaluation?.responses?.[key]?.maturityLevel != null;
      }).length, 0);
    return { completed, total };
  };

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb' },
    header: {
      background: 'white', borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '8px' },
    logoIcon: {
      width: '40px', height: '40px', background: '#2563eb', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    },
    layout: {
      maxWidth: '1400px', margin: '0 auto',
      display: 'flex', gap: '24px', padding: '24px',
    },
    sidebar: {
      width: '280px', position: 'sticky', top: '88px',
      height: 'fit-content', maxHeight: 'calc(100vh - 112px)',
      overflowY: 'auto', background: 'white', borderRadius: '12px',
      padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    sidebarTitle: {
      fontSize: '13px', fontWeight: '600', color: '#6b7280',
      marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    navItem: {
      padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
      fontSize: '13px', transition: 'all 0.2s',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '4px',
    },
    navItemActive: { background: '#eff6ff', color: '#2563eb', fontWeight: '500' },
    progressBadge: {
      fontSize: '11px', padding: '2px 8px',
      borderRadius: '10px', background: '#f3f4f6', color: '#6b7280',
    },
    main: { flex: 1, minWidth: 0 },
    backBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb',
      borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
      color: '#374151', marginBottom: '24px',
    },
    formHeader: {
      background: 'white', borderRadius: '12px', padding: '24px',
      marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formTitle: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    scoreCard: {
      display: 'flex', alignItems: 'center', gap: '32px',
      padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px', color: 'white', marginTop: '16px',
    },
    principleSection: {
      background: 'white', borderRadius: '12px',
      marginBottom: '16px', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    principleHeader: {
      padding: '20px 24px', cursor: 'pointer',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#fafafa', borderBottom: '1px solid #e5e7eb',
    },
    principleTitle: {
      fontSize: '17px', fontWeight: '600', color: '#111827',
      display: 'flex', alignItems: 'center', gap: '12px',
    },
    principleNumber: {
      width: '32px', height: '32px', background: '#2563eb', color: 'white',
      borderRadius: '8px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '14px', fontWeight: 'bold',
    },
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading...</p>
    </div>
  );

  if (!evaluation) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column' }}>
      <p style={{ fontSize: '48px' }}>❌</p>
      <p style={{ fontWeight: '600', marginBottom: '16px' }}>Evaluation not found</p>
      <button onClick={() => navigate('/evaluator/queue')}
        style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >Back to Queue</button>
    </div>
  );

  const score = calculateScore();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🛡️</div>
          <span style={styles.logoText}>Governance Platform - Evaluator</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <span>👤</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.fullName || 'Evaluator'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >Logout</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Principles</p>
          {GOVERNANCE_PRINCIPLES.map((principle) => {
            const { completed, total } = getPrincipleProgress(principle);
            const isActive = expandedPrinciples.includes(principle.id);
            return (
              <div
                key={principle.id}
                style={{ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) }}
                onClick={() => {
                  togglePrinciple(principle.id);
                  document.getElementById(`principle-${principle.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <span>{principle.id}. {principle.name}</span>
                <span style={styles.progressBadge}>{completed}/{total}</span>
              </div>
            );
          })}
        </aside>

        <main style={styles.main}>
          <button style={styles.backBtn}
            onClick={() => navigate('/evaluator/queue')}
            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.background = 'white'}
          >← Back to Queue</button>

          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Review: {evaluation.name}</h1>
            <p style={{ color: '#6b7280' }}>Period: {evaluation.period}</p>
            <div style={styles.scoreCard}>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{score}%</div>
                <div style={{ opacity: 0.9 }}>Overall Score</div>
              </div>
              <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '32px' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                  Submitted: {new Date(evaluation.submittedDate || evaluation.createdDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  Status: {evaluation.status}
                </div>
              </div>
            </div>
          </div>

          {GOVERNANCE_PRINCIPLES.map((principle) => {
            const isExpanded = expandedPrinciples.includes(principle.id);
            const { completed, total } = getPrincipleProgress(principle);

            return (
              <div key={principle.id} id={`principle-${principle.id}`} style={styles.principleSection}>
                <div style={styles.principleHeader} onClick={() => togglePrinciple(principle.id)}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                >
                  <div style={styles.principleTitle}>
                    <div style={styles.principleNumber}>{principle.id}</div>
                    <div>
                      <div>{principle.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '400', marginTop: '2px' }}>
                        {principle.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{completed}/{total} criteria</span>
                    <span>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '24px' }}>
                    {principle.practices.map((practice) => {
                      const practiceKey = `${principle.id}-${practice.id}`;
                      const isPracticeExpanded = expandedPractices[practiceKey];

                      return (
                        <div key={practice.id} style={{
                          marginBottom: '16px', border: '1px solid #e5e7eb',
                          borderRadius: '8px', overflow: 'hidden',
                        }}>
                          <div
                            style={{
                              padding: '14px 20px', background: '#f9fafb', cursor: 'pointer',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}
                            onClick={() => togglePractice(principle.id, practice.id)}
                          >
                            <span style={{ fontWeight: '600', color: '#374151' }}>
                              Practice {practice.id}: {practice.name}
                            </span>
                            <span>{isPracticeExpanded ? '▲' : '▼'}</span>
                          </div>

                          {isPracticeExpanded && (
                            <div style={{ padding: '20px' }}>
                              {practice.criteria.map((criterion) => {
                                const key = `${principle.id}-${practice.id}-${criterion.id}`;
                                const response = evaluation.responses?.[key] || {};
                                const maturity = MATURITY_LEVELS.find(l => l.value === response.maturityLevel);

                                return (
                                  <CriteriaReview
                                    key={criterion.id}
                                    criterion={criterion}
                                    response={response}
                                    maturity={maturity}
                                    onViewEvidence={() => setSelectedEvidence(response)}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <ReviewNotes evaluation={evaluation} />
          <ValidationForm
            evaluation={evaluation}
            onApprove={(comment) => handleApproveReject('approved', comment)}
            onReject={(comment) => handleApproveReject('rejected', comment)}
            onCancel={() => navigate('/evaluator/queue')}
          />
        </main>
      </div>

      {selectedEvidence && (
        <EvidenceViewer
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
};

export default ReviewInterface;