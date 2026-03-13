import React, { useState, useEffect } from 'react';
import { getMyEvaluations } from '../../../Services/evaluationService';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    pending: 0,
    latestScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyEvaluations();
      const evaluations = response.data || [];

      const active = evaluations.filter(e => 
        e.status === 'CREATED' || e.status === 'IN_PROGRESS'
      ).length;
      
      const completed = evaluations.filter(e => 
        e.status === 'APPROVED'
      ).length;
      
      const pending = evaluations.filter(e => 
        e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW'
      ).length;
      
      const approvedEvals = evaluations.filter(e => 
        e.status === 'APPROVED' && e.totalScore !== null
      );
      const latestScore = approvedEvals.length > 0 
        ? approvedEvals[approvedEvals.length - 1].totalScore 
        : 0;

      setStats({ 
        active, 
        completed, 
        pending, 
        latestScore: Number(latestScore).toFixed(1)
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
      setStats({ active: 0, completed: 0, pending: 0, latestScore: 0 });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
      marginBottom: '8px'
    },
    cardValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827'
    },
    icon: {
      fontSize: '32px'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280'
    },
    error: {
      padding: '12px 16px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      marginBottom: '20px'
    }
  };

  if (loading) {
    return <div style={styles.loading}>⏳ Loading statistics...</div>;
  }

  return (
    <>
      {error && <div style={styles.error}>⚠️ {error}</div>}
      
      <div style={styles.grid}>
        {/* Active Evaluations */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.cardTitle}>Active Evaluations</p>
              <h2 style={styles.cardValue}>{stats.active}</h2>
            </div>
            <span style={styles.icon}>📝</span>
          </div>
        </div>

        {/* Completed */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.cardTitle}>Completed</p>
              <h2 style={styles.cardValue}>{stats.completed}</h2>
            </div>
            <span style={styles.icon}>✅</span>
          </div>
        </div>

        {/* Pending Review */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.cardTitle}>Pending Review</p>
              <h2 style={styles.cardValue}>{stats.pending}</h2>
            </div>
            <span style={styles.icon}>⏳</span>
          </div>
        </div>

        {/* Latest Score */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.cardTitle}>Latest Score</p>
              <h2 style={styles.cardValue}>{stats.latestScore}%</h2>
            </div>
            <span style={styles.icon}>🎯</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardStats;