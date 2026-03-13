import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../Services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ORGANIZATION'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');

    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Call Spring Boot API
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      console.log('Registration successful:', response.data);

      // Show success message
      alert('Registration successful! Please login.');
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        setApiError(error.response.data.message || 'Registration failed. Email may already exist.');
      } else if (error.request) {
        setApiError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setApiError('An error occurred. Please try again.');
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
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff)',
      padding: '20px',
    },
    wrapper: { width: '100%', maxWidth: '500px' },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { color: '#6b7280', fontSize: '16px' },
    card: {
      background: 'white', borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '40px',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' },
    required: { color: '#ef4444' },
    input: {
      width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '15px', outline: 'none',
      transition: 'all 0.2s', boxSizing: 'border-box',
    },
    inputError: { borderColor: '#ef4444' },
    select: {
      width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '15px', outline: 'none',
      cursor: 'pointer', background: 'white', boxSizing: 'border-box',
    },
    error: { color: '#ef4444', fontSize: '13px', marginTop: '6px' },
    apiError: {
      padding: '12px', background: '#fee2e2', border: '1px solid #fecaca',
      borderRadius: '8px', color: '#dc2626', fontSize: '14px',
    },
    button: {
      padding: '14px', background: '#2563eb', color: 'white',
      border: 'none', borderRadius: '8px', fontSize: '16px',
      fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
    },
    buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' },
    link: { color: '#2563eb', textDecoration: 'none', fontWeight: '500' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join the Governance Evaluation Platform</p>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {apiError && <div style={styles.apiError}>⚠️ {apiError}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Full Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                disabled={loading}
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                disabled={loading}
              />
              {errors.email && <p style={styles.error}>{errors.email}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
                disabled={loading}
              />
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Confirm Password <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
                disabled={loading}
              />
              {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Register As <span style={styles.required}>*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
                disabled={loading}
              >
                <option value="ORGANIZATION">🏢 Organization</option>
                <option value="EVALUATOR">👨‍⚖️ Evaluator</option>
                <option value="ADMIN">👑 Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
            >
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;