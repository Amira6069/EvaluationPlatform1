import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [stats, setStats] = useState({
    activeEvaluations: 0,
    completed: 0,
    pendingReview: 0,
    score: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = () => {
    // Load evaluations from localStorage
    let activeCount = 0;
    let completedCount = 0;
    let pendingCount = 0;
    const activities = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluation = JSON.parse(localStorage.getItem(key));
        
        if (evaluation.status === 'draft') activeCount++;
        if (evaluation.status === 'approved') completedCount++;
        if (evaluation.status === 'submitted' || evaluation.status === 'under-review') pendingCount++;
        
        // Add to recent activity
        activities.push({
          type: evaluation.status === 'submitted' ? 'submitted' : 'draft',
          text: evaluation.status === 'submitted' ? 'Evaluation submitted' : 'Draft saved',
          date: evaluation.createdDate,
        });
      }
    }
    
    // Sort activities by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setStats({
      activeEvaluations: activeCount,
      completed: completedCount,
      pendingReview: pendingCount,
      score: completedCount > 0 ? 85 : 0, // Mock score
    });
    
    setRecentActivity(activities.slice(0, 4));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };
  
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
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
      transition: 'background 0.2s',
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
      transition: 'background 0.2s',
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
      transition: 'box-shadow 0.2s',
      cursor: 'pointer',
    },
    statContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column',
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
    },
    section: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
    },
    viewAllLink: {
      fontSize: '14px',
      color: '#2563eb',
      cursor: 'pointer',
      fontWeight: '500',
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: '#f9fafb',
      borderRadius: '8px',
    },
    activityIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
    },
    activityText: {
      flex: 1,
    },
    activityTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '4px',
    },
    activityDate: {
      fontSize: '12px',
      color: '#6b7280',
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
    },
    actionButton: {
      padding: '20px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'background 0.2s',
    },
    actionButtonSecondary: {
      background: 'white',
      color: '#374151',
      border: '2px solid #e5e7eb',
    },
  };
  
  const statsData = [
    { 
      label: 'Active Evaluations', 
      value: stats.activeEvaluations, 
      icon: '📝', 
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      icon: '✅', 
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    { 
      label: 'Pending Review', 
      value: stats.pendingReview, 
      icon: '⏳', 
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    { 
      label: 'Latest Score', 
      value: stats.score, 
      icon: '🏆', 
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
  ];
  
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
          <div style={{...styles.menuItem, ...styles.menuItemActive}}>
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
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>
            Welcome back, {user.fullName || 'User'}!
          </p>
          
          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <div 
                key={index}
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div style={styles.statContent}>
                  <div style={styles.statInfo}>
                    <p style={styles.statLabel}>{stat.label}</p>
                    <p style={styles.statValue}>{stat.value}</p>
                  </div>
                  <div style={{
                    ...styles.statIcon,
                    background: stat.bgColor,
                  }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.quickActions}>
              <button
                style={styles.actionButton}
                onClick={() => navigate('/organization/evaluations/new')}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = '#2563eb'}
              >
                <span>➕</span>
                <span>Start New Evaluation</span>
              </button>
              <button
                style={{...styles.actionButton, ...styles.actionButtonSecondary}}
                onClick={() => navigate('/organization/results')}
                onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                <span>📊</span>
                <span>View Results</span>
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Recent Activity</h2>
              <span 
                style={styles.viewAllLink}
                onClick={() => navigate('/organization/evaluations')}
              >
                View all →
              </span>
            </div>
            
            {recentActivity.length > 0 ? (
              <div style={styles.activityList}>
                {recentActivity.map((activity, index) => (
                  <div key={index} style={styles.activityItem}>
                    <div style={{
                      ...styles.activityIcon,
                      background: activity.type === 'submitted' ? '#d1fae5' : '#dbeafe'
                    }}>
                      {activity.type === 'submitted' ? '✅' : '📝'}
                    </div>
                    <div style={styles.activityText}>
                      <p style={styles.activityTitle}>{activity.text}</p>
                      <p style={styles.activityDate}>{getTimeAgo(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                No recent activity. Start a new evaluation to get started!
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;