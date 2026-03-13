import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login as loginService } from '../../Services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('=== LOGIN START ===');
      
      const response = await loginService(formData);
      const data = response.data;
      
      const token = data.token || data.accessToken || data.jwt;
      const userId = data.userId || data.id;
      const email = data.email || formData.email;
      const name = data.name || data.fullName;
      const role = data.role;

      if (!token) {
        throw new Error(t('auth.noTokenReceived'));
      }

      const userData = { userId, email, name, role };
      login(token, userData);

      if (role === 'ORGANIZATION') {
        navigate(ROUTES.ORG_DASHBOARD);
      } else if (role === 'EVALUATOR') {
        navigate(ROUTES.EVAL_DASHBOARD);
      } else if (role === 'ADMIN') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate('/');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.status === 401) {
        setError(t('auth.invalidCredentials'));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || t('auth.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      padding: '48px',
      width: '100%',
      maxWidth: '450px',
    },
    logo: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logoIcon: {
      width: '60px',
      height: '60px',
      background: '#2563eb',
      borderRadius: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '30px',
      marginBottom: '16px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827',
      textAlign: 'center',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '32px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
    },
    input: {
      padding: '12px 16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    button: {
      padding: '14px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
      marginTop: '8px',
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    error: {
      padding: '12px 16px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '14px',
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏛️</div>
          <h1 style={styles.title}>{t('auth.signInTitle')}</h1>
          <p style={styles.subtitle}>{t('auth.signInSubtitle')}</p>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('common.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('auth.enterEmail')}
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('common.password')}</label>
            <input
              type="password"
              name="password"
              placeholder={t('auth.enterPassword')}
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
          >
            {loading ? `⏳ ${t('auth.signingIn')}` : `🔓 ${t('auth.signIn')}`}
          </button>
        </form>

        <div style={styles.footer}>
          {t('auth.noAccount')}{' '}
          <Link to={ROUTES.REGISTER} style={styles.link}>
            {t('auth.registerHere')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;