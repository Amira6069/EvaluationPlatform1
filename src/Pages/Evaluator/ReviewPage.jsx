import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getEvaluationForReview,
  approveEvaluation,
  rejectEvaluation,
} from '../../Services/evaluatorService';
import { GOVERNANCE_PRINCIPLES } from '../../utils/constants';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [responses, setResponses] = useState({});
  const [existingReview, setExistingReview] = useState(null);
  const [comments, setComments] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = async () => {
    try {
      setLoading(true);
      const response = await getEvaluationForReview(id);
      const { evaluation: evalData, responses: responsesData, review } = response.data;

      setEvaluation(evalData);
      setExistingReview(review);

      // Convert responses array to object
      const responsesObj = {};
      responsesData.forEach((r) => {
        const key = `${r.principleId}-${r.practiceId}-${r.criterionId}`;
        responsesObj[key] = r;
      });

      setResponses(responsesObj);

      if (review) {
        setComments(review.evaluatorComments || '');
      }

      console.log('✅ Evaluation loaded for review');
    } catch (error) {
      console.error('❌ Error loading evaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await approveEvaluation(id, comments);
      
      alert(t('evaluation.approved') + '!');
      navigate('/evaluator/queue');
    } catch (error) {
      console.error('❌ Error approving:', error);
      alert('Failed to approve evaluation');
    } finally {
      setSubmitting(false);
      setShowApproveModal(false);
    }
  };

  const handleReject = async () => {
    if (!comments || comments.trim() === '') {
      alert('Comments are required for rejection');
      return;
    }

    try {
      setSubmitting(true);
      await rejectEvaluation(id, comments);
      
      alert(t('evaluation.rejected') + '!');
      navigate('/evaluator/queue');
    } catch (error) {
      console.error('❌ Error rejecting:', error);
      alert('Failed to reject evaluation');
    } finally {
      setSubmitting(false);
      setShowRejectModal(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const maturityLabels = [
    t('evaluation.notExists'),
    t('evaluation.inDevelopment'),
    t('evaluation.completed'),
    t('evaluation.validated'),
  ];

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '16px' },
    scoreHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '8px',
    },
    scoreCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '24px',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    principleHeader: {
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
      marginBottom: '20px',
    },
    principleTitle: { fontSize: '20px', fontWeight: 'bold' },
    practiceCard: {
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '12px',
    },
    practiceTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px',
    },
    criterionRow: {
      padding: '12px',
      background: 'white',
      borderRadius: '6px',
      marginBottom: '8px',
      border: '1px solid #e5e7eb',
    },
    criterionText: {
      fontSize: '14px',
      color: '#374151',
      marginBottom: '8px',
      fontWeight: '500',
    },
    maturityBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    evidenceBox: {
      padding: '8px 12px',
      background: '#f9fafb',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#6b7280',
      marginTop: '8px',
    },
    commentsSection: {
      marginTop: '24px',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    approveButton: {
      background: '#10b981',
      color: 'white',
    },
    rejectButton: {
      background: '#ef4444',
      color: 'white',
    },
    backButton: {
      background: '#f3f4f6',
      color: '#374151',
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
    modalCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <p>Evaluation not found</p>
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(evaluation.totalScore || 0);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{evaluation.name}</h1>
        <p style={styles.subtitle}>
          {evaluation.organizationName} • {evaluation.period}
        </p>

        <div style={styles.scoreHeader}>
          <div style={{ ...styles.scoreCircle, background: scoreColor }}>
            <span>{Math.round(evaluation.totalScore || 0)}%</span>
            <span style={{ fontSize: '10px', fontWeight: '500' }}>{t('evaluation.score')}</span>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              {t('evaluation.overallScore')}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
              {Math.round(evaluation.totalScore || 0)}% - Governance Assessment
            </div>
          </div>
        </div>
      </div>

      {/* Responses by Principle */}
      {GOVERNANCE_PRINCIPLES.map((principle) => (
        <div key={principle.id} style={styles.card}>
          <div style={styles.principleHeader}>
            <div style={styles.principleTitle}>
              {t('evaluation.principle')} {principle.number}: {principle.name}
            </div>
          </div>

          {principle.practices.map((practice) => (
            <div key={practice.id} style={styles.practiceCard}>
              <div style={styles.practiceTitle}>
                {t('evaluation.practice')} {practice.id}: {practice.name}
              </div>

              {practice.criteria.map((criterion) => {
                const key = `${principle.id}-${practice.id}-${criterion.id}`;
                const response = responses[key];

                if (!response) return null;

                const maturityLevel = response.maturityLevel || 0;
                const maturityColor =
                  maturityLevel === 3
                    ? '#10b981'
                    : maturityLevel === 2
                    ? '#3b82f6'
                    : maturityLevel === 1
                    ? '#f59e0b'
                    : '#6b7280';

                return (
                  <div key={criterion.id} style={styles.criterionRow}>
                    <div style={styles.criterionText}>
                      <strong>C{criterion.id}:</strong> {criterion.text}
                    </div>

                    <div
                      style={{
                        ...styles.maturityBadge,
                        background: maturityColor + '20',
                        color: maturityColor,
                      }}
                    >
                      Level {maturityLevel}: {maturityLabels[maturityLevel]}
                    </div>

                    {response.evidence && (
                      <div style={styles.evidenceBox}>
                        <strong>📎 {t('evaluation.evidence')}:</strong> {response.evidence}
                      </div>
                    )}

                    {response.comments && (
                      <div style={styles.evidenceBox}>
                        <strong>💬 {t('evaluation.comments')}:</strong> {response.comments}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      {/* Evaluator Comments */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Evaluator Comments
        </h3>
        <textarea
          style={styles.textarea}
          placeholder="Add your comments about this evaluation..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={existingReview !== null}
        />

        {existingReview ? (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: existingReview.approvalStatus === 'APPROVED' ? '#d1fae5' : '#fee2e2',
              color: existingReview.approvalStatus === 'APPROVED' ? '#065f46' : '#991b1b',
              borderRadius: '8px',
              fontWeight: '600',
            }}
          >
            ✓ Already reviewed: {existingReview.approvalStatus}
          </div>
        ) : (
          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.backButton }}
              onClick={() => navigate('/evaluator/queue')}
            >
              ← {t('common.back')}
            </button>
            <button
              style={{ ...styles.button, ...styles.rejectButton }}
              onClick={() => setShowRejectModal(true)}
              onMouseEnter={(e) => (e.target.style.background = '#dc2626')}
              onMouseLeave={(e) => (e.target.style.background = '#ef4444')}
            >
              ✗ {t('common.delete')} Reject
            </button>
            <button
              style={{ ...styles.button, ...styles.approveButton }}
              onClick={() => setShowApproveModal(true)}
              onMouseEnter={(e) => (e.target.style.background = '#059669')}
              onMouseLeave={(e) => (e.target.style.background = '#10b981')}
            >
              ✓ Approve
            </button>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div style={styles.modal} onClick={() => setShowApproveModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Approve Evaluation
            </h3>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>
              Are you sure you want to approve this evaluation?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{ ...styles.button, ...styles.backButton, flex: 1 }}
                onClick={() => setShowApproveModal(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                style={{ ...styles.button, ...styles.approveButton, flex: 1 }}
                onClick={handleApprove}
                disabled={submitting}
              >
                {submitting ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={styles.modal} onClick={() => setShowRejectModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Reject Evaluation
            </h3>
            <p style={{ marginBottom: '12px', color: '#6b7280' }}>
              Please provide comments explaining the rejection:
            </p>
            <textarea
              style={{ ...styles.textarea, marginBottom: '24px' }}
              placeholder="Comments required for rejection..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{ ...styles.button, ...styles.backButton, flex: 1 }}
                onClick={() => setShowRejectModal(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                style={{ ...styles.button, ...styles.rejectButton, flex: 1 }}
                onClick={handleReject}
                disabled={submitting || !comments.trim()}
              >
                {submitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;