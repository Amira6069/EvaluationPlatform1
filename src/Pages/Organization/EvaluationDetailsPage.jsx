import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EvaluationDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const [evaluation, setEvaluation] = useState(null);
  
  useEffect(() => {
    const data = localStorage.getItem(`evaluation_${id}`);
    if (data) {
      setEvaluation(JSON.parse(data));
    }
  }, [id]);
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };
  
  if (!evaluation) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          🛡️ Governance Platform
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>👤 {user.fullName || 'User'}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>
      
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/organization/evaluations')}
          style={{
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          ← Back to Evaluations
        </button>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{evaluation.name}</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Evaluation Details</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Period</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>{evaluation.period}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Status</p>
              <p style={{ fontSize: '18px', fontWeight: '600', textTransform: 'capitalize' }}>{evaluation.status}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Created</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>
                {new Date(evaluation.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {evaluation.description && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Description</p>
              <p>{evaluation.description}</p>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate(`/organization/evaluations/${id}/form`)}
            style={{
              padding: '12px 24px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {evaluation.status === 'draft' ? 'Continue Editing' : 'View Form'}
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this evaluation?')) {
                localStorage.removeItem(`evaluation_${id}`);
                navigate('/organization/evaluations');
              }
            }}
            style={{
              padding: '12px 24px',
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetailsPage;