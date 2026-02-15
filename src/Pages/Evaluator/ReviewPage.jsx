import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES, MATURITY_LEVELS } from '../../utils/constants';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPrinciples, setExpandedPrinciples] = useState([1]);
  const [expandedPractices, setExpandedPractices] = useState({});
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDecision, setReviewDecision] = useState('');
  
  useEffect(() => {
    loadEvaluation();
  }, [id]);
  
  const loadEvaluation = () => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      setEvaluation(JSON.parse(data));
      if (JSON.parse(data).status === 'submitted') {
        const updated = JSON.parse(data);
        updated.status = 'under-review';
        localStorage.setItem(`evaluation_${id}`, JSON.stringify(updated));
        setEvaluation(updated);
      }
    }
    setLoading(false);
  };
  
  const togglePrinciple = (principleId) => {
    setExpandedPrinciples(prev => 
      prev.includes(principleId)
        ? prev.filter(id => id !== principleId)
        : [...prev, principleId]
    );
  };
  
  const togglePractice = (principleId, practiceId) => {
    const key = `${principleId}-${practiceId}`;
    setExpandedPractices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const calculateScore = () => {
    if (!evaluation || !evaluation.responses) return 0;
    
    const responses = Object.values(evaluation.responses);
    if (responses.length === 0) return 0;
    
    const totalScore = responses.reduce((sum, response) => {
      return sum + (response.maturityLevel || 0);
    }, 0);
    
    const maxScore = responses.length * 3;
    return Math.round((totalScore / maxScore) * 100);
  };
  
  const handleApprove = () => {
    if (!reviewComment.trim()) {
      alert('Please add a review comment before approving');
      return;
    }
    
    const updatedEvaluation = {
      ...evaluation,
      status: 'approved',
      reviewedBy: user.fullName,
      reviewedDate: new Date().toISOString(),
      reviewComment: reviewComment,
    };
    
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEvaluation));
    alert('Evaluation approved successfully!');
    navigate('/evaluator/queue');
  };
  
  const handleReject = () => {
    if (!reviewComment.trim()) {
      alert('Please add a review comment explaining why you are rejecting');
      return;
    }
    
    const updatedEvaluation = {
      ...evaluation,
      status: 'rejected',
      reviewedBy: user.fullName,
      reviewedDate: new Date().toISOString(),
      reviewComment: reviewComment,
    };
    
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEvaluation));
    alert('Evaluation rejected');
    navigate('/evaluator/queue');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };
  
  const getPrincipleProgress = (principle) => {
    const totalCriteria = principle.practices.reduce((sum, practice) => sum + practice.criteria.length, 0);
    
    const completedCriteria = principle.practices.reduce((sum, practice) => {
      return sum + practice.criteria.filter(criterion => {
        const key = `${principle.id}-${practice.id}-${criterion.id}`;
        return evaluation?.responses[key]?.maturityLevel !== null && evaluation?.responses[key]?.maturityLevel !== undefined;
      }).length;
    }, 0);
    
    return { completed: completedCriteria, total: totalCriteria };
  };
  
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f9fafb',
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: '#2563eb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: '#f3f4f6',
      borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    layout: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      gap: '24px',
      padding: '24px',
    },
    sidebar: {
      width: '280px',
      position: 'sticky',
      top: '88px',
      height: 'fit-content',
      maxHeight: 'calc(100vh - 112px)',
      overflowY: 'auto',
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    sidebarTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    principleNav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    principleNavItem: {
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'all 0.2s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    principleNavItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      fontWeight: '500',
    },
    progressBadge: {
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '10px',
      background: '#f3f4f6',
      color: '#6b7280',
    },
    main: {
      flex: 1,
      minWidth: 0,
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#374151',
      marginBottom: '24px',
    },
    formHeader: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    formSubtitle: {
      color: '#6b7280',
      marginBottom: '16px',
    },
    scoreCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
    },
    scoreValue: {
      fontSize: '48px',
      fontWeight: 'bold',
    },
    scoreLabel: {
      fontSize: '16px',
      opacity: 0.9,
    },
    principleSection: {
      background: 'white',
      borderRadius: '12px',
      marginBottom: '20px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    principleHeader: {
      padding: '20px 24px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fafafa',
      borderBottom: '1px solid #e5e7eb',
      transition: 'background 0.2s',
    },
    principleHeaderExpanded: {
      background: '#f3f4f6',
    },
    principleTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    principleNumber: {
      width: '32px',
      height: '32px',
      background: '#2563eb',
      color: 'white',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    chevron: {
      transition: 'transform 0.2s',
    },
    chevronExpanded: {
      transform: 'rotate(180deg)',
    },
    principleContent: {
      padding: '24px',
    },
    practiceSection: {
      marginBottom: '24px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    practiceHeader: {
      padding: '16px 20px',
      background: '#f9fafb',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    practiceTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
    },
    practiceContent: {
      padding: '20px',
      background: 'white',
    },
    criterionCard: {
      marginBottom: '24px',
      paddingBottom: '24px',
      borderBottom: '1px solid #f3f4f6',
    },
    criterionTitle: {
      fontSize: '15px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '12px',
      lineHeight: '1.5',
    },
    evidenceLabel: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '12px',
      fontStyle: 'italic',
    },
    responseCard: {
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    responseRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    responseLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
    },
    maturityBadge: {
      padding: '6px 16px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '600',
    },
    commentBox: {
      marginTop: '12px',
      padding: '12px',
      background: 'white',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#374151',
      lineHeight: '1.6',
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      background: 'white',
      borderRadius: '6px',
      marginTop: '8px',
    },
    reviewSection: {
      position: 'sticky',
      bottom: '20px',
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 -4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
      marginTop: '24px',
    },
    reviewTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      marginBottom: '16px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    approveBtn: {
      flex: 1,
      padding: '12px 24px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
    },
    rejectBtn: {
      flex: 1,
      padding: '12px 24px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
    },
    cancelBtn: {
      padding: '12px 24px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
    },
  };
  
  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }
  
  if (!evaluation) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px' }}>
        <p style={{ fontSize: '64px', marginBottom: '16px' }}>❌</p>
        <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Evaluation not found</p>
        <button 
          style={{...styles.cancelBtn, marginTop: '24px'}}
          onClick={() => navigate('/evaluator/queue')}
        >
          Back to Queue
        </button>
      </div>
    );
  }
  
  const score = calculateScore();
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/evaluator/dashboard')}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform - Evaluator</span>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <span>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.fullName || 'Evaluator'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Principles</h3>
          <div style={styles.principleNav}>
            {GOVERNANCE_PRINCIPLES.map((principle) => {
              const { completed, total } = getPrincipleProgress(principle);
              const isExpanded = expandedPrinciples.includes(principle.id);
              
              return (
                <div
                  key={principle.id}
                  style={{
                    ...styles.principleNavItem,
                    ...(isExpanded ? styles.principleNavItemActive : {})
                  }}
                  onClick={() => {
                    togglePrinciple(principle.id);
                    document.getElementById(`principle-${principle.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  onMouseEnter={(e) => !isExpanded && (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => !isExpanded && (e.currentTarget.style.background = 'transparent')}
                >
                  <span>{principle.id}. {principle.name}</span>
                  <span style={styles.progressBadge}>{completed}/{total}</span>
                </div>
              );
            })}
          </div>
        </aside>
        
        <main style={styles.main}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/evaluator/queue')}
            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.background = 'white'}
          >
            ← Back to Queue
          </button>
          
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Review Evaluation</h1>
            <p style={styles.formSubtitle}>{evaluation.name}</p>
            
            <div style={styles.scoreCard}>
              <div>
                <div style={styles.scoreValue}>{score}%</div>
                <div style={styles.scoreLabel}>Overall Score</div>
              </div>
              <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '32px' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>Period: {evaluation.period}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  Submitted: {new Date(evaluation.submittedDate || evaluation.createdDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          {GOVERNANCE_PRINCIPLES.map((principle) => {
            const isExpanded = expandedPrinciples.includes(principle.id);
            const { completed, total } = getPrincipleProgress(principle);
            
            return (
              <div key={principle.id} id={`principle-${principle.id}`} style={styles.principleSection}>
                <div 
                  style={{
                    ...styles.principleHeader,
                    ...(isExpanded ? styles.principleHeaderExpanded : {})
                  }}
                  onClick={() => togglePrinciple(principle.id)}
                  onMouseEnter={(e) => !isExpanded && (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => !isExpanded && (e.currentTarget.style.background = '#fafafa')}
                >
                  <div style={styles.principleTitle}>
                    <div style={styles.principleNumber}>{principle.id}</div>
                    <div>
                      <div>{principle.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '400', marginTop: '4px' }}>
                        {principle.description}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {completed}/{total} criteria
                    </span>
                    <span style={{
                      ...styles.chevron,
                      ...(isExpanded ? styles.chevronExpanded : {})
                    }}>
                      ⌄
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div style={styles.principleContent}>
                    {principle.practices.map((practice) => {
                      const practiceKey = `${principle.id}-${practice.id}`;
                      const isPracticeExpanded = expandedPractices[practiceKey];
                      
                      return (
                        <div key={practice.id} style={styles.practiceSection}>
                          <div 
                            style={styles.practiceHeader}
                            onClick={() => togglePractice(principle.id, practice.id)}
                          >
                            <div style={styles.practiceTitle}>
                              Practice {practice.id}: {practice.name}
                            </div>
                            <span style={{
                              ...styles.chevron,
                              ...(isPracticeExpanded ? styles.chevronExpanded : {})
                            }}>
                              ⌄
                            </span>
                          </div>
                          
                          {isPracticeExpanded && (
                            <div style={styles.practiceContent}>
                              {practice.criteria.map((criterion) => {
                                const key = `${principle.id}-${practice.id}-${criterion.id}`;
                                const response = evaluation.responses[key] || {};
                                
                                const maturityLevel = MATURITY_LEVELS.find(l => l.value === response.maturityLevel);
                                
                                return (
                                  <div key={criterion.id} style={styles.criterionCard}>
                                    <div style={styles.criterionTitle}>
                                      Criterion {criterion.id}: {criterion.text}
                                    </div>
                                    
                                    <div style={styles.evidenceLabel}>
                                      📎 Evidence: {criterion.evidence}
                                    </div>
                                    
                                    <div style={styles.responseCard}>
                                      <div style={styles.responseRow}>
                                        <span style={styles.responseLabel}>Maturity Level:</span>
                                        {maturityLevel ? (
                                          <span style={{
                                            ...styles.maturityBadge,
                                            background: `${maturityLevel.color}20`,
                                            color: maturityLevel.color,
                                          }}>
                                            {maturityLevel.value} - {maturityLevel.label}
                                          </span>
                                        ) : (
                                          <span style={{ fontSize: '14px', color: '#ef4444' }}>Not answered</span>
                                        )}
                                      </div>
                                      
                                      {response.fileName && (
                                        <div style={styles.fileInfo}>
                                          <span>📄</span>
                                          <span style={{ flex: 1, fontSize: '13px' }}>{response.fileName}</span>
                                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {(response.fileSize / 1024).toFixed(1)} KB
                                          </span>
                                        </div>
                                      )}
                                      
                                      {response.comment && (
                                        <div>
                                          <div style={{ ...styles.responseLabel, marginTop: '12px', marginBottom: '8px' }}>
                                            Comment:
                                          </div>
                                          <div style={styles.commentBox}>
                                            {response.comment}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
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
          
          <div style={styles.reviewSection}>
            <h2 style={styles.reviewTitle}>Review Decision</h2>
            <textarea
              style={styles.textarea}
              placeholder="Add your review comments here (required)..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            
            <div style={styles.buttonGroup}>
              <button
                style={styles.cancelBtn}
                onClick={() => navigate('/evaluator/queue')}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                style={styles.rejectBtn}
                onClick={handleReject}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >
                ❌ Reject
              </button>
              <button
                style={styles.approveBtn}
                onClick={handleApprove}
                onMouseEnter={(e) => e.target.style.background = '#059669'}
                onMouseLeave={(e) => e.target.style.background = '#10b981'}
              >
                ✅ Approve
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewPage;