import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EvaluatorDashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [submittedEvaluations, setSubmittedEvaluations] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
  });
  
  useEffect(() => {
    loadEvaluations();
  }, []);
  
  const loadEvaluations = () => {
    const allEvaluations = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluation = JSON.parse(localStorage.getItem(key));
        if (evaluation.status === 'submitted' || evaluation.status === 'under-review' || evaluation.status === 'approved' || evaluation.status === 'rejected') {
          allEvaluations.push(evaluation);
        }
      }
    }
    
    allEvaluations.sort((a, b) => new Date(b.submittedDate || b.createdDate) - new Date(a.submittedDate || a.createdDate));
    
    setSubmittedEvaluations(allEvaluations);
    
    const pending = allEvaluations.filter(e => e.status === 'submitted').length;
    const underReview = allEvaluations.filter(e => e.status === 'under-review').length;
    const approved = allEvaluations.filter(e => e.status === 'approved').length;
    const rejected = allEvaluations.filter(e => e.status === 'rejected').length;
    
    setStats({
      pending,
      reviewed: underReview,
      approved,
      rejected,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };
  
  const getStatusColor = (status) => {
    const colors = {
      submitted: '#8b5cf6',
      'under-review': '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };
  
  const getStatusLabel = (status) => {
    const labels = {
      submitted: 'Pending Review',
      'under-review': 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return labels[status] || status;
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px',
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      marginTop: '12px',
    },
    table: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tableHeader: {
      background: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '16px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6',
      padding: '20px 24px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '16px',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    reviewBtn: {
      padding: '8px 16px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '12px',
    },
  };
  
  const statsData = [
    { label: 'Pending Review', value: stats.pending, icon: '⏳', color: '#8b5cf6', bgColor: '#ede9fe' },
    { label: 'Under Review', value: stats.reviewed, icon: '👁️', color: '#f59e0b', bgColor: '#fef3c7' },
    { label: 'Approved', value: stats.approved, icon: '✅', color: '#10b981', bgColor: '#d1fae5' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', color: '#ef4444', bgColor: '#fee2e2' },
  ];
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/evaluator/dashboard')}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform</span>
          </div>
          
          <div style={styles.userSection}>
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
          <div style={{...styles.menuItem, ...styles.menuItemActive}}>
            <span>📊</span>
            <span>Dashboard</span>
          </div>
          <div 
            style={styles.menuItem}
            onClick={() => navigate('/evaluator/reviews')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📋</span>
            <span>Reviews</span>
          </div>
        </aside>
        
        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Evaluator Dashboard</h1>
          <p style={styles.pageSubtitle}>Review and manage submitted evaluations</p>
          
          <div style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <p style={styles.statLabel}>{stat.label}</p>
                <p style={styles.statValue}>{stat.value}</p>
                <div style={{...styles.statIcon, background: stat.bgColor}}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Evaluation Name</span>
              <span>Period</span>
              <span>Submitted</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            
            {submittedEvaluations.length > 0 ? (
              submittedEvaluations.map((evaluation) => (
                <div 
                  key={evaluation.id}
                  style={styles.tableRow}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontWeight: '500' }}>{evaluation.name}</span>
                  <span>{evaluation.period}</span>
                  <span>{new Date(evaluation.submittedDate || evaluation.createdDate).toLocaleDateString()}</span>
                  <span style={{
                    ...styles.statusBadge,
                    background: `${getStatusColor(evaluation.status)}20`,
                    color: getStatusColor(evaluation.status),
                  }}>
                    {getStatusLabel(evaluation.status)}
                  </span>
                  <button
                    style={styles.reviewBtn}
                    onClick={() => navigate(`/evaluator/review/${evaluation.id}`)}
                    onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                  >
                    Review
                  </button>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  No submissions yet
                </p>
                <p style={{ color: '#6b7280' }}>
                  Submitted evaluations will appear here for review
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvaluatorDashboardPage;