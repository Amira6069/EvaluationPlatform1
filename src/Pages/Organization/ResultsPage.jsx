import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyEvaluations, getEvaluationResult } from '../../Services/evaluationService';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching results...');
      
      const response = await getMyEvaluations();
      const evals = response.data || [];
      
      // Filter only approved evaluations for results
      const approvedEvals = evals.filter(e => e.status === 'APPROVED');
      
      setEvaluations(approvedEvals);
      console.log('✅ Results loaded:', approvedEvals.length);
      
    } catch (err) {
      console.error('❌ Error fetching results:', err);
      setError(t('results.loadFailed') || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const viewCertificate = async (evaluationId) => {
    try {
      console.log('📜 Fetching certificate for:', evaluationId);
      const response = await getEvaluationResult(evaluationId);
      setSelectedResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('❌ Error fetching certificate:', error);
      alert('Certificate not available');
    }
  };

  const getCertificationLevel = (score) => {
    if (score >= 90) return { label: t('governance.platinum'), color: '#7c3aed', emoji: '💎' };
    if (score >= 80) return { label: t('governance.gold'), color: '#d97706', emoji: '🥇' };
    if (score >= 65) return { label: t('governance.silver'), color: '#6b7280', emoji: '🥈' };
    if (score >= 50) return { label: t('governance.bronze'), color: '#c2410c', emoji: '🥉' };
    return { label: t('governance.notCertified'), color: '#ef4444', emoji: '📋' };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const styles = {
    container: { padding: '24px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    error: {
      padding: '12px 16px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      marginBottom: '16px',
    },
    empty: {
      textAlign: 'center',
      padding: '60px',
      color: '#6b7280',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    resultsGrid: { display: 'grid', gap: '24px' },
    resultCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    cardTitle: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' },
    cardPeriod: { fontSize: '14px', color: '#6b7280' },
    scoreCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
    },
    scoreLabel: { fontSize: '10px', fontWeight: '500', marginTop: '2px' },
    certificationBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginTop: '16px',
    },
    detailItem: { padding: '12px', background: '#f9fafb', borderRadius: '8px' },
    detailLabel: { fontSize: '12px', color: '#6b7280', marginBottom: '4px' },
    detailValue: { fontSize: '16px', fontWeight: '600', color: '#111827' },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
    },
    viewButton: {
      flex: 1,
      padding: '10px 20px',
      background: '#eff6ff',
      color: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    recommendButton: {
      flex: 1,
      padding: '10px 20px',
      background: '#fef3c7',
      color: '#92400e',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'background 0.2s',
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
      padding: '40px',
      maxWidth: '600px',
      width: '90%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      textAlign: 'center',
    },
    certificateHeader: { fontSize: '48px', marginBottom: '16px' },
    certificateTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
    },
    certificateSubtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '32px' },
    certificateScore: { fontSize: '64px', fontWeight: 'bold', marginBottom: '16px' },
    certificateLabel: { fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' },
    certificateDetails: {
      textAlign: 'left',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '24px',
      marginTop: '24px',
    },
    closeButton: {
      marginTop: '24px',
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
    },
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📈 {t('results.evaluationResults')}</h1>
        <p style={styles.subtitle}>{t('results.resultsWillAppear')}</p>
      </div>

      {error && <div style={styles.error}>⚠️ {error}</div>}

      {evaluations.length > 0 ? (
        <div style={styles.resultsGrid}>
          {evaluations.map((evaluation) => {
            const score = Math.round(evaluation.totalScore || 0);
            const certification = getCertificationLevel(score);
            const scoreColor = getScoreColor(score);

            return (
              <div
                key={evaluation.evaluationId}
                style={styles.resultCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{evaluation.name}</h3>
                    <p style={styles.cardPeriod}>{evaluation.period}</p>
                  </div>
                  <div style={{ ...styles.scoreCircle, background: scoreColor }}>
                    <span>{score}%</span>
                    <span style={styles.scoreLabel}>{t('evaluation.score')}</span>
                  </div>
                </div>

                <div
                  style={{
                    ...styles.certificationBadge,
                    background: certification.color + '20',
                    color: certification.color,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{certification.emoji}</span>
                  <span>{certification.label}</span>
                </div>

                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('evaluation.status')}</div>
                    <div style={styles.detailValue}>
                      {t(`evaluation.${evaluation.status.toLowerCase()}`)}
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('governance.certificationLevel')}</div>
                    <div style={styles.detailValue}>{certification.label}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>
                      {t('evaluation.created') || 'Created'}
                    </div>
                    <div style={styles.detailValue}>
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button
                    style={styles.viewButton}
                    onClick={() => viewCertificate(evaluation.evaluationId)}
                    onMouseEnter={(e) => (e.target.style.background = '#dbeafe')}
                    onMouseLeave={(e) => (e.target.style.background = '#eff6ff')}
                  >
                    📜 View Certificate
                  </button>
                  <button
                    style={styles.recommendButton}
                    onClick={() => navigate(`/organization/recommendations/${evaluation.evaluationId}`)}
                    onMouseEnter={(e) => (e.target.style.background = '#fde68a')}
                    onMouseLeave={(e) => (e.target.style.background = '#fef3c7')}
                  >
                    💡 AI Recommendations
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.empty}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📊</p>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            {t('results.noResults')}
          </p>
          <p style={{ fontSize: '14px' }}>{t('results.resultsWillAppear')}</p>
        </div>
      )}

      {/* Certificate Modal */}
      {showModal && selectedResult && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.certificateHeader}>
              {selectedResult.certificationLabel === 'CERTIFIED_PLATINUM' && '💎'}
              {selectedResult.certificationLabel === 'CERTIFIED_GOLD' && '🥇'}
              {selectedResult.certificationLabel === 'CERTIFIED_SILVER' && '🥈'}
              {selectedResult.certificationLabel === 'CERTIFIED_BRONZE' && '🥉'}
              {selectedResult.certificationLabel === 'NOT_CERTIFIED' && '📋'}
            </div>

            <h2 style={styles.certificateTitle}>Governance Certification</h2>
            <p style={styles.certificateSubtitle}>{selectedResult.evaluationName}</p>

            <div
              style={{
                ...styles.certificateScore,
                color: getScoreColor(selectedResult.finalScore),
              }}
            >
              {Math.round(selectedResult.finalScore)}%
            </div>

            <div
              style={{
                ...styles.certificateLabel,
                color: getCertificationLevel(selectedResult.finalScore).color,
              }}
            >
              {selectedResult.certificationLabel.replace('CERTIFIED_', '').replace('_', ' ')}
            </div>

            <div style={styles.certificateDetails}>
              <p style={{ marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                <strong>Issued:</strong>{' '}
                {new Date(selectedResult.issuedDate).toLocaleDateString()}
              </p>
              {selectedResult.validUntil && (
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Valid Until:</strong>{' '}
                  {new Date(selectedResult.validUntil).toLocaleDateString()}
                </p>
              )}
            </div>

            <button
              style={styles.closeButton}
              onClick={() => setShowModal(false)}
              onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;