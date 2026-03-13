import React, { useState, useEffect } from 'react';
import { getMyOrganization, updateOrganization } from '../../Services/organizationService';
import { STORAGE_KEYS } from '../../utils/constants';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfFoundation: '',
    sector: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      const response = await getMyOrganization();
      const org = response.data;
      
      setFormData({
        name: org.name || '',
        email: org.email || '',
        dateOfFoundation: org.dateOfFoundation || '',
        sector: org.sector || '',
        address: org.address || '',
        phone: org.phone || ''
      });
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Organization name is required';
    }
    
    if (!formData.sector || formData.sector.trim() === '') {
      newErrors.sector = 'Sector is required';
    }
    
    if (!formData.address || formData.address.trim() === '') {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.dateOfFoundation) {
      newErrors.dateOfFoundation = 'Date of foundation is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setError('Please fill in all required fields');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      const user = JSON.parse(userStr);
      
      await updateOrganization(user.userId, formData);
      
      setSuccess('Profile updated successfully!');
      
      // Update user name in localStorage
      const updatedUser = { ...user, name: formData.name };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating organization:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: { padding: '24px', maxWidth: '800px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { color: '#6b7280', fontSize: '16px' },
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '32px'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    alertError: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' },
    alertSuccess: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { 
      marginBottom: '8px', 
      fontSize: '14px', 
      fontWeight: '500', 
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    required: { color: '#ef4444' },
    input: {
      padding: '10px 14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    inputError: {
      borderColor: '#ef4444',
    },
    inputReadOnly: {
      background: '#f9fafb',
      cursor: 'not-allowed',
    },
    error: {
      color: '#ef4444',
      fontSize: '13px',
      marginTop: '6px',
    },
    button: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
      marginTop: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    loading: { textAlign: 'center', padding: '40px', color: '#6b7280' }
  };

  if (loading) {
    return <div style={styles.loading}>⏳ Loading organization data...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Organization Settings</h1>
        <p style={styles.subtitle}>Manage your organization profile and information</p>
      </div>

      <div style={styles.card}>
        {error && <div style={{ ...styles.alert, ...styles.alertError }}>⚠️ {error}</div>}
        {success && <div style={{ ...styles.alert, ...styles.alertSuccess }}>✅ {success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Organization Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.name ? styles.inputError : {})
                }}
                disabled={saving}
                placeholder="Enter organization name"
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                style={{ ...styles.input, ...styles.inputReadOnly }}
                disabled
                readOnly
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Email cannot be changed
              </p>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Date of Foundation <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="dateOfFoundation"
                value={formData.dateOfFoundation}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.dateOfFoundation ? styles.inputError : {})
                }}
                disabled={saving}
              />
              {errors.dateOfFoundation && <p style={styles.error}>{errors.dateOfFoundation}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Sector <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="sector"
                placeholder="e.g., Technology, Healthcare"
                value={formData.sector}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.sector ? styles.inputError : {})
                }}
                disabled={saving}
              />
              {errors.sector && <p style={styles.error}>{errors.sector}</p>}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Address <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Organization address"
              value={formData.address}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.address ? styles.inputError : {})
              }}
              disabled={saving}
            />
            {errors.address && <p style={styles.error}>{errors.address}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Phone Number <span style={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+216 XX XXX XXX"
              value={formData.phone}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.phone ? styles.inputError : {})
              }}
              disabled={saving}
            />
            {errors.phone && <p style={styles.error}>{errors.phone}</p>}
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...(saving ? styles.buttonDisabled : {}) }}
            disabled={saving}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={(e) => !saving && (e.currentTarget.style.background = '#2563eb')}
          >
            {saving ? (
              <>
                <span>⏳</span>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
