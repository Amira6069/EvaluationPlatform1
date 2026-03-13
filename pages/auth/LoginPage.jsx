import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { STORAGE_KEYS } from "../../utils/constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('ORGANIZATION');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  const newErrors = {};
  if (!formData.email) newErrors.email = "Email is required";
  if (!formData.password) newErrors.password = "Password is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      {
        email: formData.email,
        password: formData.password,
      }
    );

    console.log("Login successful:", response.data);

    // ✅ STORE REAL TOKEN
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);

    // ✅ STORE REAL USER OBJECT
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: response.data.userId,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
      })
    );

    // ✅ Redirect based on backend role (NOT dropdown role)
    if (response.data.role === "ORGANIZATION") {
      navigate("/organization/dashboard");
    } else if (response.data.role === "EVALUATOR") {
      navigate("/evaluator/dashboard");
    } else if (response.data.role === "ADMIN") {
      navigate("/admin/dashboard");
    }

  } catch (error) {
    console.error("Login error:", error);
    setErrors({ general: "Invalid email or password" });
  } finally {
    setLoading(false);
  }
};

  const getRoleDescription = () => {
    const descriptions = {
      ORGANIZATION: 'Access evaluation forms, view results, and manage submissions',
      EVALUATOR: 'Review submitted evaluations, approve or reject submissions',
      ADMIN: 'Manage users, configure system settings, and oversee all activities',
    };
    return descriptions[selectedRole];
  };

  const getRoleIcon = () => {
    const icons = { ORGANIZATION: '🏢', EVALUATOR: '👨‍⚖️', ADMIN: '👑' };
    return icons[selectedRole];
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
    iconWrapper: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '64px', height: '64px', background: '#2563eb',
      borderRadius: '16px', marginBottom: '16px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    },
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
    inputWrapper: { position: 'relative' },
    input: {
      width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '15px', outline: 'none',
      transition: 'all 0.2s', boxSizing: 'border-box',
    },
    inputError: { borderColor: '#ef4444' },
    passwordToggle: {
      position: 'absolute', right: '12px', top: '50%',
      transform: 'translateY(-50%)', background: 'none',
      border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280',
    },
    error: { color: '#ef4444', fontSize: '13px', marginTop: '6px' },
    select: {
      width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '15px', outline: 'none',
      cursor: 'pointer', background: 'white', boxSizing: 'border-box',
    },
    roleInfo: {
      padding: '12px 16px', background: '#eff6ff', borderRadius: '8px',
      fontSize: '13px', color: '#1e40af', marginTop: '8px',
      display: 'flex', alignItems: 'flex-start', gap: '8px',
    },
    button: {
      padding: '14px', background: '#2563eb', color: 'white',
      border: 'none', borderRadius: '8px', fontSize: '16px',
      fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    },
    buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' },
    link: { color: '#2563eb', textDecoration: 'none', fontWeight: '500' },
    securityNote: { marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#9ca3af' },
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
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    paddingRight: '44px',
                    ...(errors.password ? styles.inputError : {}),
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Login As <span style={styles.required}>*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={styles.select}
                disabled={loading}
              >
                <option value="ORGANIZATION">🏢 Organization</option>
                <option value="EVALUATOR">👨‍⚖️ Evaluator</option>
                <option value="ADMIN">👑 Administrator</option>
              </select>
              <div style={styles.roleInfo}>
                <span>{getRoleIcon()}</span>
                <span>{getRoleDescription()}</span>
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
            >
              {loading ? (
                <>⏳ Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Sign up</Link>
          </div>
        </div>

        <p style={styles.securityNote}>🔒 Protected by industry-standard encryption</p>
      </div>
    </div>
  );
};

export default LoginPage;