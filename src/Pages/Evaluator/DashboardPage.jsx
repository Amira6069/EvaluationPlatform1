import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import evaluatorService from '../../Services/evaluatorService';

const EvaluatorDashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const data = await evaluatorService.getQueue();
      setEvaluations(data);
      console.log('✅ Loaded queue:', data.length, 'evaluations');
    } catch (error) {
      console.error('❌ Error loading queue:', error);
    } finally {
      setLoading(false);
    }
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
    table: { width: '100%', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { padding: '16px', textAlign: 'left', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
    td: { padding: '16px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#6b7280' },
    button: {
      padding: '8px 16px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    },
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {t('dashboard.welcome')}, {user?.name || 'Evaluator'}! 👋
        </h1>
        <p style={styles.subtitle}>{t('evaluator.evaluationQueue')}</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>{t('evaluator.pendingReview')}</div>
          <div style={styles.statValue}>{evaluations.length}</div>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
            {t('evaluator.noEvaluationsInQueue')}
          </h3>
          <p style={{ color: '#6b7280' }}>No evaluations pending review at the moment</p>
        </div>
      ) : (
        <div style={styles.table}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.th}>{t('evaluation.evaluationName')}</th>
                <th style={styles.th}>Organization</th>
                <th style={styles.th}>{t('common.period')}</th>
                <th style={styles.th}>{t('common.score')}</th>
                <th style={styles.th}>{t('evaluation.submitted')}</th>
                <th style={styles.th}>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.evaluationId}>
                  <td style={styles.td}>
                    <strong style={{ color: '#111827' }}>{evaluation.name}</strong>
                  </td>
                  <td style={styles.td}>{evaluation.organization?.name || 'N/A'}</td>
                  <td style={styles.td}>{evaluation.period}</td>
                  <td style={styles.td}>
                    {evaluation.totalScore ? Math.round(evaluation.totalScore) + '%' : 'N/A'}
                  </td>
                  <td style={styles.td}>
                    {new Date(evaluation.submittedAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => navigate(`/evaluator/review/${evaluation.evaluationId}`)}
                      onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                      onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
                    >
                      {t('evaluator.reviewEvaluation')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EvaluatorDashboardPage;