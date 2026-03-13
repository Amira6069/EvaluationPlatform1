import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // ✅ ADD THIS
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../Services/adminService';

const UsersPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();  // ✅ ADD THIS
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'ORGANIZATION', 
    active: true 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data || []);
      console.log('✅ Users loaded:', response.data.length);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setError(t('common.error'));  // ✅ TRANSLATED
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', password: '', role: 'ORGANIZATION', active: true });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (u) => {
    setEditUser(u);
    setFormData({ 
      name: u.name, 
      email: u.email, 
      password: '',
      role: u.role, 
      active: u.active !== false 
    });
    setShowModal(true);
    setError('');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setError(t('user.nameEmailRequired'));  // ✅ ADD TO TRANSLATIONS
      return;
    }

    if (!editUser && !formData.password) {
      setError(t('user.passwordRequired'));  // ✅ ADD TO TRANSLATIONS
      return;
    }

    try {
      if (editUser) {
        await updateUser(editUser.userId, formData);
        console.log('✅ User updated');
      } else {
        await createUser(formData);
        console.log('✅ User created');
      }
      
      await fetchUsers();
      setShowModal(false);
      setError('');
    } catch (error) {
      console.error('❌ Error saving user:', error);
      setError(error.response?.data?.message || t('user.saveFailed'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('user.confirmDelete'))) return;  // ✅ TRANSLATED

    try {
      await deleteUser(id);
      console.log('✅ User deleted');
      await fetchUsers();
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert(t('user.deleteFailed'));
    }
  };

  const getRoleColor = (role) => ({
    ORGANIZATION: { bg: '#eff6ff', color: '#2563eb' },
    EVALUATOR: { bg: '#f0fdf4', color: '#16a34a' },
    ADMIN: { bg: '#f5f3ff', color: '#7c3aed' },
  }[role] || { bg: '#f3f4f6', color: '#6b7280' });

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const styles = {
    container: { padding: '24px' },
    header: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827' },
    addButton: {
      padding: '10px 20px',
      background: '#7c3aed',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    filterBar: { display: 'flex', gap: '12px', marginBottom: '20px' },
    searchInput: {
      padding: '10px 16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      flex: 1,
      minWidth: '200px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    select: {
      padding: '10px 16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      background: 'white',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
    table: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tableHeader: {
      background: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      padding: '14px 24px',
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 1fr 1fr 150px',
      gap: '16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6',
      padding: '16px 24px',
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 1fr 1fr 150px',
      gap: '16px',
      alignItems: 'center',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '600',
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      marginRight: '4px',
    },
    loading: { textAlign: 'center', padding: '40px', color: '#6b7280' },
    error: {
      padding: '12px 16px',
      background: '#fee2e2',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      marginBottom: '16px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '480px',
      width: '100%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    },
    modalTitle: { fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' },
    formGroup: { marginBottom: '20px' },
    label: { 
      fontSize: '14px', 
      fontWeight: '500', 
      color: '#374151', 
      marginBottom: '6px', 
      display: 'block' 
    },
    input: {
      width: '100%',
      padding: '10px 14px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    modalButtons: { display: 'flex', gap: '12px', marginTop: '24px' },
    cancelButton: {
      flex: 1,
      padding: '12px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
    },
    saveButton: {
      flex: 1,
      padding: '12px',
      background: '#7c3aed',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 {t('user.userManagement')}</h1>
        <button
          style={styles.addButton}
          onClick={openAddModal}
          onMouseEnter={(e) => e.target.style.background = '#6d28d9'}
          onMouseLeave={(e) => e.target.style.background = '#7c3aed'}
        >
          + {t('user.addUser')}
        </button>
      </div>

      <div style={styles.filterBar}>
        <input
          style={styles.searchInput}
          placeholder={`🔍 ${t('common.search')}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select style={styles.select} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">{t('user.allRoles')}</option>
          <option value="ORGANIZATION">{t('user.organization')}</option>
          <option value="EVALUATOR">{t('user.evaluator')}</option>
          <option value="ADMIN">{t('user.administrator')}</option>
        </select>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>{t('user.fullName')}</span>
          <span>{t('common.email')}</span>
          <span>{t('common.role')}</span>
          <span>{t('user.status')}</span>
          <span>{t('common.actions')}</span>
        </div>

        {filtered.length > 0 ? (
          filtered.map((u) => {
            const roleColor = getRoleColor(u.role);
            return (
              <div
                key={u.userId}
                style={styles.tableRow}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontWeight: '500' }}>{u.name}</span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>{u.email}</span>
                <span
                  style={{
                    ...styles.badge,
                    background: roleColor.bg,
                    color: roleColor.color,
                  }}
                >
                  {t(`user.${u.role.toLowerCase()}`)}
                </span>
                <span
                  style={{
                    ...styles.badge,
                    background: u.active !== false ? '#d1fae5' : '#fee2e2',
                    color: u.active !== false ? '#059669' : '#dc2626',
                  }}
                >
                  {u.active !== false ? `● ${t('user.active')}` : `● ${t('user.inactive')}`}
                </span>
                <div>
                  <button
                    style={{ ...styles.actionButton, background: '#eff6ff', color: '#2563eb' }}
                    onClick={() => openEditModal(u)}
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    style={{ ...styles.actionButton, background: '#fef2f2', color: '#dc2626' }}
                    onClick={() => handleDelete(u.userId)}
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>👥</p>
            <p style={{ fontWeight: '600' }}>{t('user.noUsersFound')}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editUser ? t('user.editUser') : t('user.addUser')}
            </h2>

            {error && <div style={styles.error}>⚠️ {error}</div>}

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('user.fullName')} *</label>
              <input
                style={styles.input}
                placeholder={t('user.enterFullName')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('common.email')} *</label>
              <input
                style={styles.input}
                type="email"
                placeholder={t('user.enterEmail')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {t('common.password')} {!editUser && '*'}
              </label>
              <input
                style={styles.input}
                type="password"
                placeholder={editUser ? t('user.leaveBlankToKeep') : t('user.enterPassword')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('common.role')}</label>
              <select
                style={{ ...styles.input, cursor: 'pointer' }}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ORGANIZATION">{t('user.organization')}</option>
                <option value="EVALUATOR">{t('user.evaluator')}</option>
                <option value="ADMIN">{t('user.administrator')}</option>
              </select>
            </div>

            <div style={styles.modalButtons}>
              <button style={styles.cancelButton} onClick={() => setShowModal(false)}>
                {t('common.cancel')}
              </button>
              <button
                style={styles.saveButton}
                onClick={handleSave}
                onMouseEnter={(e) => e.target.style.background = '#6d28d9'}
                onMouseLeave={(e) => e.target.style.background = '#7c3aed'}
              >
                {editUser ? t('common.saveChanges') : t('user.addUser')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;