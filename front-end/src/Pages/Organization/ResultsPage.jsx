import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  useEffect(() => {
    loadEvaluations();
  }, []);
  
  const loadEvaluations = () => {
    const allEvaluations = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluation = JSON.parse(localStorage.getItem(key));
        // Only show submitted or approved evaluations
        if (evaluation.status === 'approved' || evaluation.status === 'submitted') {
          allEvaluations.push(evaluation);
        }
      }
    }
    
    allEvaluations.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    setEvaluations(allEvaluations);
    
    if (allEvaluations.length > 0) {
      setSelectedEvaluation(allEvaluations[0]);
    }
  };
  
  const calculateScore = (evaluation) => {
    if (!evaluation || !evaluation.responses) return 0;
    
    const responses = Object.values(evaluation.responses);
    if (responses.length === 0) return 0;
    
    const totalScore = responses.reduce((sum, response) => {
      return sum + (response.maturityLevel || 0);
    }, 0);
    
    const maxScore = responses.length * 3;
    return Math.round((totalScore / maxScore) * 100);
  };
  
  const getGovernanceLabel = (score) => {
    if (score >= 90) return { label: 'Platinum', color: '#8b5cf6', emoji: '💎', bgColor: '#f3e8ff' };
    if (score >= 80) return { label: 'Gold', color: '#f59e0b', emoji: '🥇', bgColor: '#fef3c7' };
    if (score >= 65) return { label: 'Silver', color: '#6b7280', emoji: '🥈', bgColor: '#f3f4f6' };
    if (score >= 50) return { label: 'Bronze', color: '#c2410c', emoji: '🥉', bgColor: '#fed7aa' };
    return { label: 'Not Certified', color: '#ef4444', emoji: '📋', bgColor: '#fee2e2' };
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
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    headerContent: {
      maxWidth: '1280px',
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
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
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
      display: 'flex',
      maxWidth: '1280px',
      margin: '0 auto',
    },
    sidebar: {
      width: '250px',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      padding: '24px 0',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    menuItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      borderLeft: '3px solid #2563eb',
    },
    main: {
      flex: 1,
      padding: '32px 24px',
    },
    pageTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    pageSubtitle: {
      color: '#6b7280',
      marginBottom: '32px',
    },
    selector: {
      marginBottom: '32px',
    },
    select: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      minWidth: '300px',
      cursor: 'pointer',
      background: 'white',
    },
    scoreCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '60px 40px',
      color: 'white',
      marginBottom: '32px',
      textAlign: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    scoreValue: {
      fontSize: '80px',
      fontWeight: 'bold',
      marginBottom: '16px',
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    scoreLabel: {
      fontSize: '24px',
      marginBottom: '24px',
      opacity: 0.9,
    },
    labelBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 32px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '24px',
      fontSize: '20px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px',
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    emptyText: {
      color: '#6b7280',
      marginBottom: '24px',
    },
    button: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    metricCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    metricValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#2563eb',
      marginBottom: '8px',
    },
    metricLabel: {
      fontSize: '14px',
      color: '#6b7280',
    },
  };
  
  if (evaluations.length === 0) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.logo} onClick={() => navigate('/organization/dashboard')}>
              <div style={styles.logoIcon}>🛡️</div>
              <span style={styles.logoText}>Governance Platform</span>
            </div>
            
            <div style={styles.userSection}>
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
          <aside style={styles.sidebar}>
            <div 
              style={styles.menuItem}
              onClick={() => navigate('/organization/dashboard')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </div>
            <div 
              style={styles.menuItem}
              onClick={() => navigate('/organization/evaluations')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>📝</span>
              <span>Evaluations</span>
            </div>
            <div style={{...styles.menuItem, ...styles.menuItemActive}}>
              <span>📈</span>
              <span>Results</span>
            </div>
            <div 
              style={styles.menuItem}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>⚙️</span>
              <span>Settings</span>
            </div>
          </aside>
          
          <main style={styles.main}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📊</div>
              <h3 style={styles.emptyTitle}>No Results Available</h3>
              <p style={styles.emptyText}>
                Complete and submit an evaluation to see your results
              </p>
              <button 
                style={styles.button}
                onClick={() => navigate('/organization/evaluations/new')}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = '#2563eb'}
              >
                Start New Evaluation
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  const score = calculateScore(selectedEvaluation);
  const governanceLabel = getGovernanceLabel(score);
  const totalResponses = Object.keys(selectedEvaluation?.responses || {}).length;
  const completedResponses = Object.values(selectedEvaluation?.responses || {}).filter(r => r.maturityLevel !== null).length;
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/organization/dashboard')}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform</span>
          </div>
          
          <div style={styles.userSection}>
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
        <aside style={styles.sidebar}>
          <div 
            style={styles.menuItem}
            onClick={() => navigate('/organization/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </div>
          <div 
            style={styles.menuItem}
            onClick={() => navigate('/organization/evaluations')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📝</span>
            <span>Evaluations</span>
          </div>
          <div style={{...styles.menuItem, ...styles.menuItemActive}}>
            <span>📈</span>
            <span>Results</span>
          </div>
          <div 
            style={styles.menuItem}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </div>
        </aside>
        
        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Evaluation Results</h1>
          <p style={styles.pageSubtitle}>View your governance evaluation scores and insights</p>
          
          {/* Evaluation Selector */}
          <div style={styles.selector}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Select Evaluation:
            </label>
            <select 
              style={styles.select}
              value={selectedEvaluation?.id || ''}
              onChange={(e) => {
                const evaluation = evaluations.find(ev => ev.id === parseInt(e.target.value));
                setSelectedEvaluation(evaluation);
              }}
            >
              {evaluations.map(evaluation => (
                <option key={evaluation.id} value={evaluation.id}>
                  {evaluation.name} - {new Date(evaluation.createdDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          
          {/* Score Card */}
          <div style={styles.scoreCard}>
            <div style={styles.scoreValue}>{score}%</div>
            <div style={styles.scoreLabel}>Governance Score</div>
            <div style={styles.labelBadge}>
              <span style={{ fontSize: '24px' }}>{governanceLabel.emoji}</span>
              <span>{governanceLabel.label}</span>
            </div>
          </div>
          
          {/* Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{totalResponses}</div>
              <div style={styles.metricLabel}>Total Criteria</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{completedResponses}</div>
              <div style={styles.metricLabel}>Completed</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>
                {selectedEvaluation?.period || 'N/A'}
              </div>
              <div style={styles.metricLabel}>Period</div>
            </div>
            <div style={styles.metricCard}>
              <div style={{...styles.metricValue, color: governanceLabel.color}}>
                {governanceLabel.label}
              </div>
              <div style={styles.metricLabel}>Label</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultsPage;