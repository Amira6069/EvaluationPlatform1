import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    
    // Mock login - Create user object
    const mockUser = {
      id: 1,
      email: formData.email,
      fullName: 'John Doe',
      role: 'ORGANIZATION', // EXACT match to constants
    };
    
    // Save to localStorage
    localStorage.setItem('governance_token', 'mock-token-12345');
    localStorage.setItem('governance_user', JSON.stringify(mockUser));
    
    // Debug logs
    console.log('✅ Login successful!');
    console.log('Token saved:', localStorage.getItem('governance_token'));
    console.log('User saved:', localStorage.getItem('governance_user'));
    
    // Small delay to show loading state
    setTimeout(() => {
      setLoading(false);
      navigate('/organization/dashboard');
    }, 500);
  };
  
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff)',
      padding: '20px',
    },
    wrapper: {
      width: '100%',
      maxWidth: '500px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    iconWrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      background: '#2563eb',
      borderRadius: '16px',
      marginBottom: '16px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      padding: '40px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
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
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.2s',
    },
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
    inputError: {
      borderColor: '#ef4444',
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '6px',
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
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
    securityNote: {
      marginTop: '32px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#9ca3af',
    },
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to Governance Evaluation Platform</p>
        </div>
        
        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {}),
                }}
                disabled={loading}
              />
              {errors.email && <p style={styles.error}>{errors.email}</p>}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {}),
                }}
                disabled={loading}
              />
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>
            
            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => !loading && (e.target.style.background = '#2563eb')}
            >
              {loading ? (
                <>
                  <span>⏳</span>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Sign up
            </Link>
          </div>
        </div>
        
        <p style={styles.securityNote}>
          🔒 Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default LoginPage;