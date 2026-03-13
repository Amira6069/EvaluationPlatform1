import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    },
    button: {
      padding: '24px',
      background: 'white',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
    },
    icon: {
      fontSize: '32px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quick Actions</h2>
      <div style={styles.grid}>
        <button
          style={styles.button}
          onClick={() => navigate('/organization/evaluations/new')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.background = '#eff6ff';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={styles.icon}>➕</span>
          <span>Start New Evaluation</span>
        </button>

        <button
          style={styles.button}
          onClick={() => navigate('/organization/results')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.background = '#d1fae5';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={styles.icon}>📊</span>
          <span>View Results</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;