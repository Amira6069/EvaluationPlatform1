import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, STORAGE_KEYS } from '../../../utils/constants';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: '📊', label: 'Dashboard' },
    { path: ROUTES.ADMIN_USERS, icon: '👥', label: 'Users' },
    { path: ROUTES.ADMIN_EVALUATIONS, icon: '📋', label: 'Evaluations' },
    { path: ROUTES.ADMIN_GOVERNANCE, icon: '⚙️', label: 'Governance' },
    { path: '/admin/settings', icon: '🔧', label: 'Settings' },
  ];

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f9fafb',
    },
    sidebar: {
      width: '260px',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
    },
    logo: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb',
    },
    logoContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: '#dc2626',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#111827',
    },
    nav: {
      flex: 1,
      padding: '24px 16px',
      overflowY: 'auto',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      color: '#6b7280',
      fontSize: '15px',
      fontWeight: '500',
    },
    menuItemActive: {
      background: '#fef2f2',
      color: '#dc2626',
    },
    footer: {
      padding: '16px',
      borderTop: '1px solid #e5e7eb',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: '#f9fafb',
      borderRadius: '10px',
      marginBottom: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#dc2626',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '2px',
    },
    userRole: {
      fontSize: '12px',
      color: '#6b7280',
    },
    logoutButton: {
      width: '100%',
      padding: '10px',
      background: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    main: {
      flex: 1,
      marginLeft: '260px',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
    },
    content: {
      flex: 1,
      padding: '0',
      overflowY: 'auto',
    },
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoContent}>
            <div style={styles.logoIcon}>👑</div>
            <span style={styles.logoText}>Admin Panel</span>
          </div>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              style={{
                ...styles.menuItem,
                ...(isActive(item.path) ? styles.menuItemActive : {}),
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={styles.footer}>
          <div style={styles.userCard}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.name || 'Administrator'}</div>
              <div style={styles.userRole}>Admin</div>
            </div>
          </div>
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fecaca')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fee2e2')}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;