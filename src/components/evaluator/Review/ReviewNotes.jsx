import React from 'react';

const ReviewNotes = ({ evaluation }) => {
  const styles = {
    card: {
      background: 'white', borderRadius: '12px', padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px',
    },
    title: { fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    infoBox: { padding: '14px', background: '#f9fafb', borderRadius: '8px' },
    label: { fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
    value: { fontSize: '15px', fontWeight: '600', color: '#111827' },
    commentBox: {
      padding: '16px', background: '#eff6ff', borderRadius: '8px',
      borderLeft: '4px solid #2563eb', marginTop: '16px',
    },
    commentLabel: { fontSize: '13px', color: '#1e40af', fontWeight: '500', marginBottom: '8px' },
    commentText: { fontSize: '14px', color: '#1e3a8a', lineHeight: '1.6' },
    noComment: {
      padding: '14px', background: '#f9fafb', borderRadius: '8px',
      fontSize: '14px', color: '#9ca3af', fontStyle: 'italic', marginTop: '16px',
    },
  };

  const getStatusBadge = (status) => {
    const config = {
      submitted: { bg: '#ede9fe', color: '#7c3aed', label: 'Pending Review' },
      'under-review': { bg: '#fef3c7', color: '#d97706', label: 'Under Review' },
      approved: { bg: '#d1fae5', color: '#059669', label: 'Approved' },
      rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
    };
    const c = config[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
    return (
      <span style={{
        padding: '4px 12px', borderRadius: '12px', fontSize: '13px',
        fontWeight: '600', background: c.bg, color: c.color,
      }}>{c.label}</span>
    );
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📋 Submission Notes</h3>

      <div style={styles.grid}>
        <div style={styles.infoBox}>
          <p style={styles.label}>Evaluation Name</p>
          <p style={styles.value}>{evaluation.name}</p>
        </div>
        <div style={styles.infoBox}>
          <p style={styles.label}>Period</p>
          <p style={styles.value}>{evaluation.period}</p>
        </div>
        <div style={styles.infoBox}>
          <p style={styles.label}>Status</p>
          <div style={{ marginTop: '4px' }}>{getStatusBadge(evaluation.status)}</div>
        </div>
        <div style={styles.infoBox}>
          <p style={styles.label}>Submitted Date</p>
          <p style={styles.value}>
            {evaluation.submittedDate
              ? new Date(evaluation.submittedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              : 'N/A'}
          </p>
        </div>
      </div>

      {evaluation.description ? (
        <div style={styles.commentBox}>
          <p style={styles.commentLabel}>Organization Description:</p>
          <p style={styles.commentText}>{evaluation.description}</p>
        </div>
      ) : (
        <div style={styles.noComment}>No additional description provided by the organization.</div>
      )}

      {evaluation.reviewComment && (
        <div style={{ ...styles.commentBox, background: evaluation.status === 'approved' ? '#f0fdf4' : '#fff7ed', borderColor: evaluation.status === 'approved' ? '#10b981' : '#f59e0b', marginTop: '12px' }}>
          <p style={{ ...styles.commentLabel, color: evaluation.status === 'approved' ? '#065f46' : '#92400e' }}>
            Previous Evaluator Comment:
          </p>
          <p style={{ ...styles.commentText, color: evaluation.status === 'approved' ? '#064e3b' : '#78350f' }}>
            {evaluation.reviewComment}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewNotes;