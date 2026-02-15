import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const [users, setUsers] = useState([
    { id: 1, fullName: 'John Doe', email: 'org@example.com', role: 'ORGANIZATION', status: 'active', createdDate: '2026-01-01' },
    { id: 2, fullName: 'Jane Smith', email: 'evaluator@example.com', role: 'EVALUATOR', status: 'active', createdDate: '2026-01-05' },
    { id: 3, fullName: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'active', createdDate: '2026-01-01' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'ORGANIZATION', status: 'active' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const openAddModal = () => {
    setEditUser(null);
    setFormData({ fullName: '', email: '', role: 'ORGANIZATION', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditUser(u);
    setFormData({ fullName: u.fullName, email: u.email, role: u.role, status: u.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.email) {
      alert('Name and email are required');
      return;
    }
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...formData } : u));
    } else {
      setUsers(prev => [...prev, {
        id: Date.now(), ...formData,
        createdDate: new Date().toISOString().split('T')[0],
      }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const getRoleColor = (role) => ({
    ORGANIZATION: { bg: '#eff6ff', color: '#2563eb' },
    EVALUATOR: { bg: '#f0fdf4', color: '#16a34a' },
    ADMIN: { bg: '#f5f3ff', color: '#7c3aed' },
  }[role] || { bg: '#f3f4f6', color: '#6b7280' });

  const filtered = users.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

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
    main: { flex: 1, padding: '32px 24px' },
    topBar: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
    },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827' },
    addBtn: {
      padding: '10px 20px', background: '#7c3aed', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '14px', fontWeight: '600',
    },
    filterBar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    searchInput: {
      padding: '10px 16px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '14px', flex: 1, minWidth: '200px', outline: 'none',
    },
    select: {
      padding: '10px 16px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '14px', background: 'white', cursor: 'pointer',
    },
    table: {
      background: 'white', borderRadius: '12px',
      overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tableHeader: {
      background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      padding: '14px 24px', display: 'grid',
      gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
      gap: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6', padding: '16px 24px',
      display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
      gap: '16px', alignItems: 'center',
    },
    badge: {
      display: 'inline-block', padding: '4px 10px',
      borderRadius: '10px', fontSize: '12px', fontWeight: '600',
    },
    actionBtns: { display: 'flex', gap: '8px' },
    editBtn: {
      padding: '6px 12px', background: '#eff6ff', color: '#2563eb',
      border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
    },
    deleteBtn: {
      padding: '6px 12px', background: '#fef2f2', color: '#dc2626',
      border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
    },
    toggleBtn: {
      padding: '6px 12px', background: '#f3f4f6', color: '#374151',
      border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
    },
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    },
    modal: {
      background: 'white', borderRadius: '16px', padding: '32px',
      maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    },
    modalTitle: { fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' },
    formGroup: { marginBottom: '20px' },
    label: { fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' },
    input: {
      width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    },
    modalBtns: { display: 'flex', gap: '12px', marginTop: '24px' },
    cancelBtn: {
      flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
    },
    saveBtn: {
      flex: 1, padding: '12px', background: '#7c3aed', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
    },
    emptyState: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  };

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
          <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <span>👥</span><span>User Management</span>
          </div>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/settings')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>⚙️</span><span>Settings</span></div>
        </aside>

        <main style={styles.main}>
          <div style={styles.topBar}>
            <h1 style={styles.pageTitle}>User Management</h1>
            <button style={styles.addBtn} onClick={openAddModal}
              onMouseEnter={(e) => e.target.style.background = '#6d28d9'}
              onMouseLeave={(e) => e.target.style.background = '#7c3aed'}
            >+ Add User</button>
          </div>

          <div style={styles.filterBar}>
            <input
              style={styles.searchInput}
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select style={styles.select} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="ORGANIZATION">Organization</option>
              <option value="EVALUATOR">Evaluator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filtered.length > 0 ? filtered.map((u) => {
              const roleColor = getRoleColor(u.role);
              return (
                <div key={u.id} style={styles.tableRow}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontWeight: '500' }}>{u.fullName}</span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{u.email}</span>
                  <span style={{
                    ...styles.badge,
                    background: roleColor.bg, color: roleColor.color,
                  }}>{u.role}</span>
                  <span style={{
                    ...styles.badge,
                    background: u.status === 'active' ? '#d1fae5' : '#fee2e2',
                    color: u.status === 'active' ? '#059669' : '#dc2626',
                  }}>{u.status === 'active' ? '● Active' : '● Inactive'}</span>
                  <div style={styles.actionBtns}>
                    <button style={styles.editBtn} onClick={() => openEditModal(u)}>Edit</button>
                    <button style={styles.toggleBtn} onClick={() => handleToggleStatus(u.id)}>
                      {u.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(u.id)}>Delete</button>
                  </div>
                </div>
              );
            }) : (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>👥</p>
                <p style={{ fontWeight: '600' }}>No users found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editUser ? 'Edit User' : 'Add New User'}</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input style={styles.input} placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input style={styles.input} type="email" placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select style={{ ...styles.input, cursor: 'pointer' }}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ORGANIZATION">Organization</option>
                <option value="EVALUATOR">Evaluator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select style={{ ...styles.input, cursor: 'pointer' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={styles.modalBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSave}
                onMouseEnter={(e) => e.target.style.background = '#6d28d9'}
                onMouseLeave={(e) => e.target.style.background = '#7c3aed'}
              >{editUser ? 'Save Changes' : 'Add User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;