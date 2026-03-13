import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvaluations } from '../../../Services/evaluationService';

const RecentEvaluations = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentEvaluations();
  }, []);

  const fetchRecentEvaluations = async () => {
    try {
      setLoading(true);
      const response = await getMyEvaluations();
      const recent = (response.data || []).slice(0, 5);
      setEvaluations(recent);
    } catch (error) {
      console.error('Error fetching recent evaluations:', error);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CREATED: '#93c5fd',
      IN_PROGRESS: '#fbbf24',
      SUBMITTED: '#a78bfa',
      UNDER_REVIEW: '#fb923c',
      APPROVED: '#4ade80',
      REJECTED: '#f87171'
    };
    return colors[status] || '#d1d5db';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const styles = {
    container: {
      marginBottom: '32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
    },
    viewAllButton: {
      padding: '8px 16px',
      background: '#eff6ff',
      color: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    table: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    row: {
      padding: '16px 24px',
      borderBottom: '1px solid #f3f4f6',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '16px',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    name: {
      fontWeight: '600',
      color: '#111827',
    },
    date: {
      color: '#6b7280',
      fontSize: '14px',
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white',
      display: 'inline-block',
    },
    empty: {
      textAlign: 'center',
      padding: '60px',
      color: '#6b7280',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Recent Evaluations</h2>
        <div style={styles.loading}>⏳ Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Recent Evaluations</h2>
        <button
          style={styles.viewAllButton}
          onClick={() => navigate('/organization/evaluations')}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
        >
          View All →
        </button>
      </div>

      <div style={styles.table}>
        {evaluations.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📝</p>
            <p>No evaluations yet</p>
          </div>
        ) : (
          evaluations.map((evaluation) => (
            <div
              key={evaluation.evaluationId}
              style={styles.row}
              onClick={() => navigate(`/organization/evaluations/${evaluation.evaluationId}`)}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
            >
              <span style={styles.name}>{evaluation.name}</span>
              <span style={styles.date}>{formatDate(evaluation.createdAt)}</span>
              <span
                style={{
                  ...styles.badge,
                  background: getStatusColor(evaluation.status),
                }}
              >
                {evaluation.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentEvaluations;