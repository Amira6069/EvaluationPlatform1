import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyEvaluations, deleteEvaluation } from '../../Services/evaluationService';

const EvaluationsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching my evaluations');
      
      const response = await getMyEvaluations();
      setEvaluations(response.data || []);
      
      console.log('✅ Evaluations loaded:', response.data?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, evaluationName) => {
    if (!window.confirm(t('evaluation.confirmDelete') || `Delete "${evaluationName}"?`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting evaluation:', id);
      await deleteEvaluation(id);
      console.log('✅ Evaluation deleted');
      
      // Refresh list
      await fetchEvaluations();
    } catch (error) {
      console.error('❌ Error deleting evaluation:', error);
      alert(t('evaluation.deleteFailed') || 'Failed to delete evaluation');
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

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filter === 'all') return true;
    return evaluation.status === filter;
  });

  const styles = {
    container: { padding: '24px' },
    header: {
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827' },
    addButton: {
      padding: '10px 20px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    filterBar: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
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
    filterActive: {
      background: '#2563eb',
      color: 'white',
    },
    filterInactive: {
      background: '#f3f4f6',
      color: '#6b7280',
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
      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 150px',
      gap: '16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6',
      padding: '16px 24px',
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 150px',
      gap: '16px',
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
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      marginRight: '4px',
      transition: 'background 0.2s',
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

  const statuses = ['all', 'CREATED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 {t('nav.evaluations')}</h1>
        <button
          style={styles.addButton}
          onClick={() => navigate('/organization/evaluations/new')}
          onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
        >
          + {t('evaluation.newEvaluation')}
        </button>
      </div>

      <div style={styles.filterBar}>
        {statuses.map((status) => (
          <button
            key={status}
            style={{
              ...styles.filterButton,
              ...(filter === status ? styles.filterActive : styles.filterInactive),
            }}
            onClick={() => setFilter(status)}
            onMouseEnter={(e) => {
              if (filter !== status) e.target.style.background = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              if (filter !== status) e.target.style.background = '#f3f4f6';
            }}
          >
            {status === 'all' ? t('evaluation.all') : t(`evaluation.${status.toLowerCase()}`)}
          </button>
        ))}
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>{t('evaluation.evaluationName')}</span>
          <span>{t('evaluation.period')}</span>
          <span>{t('evaluation.score')}</span>
          <span>{t('evaluation.status')}</span>
          <span>{t('common.actions')}</span>
        </div>

        {filteredEvaluations.length > 0 ? (
          filteredEvaluations.map((evaluation) => {
            const statusColor = getStatusColor(evaluation.status);
            const canDelete = evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS';
            const canEdit = evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS';

            return (
              <div
                key={evaluation.evaluationId}
                style={styles.tableRow}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                <span style={{ fontWeight: '600' }}>{evaluation.name}</span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  {evaluation.period}
                </span>
                <span style={{ fontWeight: '600', color: '#2563eb' }}>
                  {evaluation.totalScore ? `${Math.round(evaluation.totalScore)}%` : '-'}
                </span>
                <span
                  style={{
                    ...styles.badge,
                    background: statusColor.bg,
                    color: statusColor.color,
                  }}
                >
                  {t(`evaluation.${evaluation.status.toLowerCase()}`)}
                </span>
                <div>
                  <button
                    style={{ ...styles.actionButton, background: '#eff6ff', color: '#2563eb' }}
                    onClick={() => navigate(`/organization/evaluations/${evaluation.evaluationId}`)}
                  >
                    {canEdit ? t('common.edit') : t('common.view')}
                  </button>
                  {canDelete && (
                    <button
                      style={{ ...styles.actionButton, background: '#fef2f2', color: '#dc2626' }}
                      onClick={() => handleDelete(evaluation.evaluationId, evaluation.name)}
                    >
                      {t('common.delete')}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.empty}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>
              {t('evaluation.noEvaluationsFound')}
            </p>
            <button
              style={styles.addButton}
              onClick={() => navigate('/organization/evaluations/new')}
              onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
            >
              + {t('evaluation.newEvaluation')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationsPage;