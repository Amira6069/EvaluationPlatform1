import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../Services/userService';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const response = await userService.updateProfile(profileData);
      
      // Update auth context with new user data
      login(localStorage.getItem('governance_token'), response.user);
      
      setMessage({ type: 'success', text: t('settings.changesSaved') });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setMessage({ type: 'success', text: t('settings.passwordChanged') });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' },
    tab: {
      padding: '12px 24px',
      border: 'none',
      background: 'transparent',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      marginBottom: '-2px',
      color: '#6b7280',
    },
    tabActive: {
      color: '#2563eb',
      borderBottom: '2px solid #2563eb',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formGroup: { marginBottom: '24px' },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    button: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    message: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    messageSuccess: {
      background: '#d1fae5',
      border: '1px solid #6ee7b7',
      color: '#065f46',
    },
    messageError: {
      background: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#dc2626',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('settings.settings')}</h1>
        <p style={styles.subtitle}>{t('settings.accountSettings')}</p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'profile' ? styles.tabActive : {}),
          }}
          onClick={() => {
            setActiveTab('profile');
            setMessage({ type: '', text: '' });
          }}
        >
          {t('settings.profileInformation')}
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'password' ? styles.tabActive : {}),
          }}
          onClick={() => {
            setActiveTab('password');
            setMessage({ type: '', text: '' });
          }}
        >
          {t('settings.changePassword')}
        </button>
      </div>

      <div style={styles.card}>
        {message.text && (
          <div
            style={{
              ...styles.message,
              ...(message.type === 'success' ? styles.messageSuccess : styles.messageError),
            }}
          >
            {message.type === 'success' ? '✅ ' : '⚠️ '}
            {message.text}
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('auth.fullName')}</label>
              <input
                type="text"
                style={styles.input}
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('auth.email')}</label>
              <input
                type="email"
                style={styles.input}
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
            >
              {loading ? t('common.loading') : t('settings.saveChanges')}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('settings.currentPassword')}</label>
              <input
                type="password"
                style={styles.input}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('settings.newPassword')}</label>
              <input
                type="password"
                style={styles.input}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('auth.confirmPassword')}</label>
              <input
                type="password"
                style={styles.input}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
            >
              {loading ? t('common.loading') : t('settings.changePassword')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;