import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../../Services/api';

const EvaluationsPage = () => {
  const { t } = useTranslation();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'approve' or 'reject'

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/evaluations');
      setEvaluations(response.data || []);
      console.log('✅ Admin evaluations loaded:', response.data?.length || 0);
    } catch (error) {
      console.error('❌ Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (evaluation) => {
    setSelectedEvaluation(evaluation);
    setModalType('approve');
    setShowModal(true);
  };

  const handleReject = async (evaluation) => {
    setSelectedEvaluation(evaluation);
    setModalType('reject');
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      const endpoint = modalType === 'approve' ? 'approve' : 'reject';
      await API.post(`/admin/evaluations/${selectedEvaluation.evaluationId}/${endpoint}`, {
        comments: 'Admin action',
      });

      alert(`Evaluation ${modalType}d successfully!`);
      setShowModal(false);
      fetchEvaluations(); // Reload
    } catch (error) {
      console.error(`❌ Error ${modalType}ing evaluation:`, error);
      alert(`Failed to ${modalType} evaluation`);
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

  const filteredEvaluations = evaluations.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const styles = {
    container: { padding: '24px' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827' },
    filterBar: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
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
    table: { width: '100%', background: 'white', borderRadius: '12px', overflow: 'hidden' },
    th: {
      padding: '16px',
      textAlign: 'left',
      background: '#f9fafb',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px',
    },
    td: { padding: '16px', borderTop: '1px solid #e5e7eb', fontSize: '14px' },
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
      fontSize: '13px',
      fontWeight: '600',
      marginRight: '8px',
      transition: 'opacity 0.2s',
    },
    approveButton: { background: '#d1fae5', color: '#065f46' },
    rejectButton: { background: '#fee2e2', color: '#991b1b' },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
    },
    modalTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' },
    modalButtons: { display: 'flex', gap: '12px', marginTop: '24px' },
    confirmButton: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading evaluations...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 All Evaluations</h1>
      </div>

      <div style={styles.filterBar}>
        {['all', 'CREATED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(
          (status) => (
            <button
              key={status}
              style={{
                ...styles.filterButton,
                ...(filter === status ? styles.filterActive : styles.filterInactive),
              }}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      <div style={styles.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Organization</th>
              <th style={styles.th}>Period</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.map((evaluation) => {
              const statusColor = getStatusColor(evaluation.status);
              const canApprove = evaluation.status === 'SUBMITTED';

              return (
                <tr key={evaluation.evaluationId}>
                  <td style={styles.td}>
                    <strong>{evaluation.name}</strong>
                  </td>
                  <td style={styles.td}>{evaluation.organizationName}</td>
                  <td style={styles.td}>{evaluation.period}</td>
                  <td style={styles.td}>
                    <strong>{Math.round(evaluation.totalScore || 0)}%</strong>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: statusColor.bg,
                        color: statusColor.color,
                      }}
                    >
                      {evaluation.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {canApprove && (
                      <>
                        <button
                          style={{ ...styles.actionButton, ...styles.approveButton }}
                          onClick={() => handleApprove(evaluation)}
                          onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                          onMouseLeave={(e) => (e.target.style.opacity = '1')}
                        >
                          ✓ Approve
                        </button>
                        <button
                          style={{ ...styles.actionButton, ...styles.rejectButton }}
                          onClick={() => handleReject(evaluation)}
                          onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                          onMouseLeave={(e) => (e.target.style.opacity = '1')}
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    {evaluation.status === 'APPROVED' && (
                      <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Approved</span>
                    )}
                    {evaluation.status === 'REJECTED' && (
                      <span style={{ color: '#ef4444', fontWeight: '600' }}>✗ Rejected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {modalType === 'approve' ? '✓ Approve Evaluation' : '✗ Reject Evaluation'}
            </h2>
            <p>
              Are you sure you want to {modalType}{' '}
              <strong>{selectedEvaluation?.name}</strong>?
            </p>
            {modalType === 'approve' && (
              <p style={{ color: '#10b981', marginTop: '12px' }}>
                This will generate a certificate and recommendations.
              </p>
            )}
            <div style={styles.modalButtons}>
              <button style={styles.cancelButton} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                style={{
                  ...styles.confirmButton,
                  background: modalType === 'approve' ? '#10b981' : '#ef4444',
                  color: 'white',
                }}
                onClick={confirmAction}
              >
                {modalType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationsPage;