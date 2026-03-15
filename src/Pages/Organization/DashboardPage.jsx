import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import evaluationService from '../../Services/evaluationService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('📡 Fetching my evaluations from dashboard');
      const data = await evaluationService.getMyEvaluations();
      
      setEvaluations(data);
      
      // Calculate stats
      const statsData = {
        total: data.length,
        inProgress: data.filter(e => e.status === 'IN_PROGRESS' || e.status === 'CREATED').length,
        completed: data.filter(e => e.status === 'APPROVED').length,
        pending: data.filter(e => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW').length,
      };
      
      setStats(statsData);
      console.log('✅ Dashboard data loaded:', data.length, 'evaluations');
      
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED':
      case 'IN_PROGRESS':
        return '#f59e0b';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return '#3b82f6';
      case 'APPROVED':
        return '#10b981';
      case 'REJECTED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    return t(`evaluation.${status.toLowerCase()}`) || status;
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    statCard: {
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    statLabel: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
    statValue: { fontSize: '36px', fontWeight: 'bold', color: '#111827' },
    section: { marginBottom: '32px' },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#111827' },
    button: {
      padding: '10px 20px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    table: { width: '100%', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { padding: '16px', textAlign: 'left', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
    td: { padding: '16px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#6b7280' },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {t('dashboard.welcome')}, {user?.name || 'User'}! 👋
        </h1>
        <p style={styles.subtitle}>{t('dashboard.overview')}</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>{t('dashboard.totalEvaluations')}</div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>{t('dashboard.inProgressEvaluations')}</div>
          <div style={styles.statValue}>{stats.inProgress}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>{t('dashboard.pendingEvaluations')}</div>
          <div style={styles.statValue}>{stats.pending}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>{t('dashboard.completedEvaluations')}</div>
          <div style={styles.statValue}>{stats.completed}</div>
        </div>
      </div>

      {/* Recent Evaluations */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t('dashboard.recentEvaluations')}</h2>
          <button
            style={styles.button}
            onClick={() => navigate('/organization/evaluations/new')}
            onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
            onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
          >
            + {t('evaluation.newEvaluation')}
          </button>
        </div>

        {evaluations.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
              {t('evaluation.noEvaluations')}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {t('dashboard.createFirstEvaluation')}
            </p>
            <button
              style={styles.button}
              onClick={() => navigate('/organization/evaluations/new')}
            >
              {t('evaluation.createEvaluation')}
            </button>
          </div>
        ) : (
          <div style={styles.table}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.th}>{t('evaluation.evaluationName')}</th>
                  <th style={styles.th}>{t('common.period')}</th>
                  <th style={styles.th}>{t('common.status')}</th>
                  <th style={styles.th}>{t('common.score')}</th>
                  <th style={styles.th}>{t('evaluation.created')}</th>
                  <th style={styles.th}>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.slice(0, 5).map((evaluation) => (
                  <tr key={evaluation.evaluationId}>
                    <td style={styles.td}>
                      <strong style={{ color: '#111827' }}>{evaluation.name}</strong>
                    </td>
                    <td style={styles.td}>{evaluation.period}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusColor(evaluation.status) + '20',
                          color: getStatusColor(evaluation.status),
                        }}
                      >
                        {getStatusText(evaluation.status)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {evaluation.totalScore ? Math.round(evaluation.totalScore) + '%' : '-'}
                    </td>
                    <td style={styles.td}>
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.button,
                          padding: '6px 12px',
                          fontSize: '13px',
                        }}
                        onClick={() => {
                          if (evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS') {
                            navigate(`/organization/evaluations/${evaluation.evaluationId}`);
                          } else {
                            navigate('/organization/results');
                          }
                        }}
                      >
                        {evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS'
                          ? t('evaluation.continueEvaluation')
                          : t('common.view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;