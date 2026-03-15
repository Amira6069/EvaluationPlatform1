import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // ✅ THREE levels up
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Define menu items for each role
  const menuItems = {
    ORGANIZATION: [
      { icon: '📊', label: t('nav.dashboard'), path: '/organization/dashboard' },
      { icon: '📝', label: t('nav.evaluations'), path: '/organization/evaluations' },
      { icon: '➕', label: t('nav.newEvaluation'), path: '/organization/evaluations/new' },
      { icon: '🏆', label: t('nav.results'), path: '/organization/results' },
      { icon: '⚙️', label: t('nav.settings'), path: '/organization/settings' },
    ],
    EVALUATOR: [
      { icon: '📊', label: t('nav.dashboard'), path: '/evaluator/dashboard' },
      { icon: '📋', label: t('nav.queue'), path: '/evaluator/queue' },
      { icon: '⚙️', label: t('nav.settings'), path: '/evaluator/settings' },
    ],
    ADMIN: [
      { icon: '📊', label: t('nav.dashboard'), path: '/admin/dashboard' },
      { icon: '👥', label: t('nav.users'), path: '/admin/users' },
      { icon: '📝', label: t('nav.evaluations'), path: '/admin/evaluations' },
      { icon: '🏛️', label: t('nav.governance'), path: '/admin/governance' },
      { icon: '⚙️', label: t('nav.settings'), path: '/admin/settings' },
    ],
  };

  const currentMenuItems = menuItems[user?.role] || [];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const styles = {
    sidebar: {
      width: '260px',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 100,
    },
    logo: {
      padding: '24px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    logoSubtext: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '4px',
    },
    menu: {
      flex: 1,
      padding: '20px 0',
      overflowY: 'auto',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      margin: '4px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#cbd5e1',
      fontSize: '15px',
      fontWeight: '500',
    },
    menuItemActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    },
    icon: {
      marginRight: '12px',
      fontSize: '20px',
    },
    userInfo: {
      padding: '20px 24px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      color: '#cbd5e1',
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '4px',
    },
    userRole: {
      fontSize: '12px',
      color: '#94a3b8',
    },
  };

  const handleNavigate = (path) => {
    console.log('🔗 Navigating to:', path);
    navigate(path);
  };

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoText}>🏛️ GovEval</div>
        <div style={styles.logoSubtext}>Governance Platform</div>
      </div>

      {/* Menu Items */}
      <div style={styles.menu}>
        {currentMenuItems.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.menuItem,
              ...(isActive(item.path) ? styles.menuItemActive : {}),
            }}
            onClick={() => handleNavigate(item.path)}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#cbd5e1';
              }
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div style={styles.userInfo}>
        <div style={styles.userName}>{user?.name || 'User'}</div>
        <div style={styles.userRole}>
          {user?.role ? t(`user.${user.role.toLowerCase()}`) : 'Role'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;