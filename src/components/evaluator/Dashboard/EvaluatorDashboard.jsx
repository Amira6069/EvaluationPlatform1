import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Statistics from './Statistics';
import AssignedQueue from './AssignedQueue';

const EvaluatorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb' },
    header: {
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
    },
    logoIcon: {
      width: '40px', height: '40px', background: '#2563eb',
      borderRadius: '8px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500',
    },
    layout: { display: 'flex', maxWidth: '1280px', margin: '0 auto' },
    sidebar: {
      width: '250px', background: 'white', borderRight: '1px solid #e5e7eb',
      padding: '24px 0', height: 'calc(100vh - 65px)', position: 'sticky', top: '65px',
    },
    menuItem: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 24px', color: '#374151', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500',
    },
    menuItemActive: {
      background: '#eff6ff', color: '#2563eb', borderLeft: '3px solid #2563eb',
    },
    main: { flex: 1, padding: '32px 24px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    pageSubtitle: { color: '#6b7280', marginBottom: '32px' },
  };

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
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <span>📊</span><span>Dashboard</span>
          </div>
          <div
            style={styles.menuItem}
            onClick={() => navigate('/evaluator/queue')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📋</span><span>Review Queue</span>
          </div>
          <div
            style={styles.menuItem}
            onClick={() => navigate('/evaluator/history')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>🕐</span><span>Review History</span>
          </div>
        </aside>

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Evaluator Dashboard</h1>
          <p style={styles.pageSubtitle}>Review and manage submitted evaluations</p>
          <Statistics />
          <AssignedQueue />
        </main>
      </div>
    </div>
  );
};

export default EvaluatorDashboard;