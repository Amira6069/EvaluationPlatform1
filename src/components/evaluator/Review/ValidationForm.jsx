import React, { useState } from 'react';

const ValidationForm = ({ evaluation, onApprove, onReject, onCancel }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const isAlreadyReviewed = ['approved', 'rejected'].includes(evaluation?.status);

  const handleApprove = () => {
    if (!comment.trim()) {
      setError('Please add a comment before approving');
      return;
    }
    setError('');
    onApprove(comment);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      setError('Please explain why you are rejecting');
      return;
    }
    setError('');
    onReject(comment);
  };

  const styles = {
    card: {
      background: 'white', borderRadius: '12px', padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px',
      position: 'sticky', bottom: '20px',
    },
    title: { fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
    textarea: {
      width: '100%', padding: '12px 16px',
      border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
      borderRadius: '8px', fontSize: '14px', minHeight: '100px',
      resize: 'vertical', fontFamily: 'inherit',
      outline: 'none', marginBottom: '8px',
      boxSizing: 'border-box',
    },
    error: { color: '#ef4444', fontSize: '13px', marginBottom: '12px' },
    buttons: { display: 'flex', gap: '12px', marginTop: '8px' },
    cancelBtn: {
      padding: '12px 24px', background: '#f3f4f6', color: '#374151',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '15px', fontWeight: '600',
    },
    rejectBtn: {
      flex: 1, padding: '12px 24px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '15px', fontWeight: '600',
    },
    approveBtn: {
      flex: 1, padding: '12px 24px', background: '#10b981', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '15px', fontWeight: '600',
    },
    alreadyReviewedBox: {
      padding: '20px', borderRadius: '10px', textAlign: 'center',
      background: evaluation?.status === 'approved' ? '#d1fae5' : '#fee2e2',
      border: `1px solid ${evaluation?.status === 'approved' ? '#10b981' : '#ef4444'}`,
    },
    alreadyReviewedText: {
      fontSize: '16px', fontWeight: '600',
      color: evaluation?.status === 'approved' ? '#065f46' : '#991b1b',
    },
  };

  if (isAlreadyReviewed) {
    return (
      <div style={styles.card}>
        <div style={styles.alreadyReviewedBox}>
          <p style={{ fontSize: '36px', marginBottom: '8px' }}>
            {evaluation.status === 'approved' ? '✅' : '❌'}
          </p>
          <p style={styles.alreadyReviewedText}>
            This evaluation has been {evaluation.status === 'approved' ? 'APPROVED' : 'REJECTED'}
          </p>
          {evaluation.reviewComment && (
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#6b7280' }}>
              Comment: {evaluation.reviewComment}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>⚖️ Review Decision</h3>
      <textarea
        style={styles.textarea}
        placeholder="Add your review comment (required before approving or rejecting)..."
        value={comment}
        onChange={(e) => { setComment(e.target.value); setError(''); }}
      />
      {error && <p style={styles.error}>⚠️ {error}</p>}
      <div style={styles.buttons}>
        <button style={styles.cancelBtn} onClick={onCancel}
          onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
        >Cancel</button>
        <button style={styles.rejectBtn} onClick={handleReject}
          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
        >❌ Reject</button>
        <button style={styles.approveBtn} onClick={handleApprove}
          onMouseEnter={(e) => e.target.style.background = '#059669'}
          onMouseLeave={(e) => e.target.style.background = '#10b981'}
        >✅ Approve</button>
      </div>
    </div>
  );
};

export default ValidationForm;