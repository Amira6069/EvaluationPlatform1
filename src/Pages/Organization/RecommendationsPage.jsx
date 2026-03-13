import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRecommendations, getEvaluationById } from '../../Services/evaluationService';

const RecommendationsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState('all'); // all, critical, high, medium, low

  useEffect(() => {
    loadRecommendations();
  }, [id]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Load evaluation details
      const evalResponse = await getEvaluationById(id);
      setEvaluation(evalResponse.data.evaluation);

      // Load recommendations
      const recResponse = await getRecommendations(id);
      setRecommendations(recResponse.data || []);

      console.log('✅ Loaded recommendations:', recResponse.data?.length || 0);
    } catch (error) {
      console.error('❌ Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
      HIGH: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      MEDIUM: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
      LOW: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    };
    return colors[priority] || colors.MEDIUM;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      CRITICAL: '🚨',
      HIGH: '⚠️',
      MEDIUM: '📌',
      LOW: '💡',
    };
    return icons[priority] || '📌';
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filter === 'all') return true;
    return rec.priority === filter.toUpperCase();
  });

  const groupedByPriority = {
    CRITICAL: recommendations.filter((r) => r.priority === 'CRITICAL'),
    HIGH: recommendations.filter((r) => r.priority === 'HIGH'),
    MEDIUM: recommendations.filter((r) => r.priority === 'MEDIUM'),
    LOW: recommendations.filter((r) => r.priority === 'LOW'),
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '16px' },
    backButton: {
      padding: '8px 16px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    filterBar: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      flexWrap: 'wrap',
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
    filterActive: { background: '#2563eb', color: 'white' },
    filterInactive: { background: '#f3f4f6', color: '#6b7280' },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    },
    statCard: {
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    statValue: { fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' },
    statLabel: { fontSize: '14px', color: '#6b7280' },
    recommendationCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '4px solid',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    priorityBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '12px',
    },
    maturityBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      marginLeft: '8px',
    },
    recommendationText: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#374151',
      marginTop: '12px',
    },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
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
        <button
          style={styles.backButton}
          onClick={() => navigate('/organization/results')}
          onMouseEnter={(e) => (e.target.style.background = '#e5e7eb')}
          onMouseLeave={(e) => (e.target.style.background = '#f3f4f6')}
        >
          ← {t('common.back')}
        </button>
        <h1 style={styles.title}>💡 Improvement Recommendations</h1>
        <p style={styles.subtitle}>
          {evaluation?.name} • {evaluation?.period}
        </p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderTop: '3px solid #ef4444' }}>
          <div style={{ ...styles.statValue, color: '#ef4444' }}>
            {groupedByPriority.CRITICAL.length}
          </div>
          <div style={styles.statLabel}>🚨 Critical</div>
        </div>
        <div style={{ ...styles.statCard, borderTop: '3px solid #f59e0b' }}>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>
            {groupedByPriority.HIGH.length}
          </div>
          <div style={styles.statLabel}>⚠️ High Priority</div>
        </div>
        <div style={{ ...styles.statCard, borderTop: '3px solid #3b82f6' }}>
          <div style={{ ...styles.statValue, color: '#3b82f6' }}>
            {groupedByPriority.MEDIUM.length}
          </div>
          <div style={styles.statLabel}>📌 Medium</div>
        </div>
        <div style={{ ...styles.statCard, borderTop: '3px solid #10b981' }}>
          <div style={{ ...styles.statValue, color: '#10b981' }}>
            {groupedByPriority.LOW.length}
          </div>
          <div style={styles.statLabel}>💡 Low</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        {['all', 'critical', 'high', 'medium', 'low'].map((filterType) => (
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
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      {filteredRecommendations.length > 0 ? (
        filteredRecommendations.map((rec) => {
          const priorityStyle = getPriorityColor(rec.priority);
          return (
            <div
              key={rec.recommendationId}
              style={{
                ...styles.recommendationCard,
                borderLeftColor: priorityStyle.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div
                style={{
                  ...styles.priorityBadge,
                  background: priorityStyle.bg,
                  color: priorityStyle.color,
                  border: `1px solid ${priorityStyle.border}`,
                }}
              >
                <span>{getPriorityIcon(rec.priority)}</span>
                <span>{rec.priority}</span>
              </div>

              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                <strong>Principle {rec.principleId}</strong> • Practice {rec.practiceId} •
                Criterion {rec.criterionId}
              </div>

              <div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Current Level:</span>
                <span
                  style={{
                    ...styles.maturityBadge,
                    background: '#fee2e2',
                    color: '#991b1b',
                  }}
                >
                  Level {rec.currentMaturityLevel}
                </span>
                <span style={{ fontSize: '14px', color: '#6b7280', margin: '0 8px' }}>→</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Target:</span>
                <span
                  style={{
                    ...styles.maturityBadge,
                    background: '#d1fae5',
                    color: '#065f46',
                  }}
                >
                  Level {rec.targetMaturityLevel}
                </span>
              </div>

              <div style={styles.recommendationText}>{rec.recommendationText}</div>
            </div>
          );
        })
      ) : (
        <div style={styles.empty}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</p>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            No {filter !== 'all' ? filter : ''} recommendations
          </p>
          <p style={{ fontSize: '14px' }}>
            {filter !== 'all'
              ? 'Try selecting a different priority level'
              : 'Your evaluation is excellent!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;