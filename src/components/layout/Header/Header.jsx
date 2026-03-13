import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { ROUTES, LANGUAGE_OPTIONS, STORAGE_KEYS } from '../../../utils/constants';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    console.log('👋 Logging out...');
    logout();
    navigate(ROUTES.LOGIN);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'ORGANIZATION') return t('user.organization');
    if (user.role === 'EVALUATOR') return t('user.evaluator');
    if (user.role === 'ADMIN') return t('user.administrator');
    return user.role;
  };

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 50,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: '#2563eb',
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
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    languageSelector: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      cursor: 'pointer',
      background: 'white',
      outline: 'none',
    },
    userInfo: {
      textAlign: i18n.language === 'ar' ? 'left' : 'right',
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
    },
    userRole: {
      fontSize: '12px',
      color: '#6b7280',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
    },
    logoutButton: {
      padding: '8px 16px',
      background: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🏛️</div>
        <span style={styles.logoText}>Governance Platform</span>
      </div>

      <div style={styles.userSection}>
        {/* Language Selector */}
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          style={styles.languageSelector}
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        <div style={styles.userInfo}>
          <div style={styles.userName}>{user?.name || 'User'}</div>
          <div style={styles.userRole}>{getRoleLabel()}</div>
        </div>
        
        <div style={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fecaca')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fee2e2')}
        >
          🚪 {t('common.logout')}
        </button>
      </div>
    </header>
  );
};

export default Header;