import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES, MATURITY_LEVELS } from '../../utils/constants';

const EvaluationFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [evaluation, setEvaluation] = useState(null);
  const [responses, setResponses] = useState({});
  const [expandedPrinciples, setExpandedPrinciples] = useState([1]); // First principle expanded by default
  const [expandedPractices, setExpandedPractices] = useState({});
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    loadEvaluation();
  }, [id]);
  
  const loadEvaluation = () => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      const evalData = JSON.parse(data);
      setEvaluation(evalData);
      setResponses(evalData.responses || {});
    } else {
      alert('Evaluation not found!');
      navigate('/organization/evaluations');
    }
  };
  
  const handleMaturityChange = (principleId, practiceId, criterionId, level) => {
    const key = `${principleId}-${practiceId}-${criterionId}`;
    
    setResponses(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        principleId,
        practiceId,
        criterionId,
        maturityLevel: level,
      }
    }));
  };
  
  const handleCommentChange = (principleId, practiceId, criterionId, comment) => {
    const key = `${principleId}-${practiceId}-${criterionId}`;
    
    setResponses(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        principleId,
        practiceId,
        criterionId,
        comment,
      }
    }));
  };
  
  const handleFileUpload = (principleId, practiceId, criterionId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const key = `${principleId}-${practiceId}-${criterionId}`;
    
    setResponses(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        principleId,
        practiceId,
        criterionId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      }
    }));
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
  
  const calculateProgress = () => {
    const totalCriteria = GOVERNANCE_PRINCIPLES.reduce((sum, principle) => {
      return sum + principle.practices.reduce((pSum, practice) => {
        return pSum + practice.criteria.length;
      }, 0);
    }, 0);
    
    const completedCriteria = Object.values(responses).filter(r => r.maturityLevel !== null && r.maturityLevel !== undefined).length;
    
    return totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0;
  };
  
  const getPrincipleProgress = (principle) => {
    const totalCriteria = principle.practices.reduce((sum, practice) => sum + practice.criteria.length, 0);
    
    const completedCriteria = principle.practices.reduce((sum, practice) => {
      return sum + practice.criteria.filter(criterion => {
        const key = `${principle.id}-${practice.id}-${criterion.id}`;
        return responses[key]?.maturityLevel !== null && responses[key]?.maturityLevel !== undefined;
      }).length;
    }, 0);
    
    return { completed: completedCriteria, total: totalCriteria };
  };
  
  const handleSaveDraft = () => {
    if (!evaluation) return;
    
    setSaving(true);
    
    const updatedEvaluation = {
      ...evaluation,
      responses,
      lastModified: new Date().toISOString(),
      status: 'draft',
    };
    
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEvaluation));
    
    setTimeout(() => {
      setSaving(false);
      alert('Draft saved successfully!');
    }, 500);
  };
  
  const handleSubmit = () => {
    const progress = calculateProgress();
    
    if (progress < 100) {
      if (!window.confirm(`Your evaluation is only ${progress}% complete. Do you want to submit anyway?`)) {
        return;
      }
    }
    
    const updatedEvaluation = {
      ...evaluation,
      responses,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
    };
    
    localStorage.setItem(`evaluation_${id}`, JSON.stringify(updatedEvaluation));
    
    alert('Evaluation submitted successfully!');
    navigate(`/organization/evaluations/${id}`);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
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
    saveDraftBtn: {
      padding: '8px 16px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
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
    progressContainer: {
      marginTop: '16px',
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
    },
    progressBar: {
      width: '100%',
      height: '12px',
      background: '#e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
      transition: 'width 0.3s ease',
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
    principleProgress: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
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
      marginBottom: '8px',
      fontStyle: 'italic',
    },
    maturityLevels: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '16px',
    },
    maturityOption: {
      position: 'relative',
      cursor: 'pointer',
    },
    maturityInput: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0,
    },
    maturityLabel: {
      display: 'block',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      textAlign: 'center',
      transition: 'all 0.2s',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    maturityLabelSelected: {
      borderColor: '#2563eb',
      background: '#eff6ff',
      color: '#2563eb',
    },
    maturityValue: {
      display: 'block',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    uploadSection: {
      marginTop: '12px',
    },
    uploadLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
      display: 'block',
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: '#fafafa',
    },
    uploadAreaHover: {
      borderColor: '#2563eb',
      background: '#eff6ff',
    },
    uploadIcon: {
      fontSize: '24px',
      marginBottom: '8px',
    },
    uploadText: {
      fontSize: '13px',
      color: '#6b7280',
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      background: '#f3f4f6',
      borderRadius: '8px',
      marginTop: '8px',
    },
    commentSection: {
      marginTop: '12px',
    },
    commentLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
      display: 'block',
    },
    commentInput: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    actionButtons: {
      position: 'sticky',
      bottom: '20px',
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 -4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px',
    },
    cancelBtn: {
      padding: '12px 24px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    submitBtn: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
  };
  
  if (!evaluation) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  const overallProgress = calculateProgress();
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/organization/dashboard')}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform</span>
          </div>
          
          <div style={styles.headerRight}>
            <button 
              style={styles.saveDraftBtn}
              onClick={handleSaveDraft}
              disabled={saving}
              onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
            >
              {saving ? '💾 Saving...' : '💾 Save Draft'}
            </button>
            
            <div style={styles.userInfo}>
              <span>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.fullName || 'User'}
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
        {/* Sidebar Navigation */}
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
        
        {/* Main Form */}
        <main style={styles.main}>
          {/* Form Header */}
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Evaluation Form</h1>
            <p style={styles.formSubtitle}>{evaluation.name}</p>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressLabel}>
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${overallProgress}%`}} />
              </div>
            </div>
          </div>
          
          {/* Principles */}
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
                  
                  <div style={styles.principleProgress}>
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
                                const response = responses[key] || {};
                                
                                return (
                                  <div key={criterion.id} style={styles.criterionCard}>
                                    <div style={styles.criterionTitle}>
                                      Criterion {criterion.id}: {criterion.text}
                                    </div>
                                    
                                    <div style={styles.evidenceLabel}>
                                      📎 Evidence: {criterion.evidence}
                                    </div>
                                    
                                    {/* Maturity Level Selector */}
                                    <div style={styles.maturityLevels}>
                                      {MATURITY_LEVELS.map((level) => (
                                        <div key={level.value} style={styles.maturityOption}>
                                          <input
                                            type="radio"
                                            id={`${key}-${level.value}`}
                                            name={key}
                                            value={level.value}
                                            checked={response.maturityLevel === level.value}
                                            onChange={() => handleMaturityChange(principle.id, practice.id, criterion.id, level.value)}
                                            style={styles.maturityInput}
                                          />
                                          <label
                                            htmlFor={`${key}-${level.value}`}
                                            style={{
                                              ...styles.maturityLabel,
                                              ...(response.maturityLevel === level.value ? styles.maturityLabelSelected : {})
                                            }}
                                          >
                                            <span style={styles.maturityValue}>{level.value}</span>
                                            <span>{level.label}</span>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* File Upload */}
                                    <div style={styles.uploadSection}>
                                      <label style={styles.uploadLabel}>
                                        Supporting Evidence:
                                      </label>
                                      <label 
                                        style={styles.uploadArea}
                                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.uploadAreaHover)}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.borderColor = '#d1d5db';
                                          e.currentTarget.style.background = '#fafafa';
                                        }}
                                      >
                                        <input
                                          type="file"
                                          style={{ display: 'none' }}
                                          onChange={(e) => handleFileUpload(principle.id, practice.id, criterion.id, e)}
                                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <div style={styles.uploadIcon}>📎</div>
                                        <div style={styles.uploadText}>
                                          Click to upload or drag and drop
                                        </div>
                                      </label>
                                      
                                      {response.fileName && (
                                        <div style={styles.fileInfo}>
                                          <span>📄</span>
                                          <span style={{ flex: 1, fontSize: '13px' }}>{response.fileName}</span>
                                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {(response.fileSize / 1024).toFixed(1)} KB
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Comment */}
                                    <div style={styles.commentSection}>
                                      <label style={styles.commentLabel}>
                                        Comment (optional):
                                      </label>
                                      <textarea
                                        style={styles.commentInput}
                                        placeholder="Add any additional comments or context..."
                                        value={response.comment || ''}
                                        onChange={(e) => handleCommentChange(principle.id, practice.id, criterion.id, e.target.value)}
                                      />
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
          
          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={styles.cancelBtn}
              onClick={() => navigate('/organization/evaluations')}
              onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
            >
              Cancel
            </button>
            <button
              style={styles.submitBtn}
              onClick={handleSubmit}
              onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.background = '#2563eb'}
            >
              Submit Evaluation
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvaluationFormPage;