import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const [settings, setSettings] = useState({
    platformName: 'Governance Evaluation Platform',
    allowRegistration: true,
    requireEvidenceUpload: false,
    autoApprove: false,
    maxEvaluationsPerOrg: 10,
    notificationsEnabled: true,
    language: 'en',
  });

  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const handleSave = () => {
    localStorage.setItem('platform_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ This will delete ALL evaluation data. Are you sure?')) {
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('evaluation_')) keysToDelete.push(key);
      }
      keysToDelete.forEach(key => localStorage.removeItem(key));
      alert('All evaluation data has been cleared!');
    }
  };

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb' },
    header: {
      background: 'white', borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px', position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '8px' },
    logoIcon: {
      width: '40px', height: '40px', background: '#7c3aed', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    adminBadge: {
      padding: '4px 10px', background: '#ede9fe', color: '#7c3aed',
      borderRadius: '6px', fontSize: '12px', fontWeight: '600',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    },
    layout: { display: 'flex', maxWidth: '1280px', margin: '0 auto' },
    sidebar: {
      width: '250px', background: 'white', borderRight: '1px solid #e5e7eb',
      padding: '24px 0', height: 'calc(100vh - 65px)', position: 'sticky', top: '65px',
    },
    sidebarLabel: {
      padding: '8px 24px', fontSize: '11px', fontWeight: '600',
      color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px',
    },
    menuItem: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 24px', color: '#374151', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500',
    },
    menuItemActive: { background: '#f5f3ff', color: '#7c3aed', borderLeft: '3px solid #7c3aed' },
    main: { flex: 1, padding: '32px 24px', maxWidth: '800px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' },
    pageSubtitle: { color: '#6b7280', marginBottom: '32px' },
    card: {
      background: 'white', borderRadius: '12px', padding: '28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px',
    },
    cardTitle: {
      fontSize: '18px', fontWeight: '600', color: '#111827',
      marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6',
    },
    settingRow: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f9fafb',
    },
    settingInfo: {},
    settingLabel: { fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '2px' },
    settingDesc: { fontSize: '13px', color: '#6b7280' },
    toggle: {
      width: '48px', height: '26px', borderRadius: '13px', border: 'none',
      cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
      flexShrink: 0,
    },
    toggleKnob: {
      position: 'absolute', top: '3px', width: '20px', height: '20px',
      borderRadius: '50%', background: 'white', transition: 'left 0.3s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    input: {
      padding: '8px 12px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '14px', outline: 'none', width: '200px',
    },
    select: {
      padding: '8px 12px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer',
    },
    saveBar: {
      display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px',
    },
    saveBtn: {
      padding: '12px 32px', background: '#7c3aed', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '15px', fontWeight: '600',
    },
    savedMsg: {
      padding: '10px 20px', background: '#d1fae5', color: '#065f46',
      borderRadius: '8px', fontSize: '14px', fontWeight: '500',
    },
    dangerCard: {
      background: 'white', borderRadius: '12px', padding: '28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #fecaca',
    },
    dangerTitle: {
      fontSize: '18px', fontWeight: '600', color: '#dc2626',
      marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #fee2e2',
    },
    dangerRow: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '14px 0',
    },
    dangerBtn: {
      padding: '10px 20px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '14px', fontWeight: '600',
    },
  };

  const Toggle = ({ value, onChange }) => (
    <button
      style={{ ...styles.toggle, background: value ? '#7c3aed' : '#d1d5db' }}
      onClick={() => onChange(!value)}
    >
      <div style={{ ...styles.toggleKnob, left: value ? '25px' : '3px' }} />
    </button>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>👑</div>
          <span style={styles.logoText}>Governance Platform - Admin</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.adminBadge}>Administrator</span>
          <div style={styles.userInfo}>
            <span>👤</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.fullName || 'Admin'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >Logout</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <p style={styles.sidebarLabel}>Main Menu</p>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>📊</span><span>Dashboard</span></div>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/users')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>👥</span><span>User Management</span></div>
          <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <span>⚙️</span><span>Settings</span>
          </div>
        </aside>

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Settings</h1>
          <p style={styles.pageSubtitle}>Configure platform settings</p>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🌐 General Settings</h3>

            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Platform Name</p>
                <p style={styles.settingDesc}>The name shown across the platform</p>
              </div>
              <input
                style={styles.input}
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>

            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Language</p>
                <p style={styles.settingDesc}>Platform display language</p>
              </div>
              <select style={styles.select}
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Max Evaluations per Organization</p>
                <p style={styles.settingDesc}>Maximum evaluations an org can create</p>
              </div>
              <input
                style={styles.input}
                type="number"
                min="1"
                max="100"
                value={settings.maxEvaluationsPerOrg}
                onChange={(e) => setSettings({ ...settings, maxEvaluationsPerOrg: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🔧 Feature Settings</h3>

            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Allow Public Registration</p>
                <p style={styles.settingDesc}>Let new users register themselves</p>
              </div>
              <Toggle
                value={settings.allowRegistration}
                onChange={(v) => setSettings({ ...settings, allowRegistration: v })}
              />
            </div>

            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Require Evidence Upload</p>
                <p style={styles.settingDesc}>Make file upload mandatory for each criterion</p>
              </div>
              <Toggle
                value={settings.requireEvidenceUpload}
                onChange={(v) => setSettings({ ...settings, requireEvidenceUpload: v })}
              />
            </div>

            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Enable Notifications</p>
                <p style={styles.settingDesc}>Send notifications on status changes</p>
              </div>
              <Toggle
                value={settings.notificationsEnabled}
                onChange={(v) => setSettings({ ...settings, notificationsEnabled: v })}
              />
            </div>

            <div style={{ ...styles.settingRow, borderBottom: 'none' }}>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>Auto-Approve Evaluations</p>
                <p style={styles.settingDesc}>Automatically approve without evaluator review</p>
              </div>
              <Toggle
                value={settings.autoApprove}
                onChange={(v) => setSettings({ ...settings, autoApprove: v })}
              />
            </div>
          </div>

          <div style={styles.saveBar}>
            <button style={styles.saveBtn} onClick={handleSave}
              onMouseEnter={(e) => e.target.style.background = '#6d28d9'}
              onMouseLeave={(e) => e.target.style.background = '#7c3aed'}
            >💾 Save Settings</button>
            {saved && <span style={styles.savedMsg}>✅ Settings saved successfully!</span>}
          </div>

          <div style={{ ...styles.dangerCard, marginTop: '32px' }}>
            <h3 style={styles.dangerTitle}>⚠️ Danger Zone</h3>
            <div style={styles.dangerRow}>
              <div>
                <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>Clear All Evaluation Data</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Permanently delete all evaluations from the system
                </p>
              </div>
              <button style={styles.dangerBtn} onClick={handleClearData}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >🗑️ Clear Data</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;