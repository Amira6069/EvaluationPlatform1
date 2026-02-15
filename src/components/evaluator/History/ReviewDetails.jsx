import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) setEvaluation(JSON.parse(data));
  }, [id]);

  const getStatusColor = (status) => ({
    approved: '#10b981', rejected: '#ef4444',
    submitted: '#8b5cf6', 'under-review': '#f59e0b',
  }[status] || '#6b7280');

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' },
    backBtn: {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb',
      borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
      color: '#374151', marginBottom: '24px',
    },
    card: {
      background: 'white', borderRadius: '12px', padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto',
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { color: '#6b7280', marginBottom: '24px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
    infoBox: { padding: '16px', background: '#f9fafb', borderRadius: '8px' },
    infoLabel: { fontSize: '13px', color: '#6b7280', marginBottom: '4px' },
    infoValue: { fontSize: '16px', fontWeight: '600', color: '#111827' },
    badge: {
      display: 'inline-block', padding: '6px 14px',
      borderRadius: '12px', fontSize: '14px', fontWeight: '600',
    },
    commentBox: {
      padding: '16px', background: '#f9fafb', borderRadius: '8px',
      marginTop: '16px', borderLeft: '4px solid #2563eb',
    },
    commentLabel: { fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' },
    commentText: { fontSize: '15px', color: '#374151', lineHeight: '1.6' },
  };

  if (!evaluation) return (
    <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b7280' }}>Evaluation not found</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button style={styles.backBtn}
          onClick={() => navigate('/evaluator/history')}
          onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
        >← Back to History</button>

        <div style={styles.card}>
          <h1 style={styles.title}>{evaluation.name}</h1>
          <p style={styles.subtitle}>Review Details</p>

          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <p style={styles.infoLabel}>Period</p>
              <p style={styles.infoValue}>{evaluation.period}</p>
            </div>
            <div style={styles.infoBox}>
              <p style={styles.infoLabel}>Decision</p>
              <span style={{
                ...styles.badge,
                background: `${getStatusColor(evaluation.status)}20`,
                color: getStatusColor(evaluation.status),
              }}>
                {evaluation.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
              </span>
            </div>
            <div style={styles.infoBox}>
              <p style={styles.infoLabel}>Reviewed By</p>
              <p style={styles.infoValue}>{evaluation.reviewedBy || 'N/A'}</p>
            </div>
            <div style={styles.infoBox}>
              <p style={styles.infoLabel}>Review Date</p>
              <p style={styles.infoValue}>
                {evaluation.reviewedDate
                  ? new Date(evaluation.reviewedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {evaluation.reviewComment && (
            <div style={styles.commentBox}>
              <p style={styles.commentLabel}>📝 Evaluator Comment:</p>
              <p style={styles.commentText}>{evaluation.reviewComment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;