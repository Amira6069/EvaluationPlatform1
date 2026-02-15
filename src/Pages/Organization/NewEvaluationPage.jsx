import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewEvaluationPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    period: '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Evaluation name is required';
    if (!formData.period.trim()) newErrors.period = 'Period is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create new evaluation
    const evaluationId = Date.now();
    const newEvaluation = {
      id: evaluationId,
      name: formData.name,
      description: formData.description,
      period: formData.period,
      status: 'draft',
      createdDate: new Date().toISOString(),
      responses: {},
    };
    
    // Save to localStorage
    localStorage.setItem(`evaluation_${evaluationId}`, JSON.stringify(newEvaluation));
    
    console.log('✅ New evaluation created:', newEvaluation);
    
    // Navigate to evaluations list
    alert(`Evaluation "${formData.name}" created successfully!`);
    navigate('/organization/evaluations');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };
  
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f9fafb',
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: '#2563eb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: '#f3f4f6',
      borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    layout: {
      display: 'flex',
      maxWidth: '1280px',
      margin: '0 auto',
    },
    sidebar: {
      width: '250px',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      padding: '24px 0',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    menuItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      borderLeft: '3px solid #2563eb',
    },
    main: {
      flex: 1,
      padding: '32px 24px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#6b7280',
      marginBottom: '32px',
      lineHeight: '1.6',
    },
    infoBox: {
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '32px',
    },
    infoTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    infoText: {
      fontSize: '14px',
      color: '#1e40af',
      lineHeight: '1.6',
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
      transition: 'border 0.2s',
    },
    textarea: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '6px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px',
    },
    cancelBtn: {
      padding: '12px 24px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    submitBtn: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/organization/dashboard')}>
            <div style={styles.logoIcon}>🛡️</div>
            <span style={styles.logoText}>Governance Platform</span>
          </div>
          
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <span>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.fullName || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div 
            style={styles.menuItem}
            onClick={() => navigate('/organization/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </div>
          <div style={{...styles.menuItem, ...styles.menuItemActive}}>
            <span>📝</span>
            <span>Evaluations</span>
          </div>
          <div 
            style={styles.menuItem}
            onClick={() => navigate('/organization/results')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>📈</span>
            <span>Results</span>
          </div>
          <div 
            style={styles.menuItem}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </div>
        </aside>
        
        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.card}>
            <h1 style={styles.title}>Start New Evaluation</h1>
            <p style={styles.subtitle}>
              Create a new governance evaluation based on the 12 principles framework
            </p>
            
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>
                <span>📋</span>
                <span>What to expect:</span>
              </div>
              <div style={styles.infoText}>
                This evaluation covers <strong>12 governance principles</strong> with multiple 
                criteria for each. You'll assess your organization's maturity level (0-3) for 
                each criterion and upload supporting evidence.
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Evaluation Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Q1 2025 Governance Evaluation"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                {errors.name && <p style={styles.error}>{errors.name}</p>}
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  placeholder="Brief description of this evaluation..."
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Evaluation Period <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="period"
                  placeholder="e.g., Q1 2025, January-March 2025"
                  value={formData.period}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                {errors.period && <p style={styles.error}>{errors.period}</p>}
              </div>
              
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => navigate('/organization/evaluations')}
                  onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                >
                  Create Evaluation →
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewEvaluationPage;