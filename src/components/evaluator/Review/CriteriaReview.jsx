import React from 'react';

const CriteriaReview = ({ criterion, response, maturity, onViewEvidence }) => {
  const styles = {
    card: {
      marginBottom: '20px', paddingBottom: '20px',
      borderBottom: '1px solid #f3f4f6',
    },
    title: {
      fontSize: '15px', fontWeight: '500', color: '#111827',
      marginBottom: '8px', lineHeight: '1.5',
    },
    evidence: {
      fontSize: '13px', color: '#6b7280', marginBottom: '12px', fontStyle: 'italic',
    },
    responseBox: {
      padding: '14px', background: '#f9fafb',
      borderRadius: '8px', border: '1px solid #e5e7eb',
    },
    row: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '10px',
    },
    label: { fontSize: '13px', fontWeight: '500', color: '#6b7280' },
    maturityBadge: {
      padding: '5px 14px', borderRadius: '14px',
      fontSize: '13px', fontWeight: '600',
    },
    notAnswered: { fontSize: '13px', color: '#ef4444' },
    fileRow: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '10px', background: 'white', borderRadius: '6px',
      marginTop: '8px', border: '1px solid #e5e7eb',
    },
    viewEvidenceBtn: {
      padding: '4px 10px', background: '#eff6ff', color: '#2563eb',
      border: '1px solid #bfdbfe', borderRadius: '6px',
      cursor: 'pointer', fontSize: '12px', fontWeight: '500',
    },
    commentBox: {
      marginTop: '10px', padding: '10px', background: 'white',
      borderRadius: '6px', fontSize: '13px', color: '#374151',
      lineHeight: '1.6', border: '1px solid #e5e7eb',
    },
    noResponse: {
      padding: '14px', background: '#fff7ed',
      borderRadius: '8px', border: '1px solid #fed7aa',
      fontSize: '14px', color: '#9a3412',
    },
  };

  const maturityColors = {
    0: '#ef4444', 1: '#f59e0b', 2: '#3b82f6', 3: '#10b981',
  };

  return (
    <div style={styles.card}>
      <p style={styles.title}>Criterion {criterion.id}: {criterion.text}</p>
      <p style={styles.evidence}>📎 Evidence: {criterion.evidence}</p>

      {response && response.maturityLevel != null ? (
        <div style={styles.responseBox}>
          <div style={styles.row}>
            <span style={styles.label}>Maturity Level:</span>
            {maturity ? (
              <span style={{
                ...styles.maturityBadge,
                background: `${maturityColors[maturity.value]}20`,
                color: maturityColors[maturity.value],
              }}>
                {maturity.value} - {maturity.label}
              </span>
            ) : (
              <span style={styles.notAnswered}>Not answered</span>
            )}
          </div>

          {response.fileName && (
            <div style={styles.fileRow}>
              <span>📄</span>
              <span style={{ flex: 1, fontSize: '13px' }}>{response.fileName}</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {(response.fileSize / 1024).toFixed(1)} KB
              </span>
              <button style={styles.viewEvidenceBtn} onClick={onViewEvidence}>
                View
              </button>
            </div>
          )}

          {response.comment && (
            <div>
              <p style={{ ...styles.label, marginTop: '10px', marginBottom: '4px' }}>Comment:</p>
              <div style={styles.commentBox}>{response.comment}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.noResponse}>
          ⚠️ This criterion has not been answered by the organization
        </div>
      )}
    </div>
  );
};

export default CriteriaReview;