import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../Services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    totalEvaluations: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await API.get('/admin/stats');
      setStats(statsResponse.data);

      // Fetch recent evaluations
      const evalsResponse = await API.get('/admin/evaluations');
      const recent = (evalsResponse.data || []).slice(0, 5);
      setRecentActivity(recent);

      console.log('✅ Admin dashboard loaded');
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CREATED: { bg: '#f3f4f6', color: '#374151' },
      IN_PROGRESS: { bg: '#dbeafe', color: '#1e40af' },
      SUBMITTED: { bg: '#e0e7ff', color: '#4338ca' },
      UNDER_REVIEW: { bg: '#fef3c7', color: '#92400e' },
      APPROVED: { bg: '#d1fae5', color: '#065f46' },
      REJECTED: { bg: '#fee2e2', color: '#991b1b' },
    };
    return colors[status] || { bg: '#f3f4f6', color: '#374151' };
  };

  const styles = {
    container: { padding: '24px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    statCard: {
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '4px',
    },
    statLabel: { fontSize: '14px', color: '#6b7280', fontWeight: '500' },
    section: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#111827' },
    viewAllButton: {
      padding: '8px 16px',
      background: '#eff6ff',
      color: '#2563eb',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    activityRow: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background 0.2s',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '600',
    },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    empty: { textAlign: 'center', padding: '40px', color: '#6b7280' },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
    },
    actionCard: {
      padding: '20px',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    actionIcon: { fontSize: '32px', marginBottom: '8px' },
    actionLabel: { fontSize: '14px', fontWeight: '600', color: '#111827' },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>{t('dashboard.loadingStats')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 {t('dashboard.overview')}</h1>
        <p style={styles.subtitle}>{t('dashboard.welcomeBack')}</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div
          style={styles.statCard}
          onClick={() => navigate('/admin/users')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.statValue}>{stats.totalUsers}</div>
          <div style={styles.statLabel}>👥 {t('dashboard.totalUsers')}</div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate('/admin/users')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.statValue}>{stats.totalOrganizations}</div>
          <div style={styles.statLabel}>🏢 {t('dashboard.totalOrganizations')}</div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate('/admin/evaluations')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.statValue}>{stats.totalEvaluations}</div>
          <div style={styles.statLabel}>📋 {t('dashboard.totalEvaluations')}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t('dashboard.recentActivity')}</h2>
          <button
            style={styles.viewAllButton}
            onClick={() => navigate('/admin/evaluations')}
            onMouseEnter={(e) => (e.target.style.background = '#dbeafe')}
            onMouseLeave={(e) => (e.target.style.background = '#eff6ff')}
          >
            {t('dashboard.viewAll')} →
          </button>
        </div>

        {recentActivity.length > 0 ? (
          recentActivity.map((evaluation) => {
            const statusColor = getStatusColor(evaluation.status);
            return (
              <div
                key={evaluation.evaluationId}
                style={styles.activityRow}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {evaluation.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {evaluation.organizationName} • {evaluation.period}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      ...styles.badge,
                      background: statusColor.bg,
                      color: statusColor.color,
                    }}
                  >
                    {t(`evaluation.${evaluation.status.toLowerCase()}`)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.empty}>
            <p>No recent activity</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t('dashboard.quickActions')}</h2>
        <div style={styles.quickActionsGrid}>
          <div
            style={styles.actionCard}
            onClick={() => navigate('/admin/users')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={styles.actionIcon}>👥</div>
            <div style={styles.actionLabel}>{t('nav.users')}</div>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate('/admin/evaluations')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={styles.actionIcon}>📋</div>
            <div style={styles.actionLabel}>{t('nav.evaluations')}</div>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate('/admin/governance')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={styles.actionIcon}>🏛️</div>
            <div style={styles.actionLabel}>{t('nav.governance')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;