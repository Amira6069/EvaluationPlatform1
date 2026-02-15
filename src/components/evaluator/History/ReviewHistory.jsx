import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewHistory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const all = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const ev = JSON.parse(localStorage.getItem(key));
        if (['approved', 'rejected'].includes(ev.status)) {
          all.push(ev);
        }
      }
    }
    all.sort((a, b) => new Date(b.reviewedDate || b.submittedDate) - new Date(a.reviewedDate || a.submittedDate));
    setHistory(all);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const getStatusColor = (status) => ({ approved: '#10b981', rejected: '#ef4444' }[status] || '#6b7280');

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb' },
    header: {
      background: 'white', borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px', position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '8px' },
    logoIcon: {
      width: '40px', height: '40px', background: '#2563eb', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
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
    menuItemActive: { background: '#eff6ff', color: '#2563eb', borderLeft: '3px solid #2563eb' },
    main: { flex: 1, padding: '32px 24px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    pageSubtitle: { color: '#6b7280', marginBottom: '32px' },
    table: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    tableHeader: {
      background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      padding: '14px 24px', display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px',
      fontSize: '13px', fontWeight: '600', color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6', padding: '18px 24px',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '16px', alignItems: 'center',
    },
    badge: {
      display: 'inline-block', padding: '4px 10px',
      borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    },
    viewBtn: {
      padding: '7px 14px', background: '#f3f4f6', color: '#374151',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
    },
    empty: { textAlign: 'center', padding: '60px 20px', color: '#6b7280' },
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
          <button onClick={handleLogout} style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >Logout</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.menuItem}
            onClick={() => navigate('/evaluator/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>📊</span><span>Dashboard</span></div>
          <div style={styles.menuItem}
            onClick={() => navigate('/evaluator/queue')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>📋</span><span>Review Queue</span></div>
          <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <span>🕐</span><span>Review History</span>
          </div>
        </aside>

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Review History</h1>
          <p style={styles.pageSubtitle}>All completed reviews</p>

          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Evaluation Name</span>
              <span>Period</span>
              <span>Reviewed Date</span>
              <span>Decision</span>
              <span>Action</span>
            </div>
            {history.length > 0 ? history.map((ev) => (
              <div key={ev.id} style={styles.tableRow}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontWeight: '500' }}>{ev.name}</span>
                <span>{ev.period}</span>
                <span>{new Date(ev.reviewedDate || ev.submittedDate).toLocaleDateString()}</span>
                <span style={{
                  ...styles.badge,
                  background: `${getStatusColor(ev.status)}20`,
                  color: getStatusColor(ev.status),
                }}>{ev.status === 'approved' ? '✅ Approved' : '❌ Rejected'}</span>
                <button style={styles.viewBtn}
                  onClick={() => navigate(`/evaluator/review/${ev.id}`)}
                  onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                >View Details</button>
              </div>
            )) : (
              <div style={styles.empty}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>No review history</p>
                <p style={{ fontSize: '14px' }}>Completed reviews will appear here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewHistory;