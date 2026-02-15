import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const [stats, setStats] = useState({
    totalEvaluations: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
    underReview: 0,
  });

  const [recentEvaluations, setRecentEvaluations] = useState([]);

  useEffect(() => {
    const all = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        all.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    all.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    setRecentEvaluations(all.slice(0, 6));
    setStats({
      totalEvaluations: all.length,
      draft: all.filter(e => e.status === 'draft').length,
      submitted: all.filter(e => e.status === 'submitted').length,
      underReview: all.filter(e => e.status === 'under-review').length,
      approved: all.filter(e => e.status === 'approved').length,
      rejected: all.filter(e => e.status === 'rejected').length,
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const getStatusColor = (status) => ({
    draft: '#6b7280', submitted: '#8b5cf6',
    'under-review': '#f59e0b', approved: '#10b981', rejected: '#ef4444',
  }[status] || '#6b7280');

  const getStatusLabel = (status) => ({
    draft: 'Draft', submitted: 'Submitted',
    'under-review': 'Under Review', approved: 'Approved', rejected: 'Rejected',
  }[status] || status);

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
      width: '40px', height: '40px', background: '#7c3aed',
      borderRadius: '8px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    adminBadge: {
      padding: '4px 10px', background: '#ede9fe', color: '#7c3aed',
      borderRadius: '6px', fontSize: '12px', fontWeight: '600',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    },
    layout: { display: 'flex', maxWidth: '1280px', margin: '0 auto' },
    sidebar: {
      width: '250px', background: 'white', borderRight: '1px solid #e5e7eb',
      padding: '24px 0', height: 'calc(100vh - 65px)',
      position: 'sticky', top: '65px',
    },
    sidebarLabel: {
      padding: '8px 24px', fontSize: '11px', fontWeight: '600',
      color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px',
    },
    menuItem: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 24px', color: '#374151', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500', transition: 'all 0.2s',
    },
    menuItemActive: {
      background: '#f5f3ff', color: '#7c3aed', borderLeft: '3px solid #7c3aed',
    },
    main: { flex: 1, padding: '32px 24px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' },
    pageSubtitle: { color: '#6b7280', marginBottom: '32px' },
    statsGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px', marginBottom: '32px',
    },
    statCard: {
      background: 'white', borderRadius: '12px', padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    statLabel: { fontSize: '13px', color: '#6b7280', marginBottom: '6px' },
    statValue: { fontSize: '32px', fontWeight: 'bold', color: '#111827' },
    statIcon: {
      width: '48px', height: '48px', borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
    },
    sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
    table: {
      background: 'white', borderRadius: '12px',
      overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tableHeader: {
      background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      padding: '14px 24px', display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6', padding: '16px 24px',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '16px', alignItems: 'center',
    },
    badge: {
      display: 'inline-block', padding: '4px 10px',
      borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    },
    emptyState: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  };

  const statCards = [
    { label: 'Total Evaluations', value: stats.totalEvaluations, icon: '📊', bg: '#eff6ff', color: '#2563eb' },
    { label: 'Draft', value: stats.draft, icon: '📝', bg: '#f3f4f6', color: '#6b7280' },
    { label: 'Pending Review', value: stats.submitted, icon: '⏳', bg: '#ede9fe', color: '#7c3aed' },
    { label: 'Under Review', value: stats.underReview, icon: '👁️', bg: '#fef3c7', color: '#d97706' },
    { label: 'Approved', value: stats.approved, icon: '✅', bg: '#d1fae5', color: '#059669' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', bg: '#fee2e2', color: '#dc2626' },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>👑</div>
          <span style={styles.logoText}>Governance Platform - Admin</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.adminBadge}>Administrator</span>
          <div style={styles.userInfo}>
            <span>👤</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.fullName || 'Admin'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >Logout</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <p style={styles.sidebarLabel}>Main Menu</p>
          <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <span>📊</span><span>Dashboard</span>
          </div>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/users')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>👥</span><span>User Management</span></div>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/settings')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>⚙️</span><span>Settings</span></div>
        </aside>

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.pageSubtitle}>System overview and management</p>

          <div style={styles.statsGrid}>
            {statCards.map((card, i) => (
              <div key={i} style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div>
                  <p style={styles.statLabel}>{card.label}</p>
                  <p style={styles.statValue}>{card.value}</p>
                </div>
                <div style={{ ...styles.statIcon, background: card.bg }}>{card.icon}</div>
              </div>
            ))}
          </div>

          <h2 style={styles.sectionTitle}>Recent Evaluations</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Evaluation Name</span>
              <span>Period</span>
              <span>Created</span>
              <span>Status</span>
            </div>
            {recentEvaluations.length > 0 ? recentEvaluations.map((ev) => (
              <div key={ev.id} style={styles.tableRow}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontWeight: '500' }}>{ev.name}</span>
                <span style={{ color: '#6b7280' }}>{ev.period}</span>
                <span style={{ color: '#6b7280' }}>{new Date(ev.createdDate).toLocaleDateString()}</span>
                <span style={{
                  ...styles.badge,
                  background: `${getStatusColor(ev.status)}20`,
                  color: getStatusColor(ev.status),
                }}>{getStatusLabel(ev.status)}</span>
              </div>
            )) : (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
                <p style={{ fontWeight: '600' }}>No evaluations yet</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;