import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../Services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== LOGIN START ===");
    
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      console.log('🔍 FULL LOGIN RESPONSE:', response);
      console.log('🔍 Token:', response.token);
      console.log('🔍 User:', response.user);
      console.log('🔍 User Role:', response.user?.role);

      // ✅ CRITICAL: MANUALLY SAVE TO LOCALSTORAGE FIRST
      localStorage.setItem('governance_token', response.token);
      localStorage.setItem('governance_user', JSON.stringify(response.user));

      console.log('💾 MANUALLY SAVED TO LOCALSTORAGE');
      console.log('📦 Verify token saved:', localStorage.getItem('governance_token')?.substring(0, 20));
      console.log('📦 Verify user saved:', localStorage.getItem('governance_user'));

      // ✅ THEN call login from AuthContext
      login(response.token, response.user);

      console.log('✅ Login successful, redirecting...');

      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect based on role
      const role = response.user.role;
      
      if (role === 'ORGANIZATION') {
        console.log('➡️ Redirecting to organization dashboard');
        navigate('/organization/dashboard', { replace: true });
      } else if (role === 'EVALUATOR') {
        console.log('➡️ Redirecting to evaluator dashboard');
        navigate('/evaluator/dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        console.log('➡️ Redirecting to admin dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('❌ Unknown role:', role);
        setError('Unknown user role');
      }

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
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
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      padding: '48px',
      width: '100%',
      maxWidth: '440px',
    },
    logo: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logoIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    logoText: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '32px',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '24px',
    },
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
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      marginTop: '8px',
    },
    error: {
      padding: '12px 16px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '14px',
      marginBottom: '16px',
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏛️</div>
          <div style={styles.logoText}>GovEval</div>
        </div>

        <h2 style={styles.title}>{t('auth.welcomeBack')}</h2>
        <p style={styles.subtitle}>{t('auth.signInToContinue')}</p>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('auth.email')}</label>
            <input
              type="email"
              style={styles.input}
              placeholder={t('auth.enterEmail')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              onFocus={(e) => (e.target.style.borderColor = '#667eea')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>{t('auth.password')}</label>
            <input
              type="password"
              style={styles.input}
              placeholder={t('auth.enterPassword')}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              onFocus={(e) => (e.target.style.borderColor = '#667eea')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Signing in...' : t('auth.signIn')}
          </button>
        </form>

        <div style={styles.footer}>
          {t('auth.dontHaveAccount')}
          <Link to="/register" style={styles.link}>
            {t('auth.signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;