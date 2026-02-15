import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EvaluationsListPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [evaluations, setEvaluations] = useState([]);
  
  useEffect(() => {
    loadEvaluations();
  }, []);
  
  const loadEvaluations = () => {
    const allEvaluations = [];
    
    // Get all items from localStorage that start with 'evaluation_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluation = JSON.parse(localStorage.getItem(key));
        allEvaluations.push(evaluation);
      }
    }
    
    // Sort by creation date (newest first)
    allEvaluations.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    
    setEvaluations(allEvaluations);
  };
  
  const getStatusColor = (status) => {
    const colors = {
      draft: '#6b7280',
      'in-progress': '#3b82f6',
      submitted: '#8b5cf6',
      'under-review': '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };
  
  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      'in-progress': 'In Progress',
      submitted: 'Submitted',
      'under-review': 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return labels[status] || 'Draft';
  };
  
  const calculateProgress = (evaluation) => {
    if (!evaluation.responses) return 0;
    const totalCriteria = Object.keys(evaluation.responses).length;
    const completedCriteria = Object.values(evaluation.responses).filter(r => r.maturityLevel !== null).length;
    return totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };
  
  const handleDelete = (evaluationId, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      localStorage.removeItem(`evaluation_${evaluationId}`);
      loadEvaluations();
    }
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
    actionBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    newBtn: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px',
    },
    cardDate: {
      fontSize: '14px',
      color: '#6b7280',
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    cardDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '16px',
      lineHeight: '1.5',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      background: '#2563eb',
      transition: 'width 0.3s',
    },
    progressText: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '16px',
    },
    cardActions: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: {
      flex: 1,
      padding: '8px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      transition: 'all 0.2s',
    },
    deleteButton: {
      padding: '8px 16px',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#dc2626',
      transition: 'all 0.2s',
    },
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
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
        {/* Sidebar */}
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
          <div style={{...styles.menuItem, ...styles.menuItemActive}}>
            <span>📝</span>
            <span>Evaluations</span>
          </div>
          <div 
            style={styles.menuItem}
            onClick={() => navigate('/organization/results')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
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
        
        {/* Main Content */}
        <main style={styles.main}>
          <h1 style={styles.pageTitle}>My Evaluations</h1>
          <p style={styles.pageSubtitle}>
            Manage all your governance evaluations
          </p>
          
          <div style={styles.actionBar}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''}
            </p>
            <button 
              style={styles.newBtn}
              onClick={() => navigate('/organization/evaluations/new')}
              onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.background = '#2563eb'}
            >
              <span>➕</span>
              <span>New Evaluation</span>
            </button>
          </div>
          
          {/* Empty State */}
          {evaluations.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <h3 style={styles.emptyTitle}>No evaluations yet</h3>
              <p style={styles.emptyText}>
                Start your first governance evaluation to get insights
              </p>
              <button 
                style={styles.newBtn}
                onClick={() => navigate('/organization/evaluations/new')}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = '#2563eb'}
              >
                <span>➕</span>
                <span>Start First Evaluation</span>
              </button>
            </div>
          ) : (
            /* Evaluations Grid */
            <div style={styles.grid}>
              {evaluations.map((evaluation) => {
                const progress = calculateProgress(evaluation);
                
                return (
                  <div 
                    key={evaluation.id}
                    style={styles.card}
                    onClick={() => navigate(`/organization/evaluations/${evaluation.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                  >
                    <div style={styles.cardHeader}>
                      <div style={{ flex: 1 }}>
                        <h3 style={styles.cardTitle}>{evaluation.name}</h3>
                        <p style={styles.cardDate}>
                          Created: {new Date(evaluation.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        background: `${getStatusColor(evaluation.status)}20`,
                        color: getStatusColor(evaluation.status),
                      }}>
                        {getStatusLabel(evaluation.status)}
                      </span>
                    </div>
                    
                    {evaluation.description && (
                      <p style={styles.cardDescription}>
                        {evaluation.description.length > 100 
                          ? evaluation.description.substring(0, 100) + '...' 
                          : evaluation.description}
                      </p>
                    )}
                    
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                      Period: {evaluation.period}
                    </p>
                    
                    <div style={styles.progressBar}>
                      <div style={{...styles.progressFill, width: `${progress}%`}} />
                    </div>
                    <p style={styles.progressText}>{progress}% complete</p>
                    
                    <div style={styles.cardActions}>
                      <button 
                        style={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/organization/evaluations/${evaluation.id}`);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f9fafb';
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.color = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.color = '#374151';
                        }}
                      >
                        View Details
                      </button>
                      <button 
                        style={styles.deleteButton}
                        onClick={(e) => handleDelete(evaluation.id, e)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EvaluationsListPage;