import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getQueue } from '../../Services/evaluatorService';

const QueuePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, reviewed, pending

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching queue...');
      
      const response = await getQueue();
      setEvaluations(response.data || []);
      
      console.log('✅ Queue loaded:', response.data?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (filter === 'all') return true;
    if (filter === 'reviewed') return evaluation.reviewed;
    if (filter === 'pending') return !evaluation.reviewed;
    return true;
  });

  const styles = {
    container: { padding: '24px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    filterBar: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
    },
    filterButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    filterActive: {
      background: '#2563eb',
      color: 'white',
    },
    filterInactive: {
      background: '#f3f4f6',
      color: '#6b7280',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px',
    },
    cardOrg: {
      fontSize: '14px',
      color: '#6b7280',
    },
    scoreCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px',
    },
    scoreLabel: {
      fontSize: '9px',
      fontWeight: '500',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '12px',
    },
    loading: {
      textAlign: 'center',
      padding: '60px',
      color: '#6b7280',
    },
    empty: {
      textAlign: 'center',
      padding: '60px',
      color: '#6b7280',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
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
        <h1 style={styles.title}>📋 {t('queue.evaluationQueue')}</h1>
        <p style={styles.subtitle}>{t('queue.evaluationsWillAppear')}</p>
      </div>

      <div style={styles.filterBar}>
        {['all', 'pending', 'reviewed'].map((filterType) => (
          <button
            key={filterType}
            style={{
              ...styles.filterButton,
              ...(filter === filterType ? styles.filterActive : styles.filterInactive),
            }}
            onClick={() => setFilter(filterType)}
            onMouseEnter={(e) => {
              if (filter !== filterType) e.target.style.background = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              if (filter !== filterType) e.target.style.background = '#f3f4f6';
            }}
          >
            {filterType === 'all' && t('evaluation.all')}
            {filterType === 'pending' && 'Pending Review'}
            {filterType === 'reviewed' && 'Reviewed'}
          </button>
        ))}
      </div>

      {filteredEvaluations.length > 0 ? (
        <div style={styles.grid}>
          {filteredEvaluations.map((evaluation) => {
            const scoreColor = getScoreColor(evaluation.totalScore || 0);
            return (
              <div
                key={evaluation.evaluationId}
                style={styles.card}
                onClick={() => navigate(`/evaluator/review/${evaluation.evaluationId}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{evaluation.name}</h3>
                    <p style={styles.cardOrg}>{evaluation.organizationName}</p>
                  </div>
                  <div style={{ ...styles.scoreCircle, background: scoreColor }}>
                    <span>{Math.round(evaluation.totalScore || 0)}%</span>
                    <span style={styles.scoreLabel}>{t('evaluation.score')}</span>
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  📅 {evaluation.period}
                </div>

                {evaluation.reviewed ? (
                  <div
                    style={{
                      ...styles.badge,
                      background: evaluation.reviewStatus === 'APPROVED' ? '#d1fae5' : '#fee2e2',
                      color: evaluation.reviewStatus === 'APPROVED' ? '#065f46' : '#991b1b',
                    }}
                  >
                    ✓ {evaluation.reviewStatus === 'APPROVED' ? t('evaluation.approved') : t('evaluation.rejected')}
                  </div>
                ) : (
                  <div
                    style={{
                      ...styles.badge,
                      background: '#fef3c7',
                      color: '#92400e',
                    }}
                  >
                    ⏳ Pending Review
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.empty}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            {t('queue.noEvaluations')}
          </p>
          <p style={{ fontSize: '14px' }}>{t('queue.evaluationsWillAppear')}</p>
        </div>
      )}
    </div>
  );
};

export default QueuePage;