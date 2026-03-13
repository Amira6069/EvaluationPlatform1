import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getQueue } from '../../Services/evaluatorService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getQueue();
      const evaluations = response.data || [];

      const pending = evaluations.filter((e) => !e.reviewed).length;
      const reviewed = evaluations.filter((e) => e.reviewed).length;
      const approved = evaluations.filter((e) => e.reviewStatus === 'APPROVED').length;
      const rejected = evaluations.filter((e) => e.reviewStatus === 'REJECTED').length;

      setStats({ pending, reviewed, approved, rejected });
      console.log('✅ Evaluator stats loaded');
    } catch (error) {
      console.error('❌ Error loading stats:', error);
    } finally {
      setLoading(false);
    }
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
    quickActions: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
    actionButton: {
      width: '100%',
      padding: '16px',
      background: '#eff6ff',
      color: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      marginBottom: '12px',
      transition: 'background 0.2s',
    },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>{t('common.loading')}</p>
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

      <div style={styles.statsGrid}>
        <div
          style={styles.statCard}
          onClick={() => navigate('/evaluator/queue')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>{stats.pending}</div>
          <div style={styles.statLabel}>⏳ Pending Reviews</div>
        </div>

        <div
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{ ...styles.statValue, color: '#10b981' }}>{stats.approved}</div>
          <div style={styles.statLabel}>✅ Approved</div>
        </div>

        <div
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{ ...styles.statValue, color: '#ef4444' }}>{stats.rejected}</div>
          <div style={styles.statLabel}>❌ Rejected</div>
        </div>

        <div
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.statValue}>{stats.reviewed}</div>
          <div style={styles.statLabel}>📋 Total Reviewed</div>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>{t('dashboard.quickActions')}</h2>
        <button
          style={styles.actionButton}
          onClick={() => navigate('/evaluator/queue')}
          onMouseEnter={(e) => (e.target.style.background = '#dbeafe')}
          onMouseLeave={(e) => (e.target.style.background = '#eff6ff')}
        >
          📋 View Evaluation Queue
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;