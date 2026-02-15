import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignedQueue = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const all = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const ev = JSON.parse(localStorage.getItem(key));
        if (['submitted', 'under-review'].includes(ev.status)) {
          all.push(ev);
        }
      }
    }
    all.sort((a, b) => new Date(b.submittedDate || b.createdDate) - new Date(a.submittedDate || a.createdDate));
    setEvaluations(all.slice(0, 5));
  }, []);

  const getStatusColor = (status) => ({
    submitted: '#8b5cf6', 'under-review': '#f59e0b',
  }[status] || '#6b7280');

  const getStatusLabel = (status) => ({
    submitted: 'Pending Review', 'under-review': 'Under Review',
  }[status] || status);

  const styles = {
    section: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
    tableHeader: {
      background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      padding: '14px 24px', display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px',
      fontSize: '13px', fontWeight: '600', color: '#6b7280',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6', padding: '16px 24px',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '16px', alignItems: 'center',
    },
    badge: {
      display: 'inline-block', padding: '4px 10px',
      borderRadius: '12px', fontSize: '12px', fontWeight: '500',
    },
    reviewBtn: {
      padding: '7px 14px', background: '#2563eb', color: 'white',
      border: 'none', borderRadius: '6px', cursor: 'pointer',
      fontSize: '13px', fontWeight: '500',
    },
    empty: { textAlign: 'center', padding: '60px 20px', color: '#6b7280' },
  };

  return (
    <div>
      <h2 style={styles.sectionTitle}>Assigned for Review</h2>
      <div style={styles.section}>
        <div style={styles.tableHeader}>
          <span>Evaluation</span>
          <span>Period</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {evaluations.length > 0 ? evaluations.map((ev) => (
          <div
            key={ev.id}
            style={styles.tableRow}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontWeight: '500' }}>{ev.name}</span>
            <span style={{ color: '#6b7280' }}>{ev.period}</span>
            <span style={{
              ...styles.badge,
              background: `${getStatusColor(ev.status)}20`,
              color: getStatusColor(ev.status),
            }}>
              {getStatusLabel(ev.status)}
            </span>
            <button
              style={styles.reviewBtn}
              onClick={() => navigate(`/evaluator/review/${ev.id}`)}
              onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.background = '#2563eb'}
            >
              Review
            </button>
          </div>
        )) : (
          <div style={styles.empty}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>No pending evaluations</p>
            <p style={{ fontSize: '14px' }}>All submissions have been reviewed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedQueue;