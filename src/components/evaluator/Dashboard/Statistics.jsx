import React, { useState, useEffect } from 'react';

const Statistics = () => {
  const [stats, setStats] = useState({
    pending: 0, underReview: 0, approved: 0, rejected: 0,
  });

  useEffect(() => {
    const allEvaluations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const ev = JSON.parse(localStorage.getItem(key));
        if (['submitted', 'under-review', 'approved', 'rejected'].includes(ev.status)) {
          allEvaluations.push(ev);
        }
      }
    }
    setStats({
      pending: allEvaluations.filter(e => e.status === 'submitted').length,
      underReview: allEvaluations.filter(e => e.status === 'under-review').length,
      approved: allEvaluations.filter(e => e.status === 'approved').length,
      rejected: allEvaluations.filter(e => e.status === 'rejected').length,
    });
  }, []);

  const cards = [
    { label: 'Pending Review', value: stats.pending, icon: '⏳', bg: '#ede9fe', color: '#7c3aed' },
    { label: 'Under Review', value: stats.underReview, icon: '👁️', bg: '#fef3c7', color: '#d97706' },
    { label: 'Approved', value: stats.approved, icon: '✅', bg: '#d1fae5', color: '#059669' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', bg: '#fee2e2', color: '#dc2626' },
  ];

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    card: {
      background: 'white', borderRadius: '12px', padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    label: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
    value: { fontSize: '36px', fontWeight: 'bold', color: '#111827' },
    iconBox: {
      width: '52px', height: '52px', borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
    },
  };

  return (
    <div style={styles.grid}>
      {cards.map((card, i) => (
        <div key={i} style={styles.card}>
          <div>
            <p style={styles.label}>{card.label}</p>
            <p style={styles.value}>{card.value}</p>
          </div>
          <div style={{ ...styles.iconBox, background: card.bg }}>{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;