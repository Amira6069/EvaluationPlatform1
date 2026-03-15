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

  const getFilteredEvaluations = () => {
    if (filter === 'all') return evaluations;
    return evaluations.filter(e => e.status === filter);
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

  const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827' },
    button: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
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
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '8px',
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

  const filteredEvaluations = getFilteredEvaluations();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('evaluation.myEvaluations')}</h1>
        <button
          style={styles.button}
          onClick={() => navigate('/organization/evaluations/new')}
          onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
          onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
        >
          + {t('evaluation.newEvaluation')}
        </button>
      </div>

      <div style={styles.filters}>
        {['all', 'CREATED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            style={{
              ...styles.filterButton,
              ...(filter === status ? styles.filterButtonActive : {}),
            }}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All' : t(`evaluation.${status.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {filteredEvaluations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
            {t('evaluation.noEvaluations')}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {t('evaluation.createFirst')}
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
              {filteredEvaluations.map((evaluation) => (
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
                      {t(`evaluation.${evaluation.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {evaluation.totalScore ? Math.round(evaluation.totalScore) + '%' : '-'}
                  </td>
                  <td style={styles.td}>
                    {new Date(evaluation.createdAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {(evaluation.status === 'CREATED' || evaluation.status === 'IN_PROGRESS') && (
                      <>
                        <button
                          style={{
                            ...styles.actionButton,
                            background: '#2563eb',
                            color: 'white',
                          }}
                          onClick={() => navigate(`/organization/evaluations/${evaluation.evaluationId}`)}
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            background: '#ef4444',
                            color: 'white',
                          }}
                          onClick={() => handleDelete(evaluation.evaluationId)}
                        >
                          {t('common.delete')}
                        </button>
                      </>
                    )}
                    {evaluation.status === 'APPROVED' && (
                      <button
                        style={{
                          ...styles.actionButton,
                          background: '#10b981',
                          color: 'white',
                        }}
                        onClick={() => navigate('/organization/results')}
                      >
                        {t('results.viewCertificate')}
                      </button>
                    )}
                    {(evaluation.status === 'SUBMITTED' || evaluation.status === 'UNDER_REVIEW') && (
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {t('results.pendingApproval')}
                      </span>
                    )}
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

export default EvaluationsPage;