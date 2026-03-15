import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import evaluationService from '../../Services/evaluationService';
import evaluatorService from '../../Services/evaluatorService';

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [evaluation, setEvaluation] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAllResponses, setShowAllResponses] = useState(false);

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = async () => {
    try {
      console.log('📡 Loading evaluation:', id);
      console.log('🔑 Current token:', localStorage.getItem('governance_token')?.substring(0, 20) + '...');
      console.log('👤 Current user:', JSON.parse(localStorage.getItem('governance_user') || '{}'));
      
      console.log('🌐 Making request to:', `/evaluations/${id}`);
      
      const evalData = await evaluationService.getEvaluationById(id);
      console.log('✅ Evaluation loaded:', evalData);
      setEvaluation(evalData);
      
      // ✅ GET RESPONSES
      try {
        console.log('🌐 Making request to:', `/evaluations/${id}/responses`);
        const responsesData = await evaluationService.getResponses(id);
        console.log('✅ Loaded responses:', responsesData.length);
        setResponses(responsesData);
      } catch (error) {
        console.error('❌ Error loading responses:', error);
        console.error('❌ Response status:', error.response?.status);
        console.error('❌ Response data:', error.response?.data);
        // Don't fail the whole page if responses fail
      }
      
    } catch (error) {
      console.error('❌ Error loading evaluation:', error);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      if (error.response?.status === 403) {
        alert('❌ Access denied: ' + (error.response?.data?.error || 'You do not have permission to view this evaluation'));
        navigate('/evaluator/queue');
      } else if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to load evaluation: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm(t('evaluator.confirmApproval'))) return;

    try {
      setProcessing(true);
      const result = await evaluatorService.approveEvaluation(id);
      
      alert(`✅ ${t('evaluator.evaluationApproved')}\n\nScore: ${Math.round(result.score)}%\nCertification: ${result.certificationLevel}\nRecommendations: ${result.recommendationsCount}`);
      
      navigate('/evaluator/queue');
    } catch (error) {
      console.error('❌ Error approving:', error);
      alert('Failed to approve: ' + (error.response?.data?.error || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      await evaluatorService.rejectEvaluation(id, rejectReason);
      
      alert(t('evaluator.evaluationRejected'));
      navigate('/evaluator/queue');
    } catch (error) {
      console.error('❌ Error rejecting:', error);
      alert('Failed to reject: ' + (error.response?.data?.error || error.message));
    } finally {
      setProcessing(false);
      setShowRejectModal(false);
    }
  };

  const getCertificationLevel = (score) => {
    if (score >= 90) return { name: 'Platinum', color: '#a78bfa' };
    if (score >= 80) return { name: 'Gold', color: '#fbbf24' };
    if (score >= 65) return { name: 'Silver', color: '#9ca3af' };
    if (score >= 50) return { name: 'Bronze', color: '#cd7f32' };
    return { name: 'Not Certified', color: '#6b7280' };
  };

  const getMaturityColor = (level) => {
    if (level === 3) return '#10b981';
    if (level === 2) return '#3b82f6';
    if (level === 1) return '#f59e0b';
    return '#ef4444';
  };

  const getMaturityLabel = (level) => {
    const labels = {
      0: t('ev.level0'),
      1: t('ev.level1'),
      2: t('ev.level2'),
      3: t('ev.level3')
    };
    return labels[level] || `Level ${level}`;
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    },
    scoreCircle: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      fontSize: '48px',
      fontWeight: 'bold',
    },
    info: { fontSize: '14px', color: '#6b7280', marginBottom: '12px' },
    infoLabel: { fontWeight: '600', color: '#374151' },
    buttonGroup: { display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' },
    approveButton: {
      padding: '14px 32px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    rejectButton: {
      padding: '14px 32px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    backButton: {
      padding: '10px 20px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '24px',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical',
      marginBottom: '16px',
      boxSizing: 'border-box',
    },
    responseCard: {
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '12px',
      border: '1px solid #e5e7eb',
    },
    maturityBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      marginLeft: '8px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e5e7eb',
    },
    toggleButton: {
      padding: '8px 16px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '12px',
      transition: 'background 0.2s',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p>Evaluation not found</p>
          <button
            style={{ ...styles.backButton, marginTop: '20px' }}
            onClick={() => navigate('/evaluator/queue')}
          >
            ← Back to Queue
          </button>
        </div>
      </div>
    );
  }

  const cert = getCertificationLevel(evaluation.totalScore || 0);
  const displayedResponses = showAllResponses ? responses : responses.slice(0, 10);

  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={() => navigate('/evaluator/queue')}
      >
        ← {t('common.back')}
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>{t('evaluator.reviewEvaluation')}</h1>
        <p style={styles.subtitle}>{evaluation.name}</p>
      </div>

      <div style={styles.card}>
        <div
          style={{
            ...styles.scoreCircle,
            background: `linear-gradient(135deg, ${cert.color}20 0%, ${cert.color}40 100%)`,
            border: `4px solid ${cert.color}`,
            color: cert.color,
          }}
        >
          <div>{Math.round(evaluation.totalScore || 0)}%</div>
          <div style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '8px' }}>
            {t('results.finalScore')}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              borderRadius: '20px',
              background: cert.color + '20',
              color: cert.color,
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            🏆 {cert.name}
          </div>
        </div>

        <div style={styles.info}>
          <span style={styles.infoLabel}>Organization:</span> {evaluation.organization?.name || 'N/A'}
        </div>
        <div style={styles.info}>
          <span style={styles.infoLabel}>{t('common.period')}:</span> {evaluation.period}
        </div>
        <div style={styles.info}>
          <span style={styles.infoLabel}>{t('evaluation.submitted')}:</span>{' '}
          {new Date(evaluation.submittedAt).toLocaleString()}
        </div>
        {evaluation.description && (
          <div style={styles.info}>
            <span style={styles.infoLabel}>{t('common.description')}:</span> {evaluation.description}
          </div>
        )}

        {/* ✅ EVALUATION RESPONSES SECTION */}
        {responses.length > 0 && (
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={styles.sectionTitle}>
              📋 {t('evaluator.evaluationResponses')} ({responses.length})
            </h3>
            
            {displayedResponses.map((response, index) => (
              <div key={index} style={styles.responseCard}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  Criterion #{response.criterionId}
                  <span
                    style={{
                      ...styles.maturityBadge,
                      background: getMaturityColor(response.maturityLevel) + '20',
                      color: getMaturityColor(response.maturityLevel),
                    }}
                  >
                    {getMaturityLabel(response.maturityLevel)}
                  </span>
                </div>
                {response.evidence && (
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                    <strong>{t('ev.evidence')}:</strong> {response.evidence}
                  </div>
                )}
                {response.comments && (
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    <strong>{t('ev.comments')}:</strong> {response.comments}
                  </div>
                )}
              </div>
            ))}

            {responses.length > 10 && (
              <button
                style={styles.toggleButton}
                onClick={() => setShowAllResponses(!showAllResponses)}
                onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
              >
                {showAllResponses 
                  ? `Show Less` 
                  : `Show All ${responses.length} Responses`}
              </button>
            )}
          </div>
        )}

        {responses.length === 0 && (
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p style={{ color: '#6b7280' }}>No responses available for this evaluation</p>
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            style={styles.approveButton}
            onClick={handleApprove}
            disabled={processing}
            onMouseEnter={(e) => !processing && (e.target.style.background = '#059669')}
            onMouseLeave={(e) => !processing && (e.target.style.background = '#10b981')}
          >
            {processing ? '⏳ Processing...' : `✓ ${t('evaluator.approveEvaluation')}`}
          </button>
          <button
            style={styles.rejectButton}
            onClick={() => setShowRejectModal(true)}
            disabled={processing}
            onMouseEnter={(e) => !processing && (e.target.style.background = '#dc2626')}
            onMouseLeave={(e) => !processing && (e.target.style.background = '#ef4444')}
          >
            ✗ {t('evaluator.rejectEvaluation')}
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={styles.modal} onClick={() => setShowRejectModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
              {t('evaluator.rejectEvaluation')}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Please provide a reason for rejection:
            </p>
            <textarea
              style={styles.textarea}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                style={styles.rejectButton}
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
              >
                {processing ? '⏳ Processing...' : t('evaluator.rejectEvaluation')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;