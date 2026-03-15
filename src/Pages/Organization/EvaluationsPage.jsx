import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import evaluationService from '../../Services/evaluationService';

const EvaluationsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      const data = await evaluationService.getMyEvaluations();
      setEvaluations(data);
      console.log('✅ Evaluations loaded:', data.length);
    } catch (error) {
      console.error('❌ Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('evaluation.confirmDelete'))) return;

    try {
      await evaluationService.deleteEvaluation(id);
      setEvaluations(evaluations.filter(e => e.evaluationId !== id));
      alert(t('evaluation.evaluationDeleted'));
    } catch (error) {
      console.error('❌ Error deleting evaluation:', error);
      alert('Failed to delete evaluation');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CREATED: '#6b7280',
      IN_PROGRESS: '#3b82f6',
      SUBMITTED: '#f59e0b',
      APPROVED: '#10b981',
      REJECTED: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      CREATED: '📝',
      IN_PROGRESS: '⏳',
      SUBMITTED: '📤',
      APPROVED: '✅',
      REJECTED: '❌',
    };
    return icons[status] || '📋';
  };

  const filteredEvaluations = evaluations.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827' },
    newButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filters: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '8px 16px',
      background: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    filterButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderColor: '#667eea',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.3s',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    },
    cardMeta: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '4px',
    },
    scoreCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '16px auto',
    },
    actions: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #f3f4f6',
    },
    actionButton: {
      flex: 1,
      padding: '10px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      background: 'white',
      borderRadius: '16px',
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
        <h1 style={styles.title}>{t('evaluation.myEvaluations')}</h1>
        <button
          style={styles.newButton}
          onClick={() => navigate('/organization/evaluations/new')}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <span>➕</span>
          {t('evaluation.newEvaluation')}
        </button>
      </div>

      <div style={styles.filters}>
        {['all', 'CREATED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED'].map(status => (
          <button
            key={status}
            style={{
              ...styles.filterButton,
              ...(filter === status ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All' : t(`evaluation.${status.toLowerCase().replace('_', '-')}`)}
            {status !== 'all' && ` (${evaluations.filter(e => e.status === status).length})`}
          </button>
        ))}
      </div>

      {filteredEvaluations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '20px', color: '#111827', marginBottom: '8px' }}>
            {t('evaluation.noEvaluations')}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {t('evaluation.createFirst')}
          </p>
          <button
            style={styles.newButton}
            onClick={() => navigate('/organization/evaluations/new')}
          >
            <span>➕</span>
            {t('evaluation.createEvaluation')}
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredEvaluations.map((evaluation) => {
            const statusColor = getStatusColor(evaluation.status);
            const statusIcon = getStatusIcon(evaluation.status);

            return (
              <div
                key={evaluation.evaluationId}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.cardTitle}>{evaluation.name}</div>
                    <div style={styles.cardMeta}>📅 {evaluation.period}</div>
                    <div style={styles.cardMeta}>
                      🕒 {new Date(evaluation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.statusBadge,
                      background: statusColor + '20',
                      color: statusColor,
                    }}
                  >
                    <span>{statusIcon}</span>
                    {t(`evaluation.${evaluation.status.toLowerCase().replace('_', '-')}`)}
                  </div>
                </div>

                {evaluation.totalScore != null && (
                  <div
                    style={{
                      ...styles.scoreCircle,
                      background: `linear-gradient(135deg, ${statusColor}20 0%, ${statusColor}40 100%)`,
                      border: `3px solid ${statusColor}`,
                      color: statusColor,
                    }}
                  >
                    <div>{Math.round(evaluation.totalScore)}%</div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>Score</div>
                  </div>
                )}

                <div style={styles.actions}>
                  {evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS' ? (
                    <button
                      style={{
                        ...styles.actionButton,
                        background: '#3b82f6',
                        color: 'white',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/organization/evaluations/edit/${evaluation.evaluationId}`);
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#2563eb')}
                      onMouseLeave={(e) => (e.target.style.background = '#3b82f6')}
                    >
                      ✏️ {t('evaluation.continueEvaluation')}
                    </button>
                  ) : (
                    <button
                      style={{
                        ...styles.actionButton,
                        background: '#f3f4f6',
                        color: '#374151',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/organization/evaluations/edit/${evaluation.evaluationId}`);
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#e5e7eb')}
                      onMouseLeave={(e) => (e.target.style.background = '#f3f4f6')}
                    >
                      👁️ {t('common.view')}
                    </button>
                  )}

                  {(evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS') && (
                    <button
                      style={{
                        ...styles.actionButton,
                        background: '#fee2e2',
                        color: '#dc2626',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(evaluation.evaluationId);
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#fecaca')}
                      onMouseLeave={(e) => (e.target.style.background = '#fee2e2')}
                    >
                      🗑️ {t('common.delete')}
                    </button>
                  )}

                  {evaluation.status === 'APPROVED' && (
                    <button
                      style={{
                        ...styles.actionButton,
                        background: '#d1fae5',
                        color: '#065f46',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/organization/results');
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#a7f3d0')}
                      onMouseLeave={(e) => (e.target.style.background = '#d1fae5')}
                    >
                      🏆 {t('results.viewCertificate')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvaluationsPage;