import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import evaluationService from '../../Services/evaluationService';

const RecommendationsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [evaluation, setEvaluation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const evalData = await evaluationService.getEvaluationById(id);
      setEvaluation(evalData);

      const recsData = await evaluationService.getRecommendations(id);
      setRecommendations(recsData);
    } catch (error) {
      console.error('❌ Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRecommendations = () => {
    if (filter === 'all') return recommendations;
    return recommendations.filter(r => r.priority === filter);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f59e0b';
      case 'MEDIUM':
        return '#3b82f6';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    backButton: {
      padding: '8px 16px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '24px',
    },
    filters: { display: 'flex', gap: '12px', marginBottom: '24px' },
    filterButton: {
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '14px',
    },
    filterButtonActive: {
      background: '#2563eb',
      color: 'white',
      border: '1px solid #2563eb',
    },
    recCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '4px solid',
    },
    recHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' },
    recTitle: { fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' },
    priorityBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    },
    recText: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '12px' },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
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

  const filteredRecommendations = getFilteredRecommendations();

  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={() => navigate('/organization/results')}
      >
        ← {t('common.back')}
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>
          {t('recommendations.aiRecommendations')} - {evaluation?.name}
        </h1>
        <p style={styles.subtitle}>{t('recommendations.improvementRecommendations')}</p>
      </div>

      <div style={styles.filters}>
        {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
          <button
            key={priority}
            style={{
              ...styles.filterButton,
              ...(filter === priority ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter(priority)}
          >
            {priority === 'all' ? t('recommendations.allPriorities') : t(`recommendations.${priority.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {filteredRecommendations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
            {t('recommendations.noRecommendations')}
          </h3>
          <p style={{ color: '#6b7280' }}>
            No recommendations available for this filter
          </p>
        </div>
      ) : (
        filteredRecommendations.map((rec) => (
          <div
            key={rec.recommendationId}
            style={{
              ...styles.recCard,
              borderLeftColor: getPriorityColor(rec.priority),
            }}
          >
            <div style={styles.recHeader}>
              <div>
                <div style={styles.recTitle}>{rec.title || 'Recommendation'}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {t('recommendations.currentLevel')}: {rec.currentMaturityLevel || 0} →{' '}
                  {t('recommendations.targetLevel')}: {rec.targetMaturityLevel || 3}
                </div>
              </div>
              <span
                style={{
                  ...styles.priorityBadge,
                  background: getPriorityColor(rec.priority) + '20',
                  color: getPriorityColor(rec.priority),
                }}
              >
                {t(`recommendations.${rec.priority.toLowerCase()}`)}
              </span>
            </div>

            <div style={styles.recText}>{rec.recommendation}</div>

            {rec.actionPlan && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  {t('recommendations.actionPlan')}:
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{rec.actionPlan}</div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RecommendationsPage;