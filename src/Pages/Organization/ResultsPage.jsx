import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import evaluationService from '../../Services/evaluationService';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [evaluations, setEvaluations] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await evaluationService.getMyEvaluations();
      const approvedEvaluations = data.filter(e => e.status === 'APPROVED');
      
      setEvaluations(approvedEvaluations);

      // Load results for each approved evaluation
      const resultsData = {};
      for (const evaluation of approvedEvaluations) {
        try {
          const result = await evaluationService.getEvaluationResult(evaluation.evaluationId);
          resultsData[evaluation.evaluationId] = result;
        } catch (error) {
          console.error('Error loading result for evaluation:', evaluation.evaluationId);
        }
      }
      
      setResults(resultsData);
    } catch (error) {
      console.error('❌ Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCertificationLevel = (score) => {
    if (score >= 90) return { name: t('results.platinum'), color: '#a78bfa' };
    if (score >= 80) return { name: t('results.gold'), color: '#fbbf24' };
    if (score >= 65) return { name: t('results.silver'), color: '#9ca3af' };
    if (score >= 50) return { name: t('results.bronze'), color: '#cd7f32' };
    return { name: t('results.notCertified'), color: '#6b7280' };
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardTitle: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' },
    cardSubtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '16px' },
    scoreCircle: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '32px',
      fontWeight: 'bold',
    },
    certBadge: {
      textAlign: 'center',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
    },
    info: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
    button: {
      width: '100%',
      padding: '12px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '16px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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

  if (evaluations.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{t('results.results')}</h1>
          <p style={styles.subtitle}>{t('results.evaluationResults')}</p>
        </div>

        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
          <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
            {t('results.noResults')}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Complete and submit an evaluation to see your results here
          </p>
          <button
            style={styles.button}
            onClick={() => navigate('/organization/evaluations/new')}
          >
            {t('evaluation.createEvaluation')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('results.results')}</h1>
        <p style={styles.subtitle}>{t('results.evaluationResults')}</p>
      </div>

      <div style={styles.grid}>
        {evaluations.map((evaluation) => {
          const result = results[evaluation.evaluationId];
          const cert = getCertificationLevel(evaluation.totalScore || 0);

          return (
            <div
              key={evaluation.evaluationId}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.cardTitle}>{evaluation.name}</div>
              <div style={styles.cardSubtitle}>{evaluation.period}</div>

              <div
                style={{
                  ...styles.scoreCircle,
                  background: `linear-gradient(135deg, ${cert.color}20 0%, ${cert.color}40 100%)`,
                  border: `3px solid ${cert.color}`,
                  color: cert.color,
                }}
              >
                <div>{Math.round(evaluation.totalScore || 0)}%</div>
                <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '4px' }}>
                  {t('results.finalScore')}
                </div>
              </div>

              <div
                style={{
                  ...styles.certBadge,
                  background: cert.color + '20',
                  color: cert.color,
                }}
              >
                🏆 {cert.name}
              </div>

              {result && (
                <>
                  <div style={styles.info}>
                    <strong>{t('results.issuedDate')}:</strong>{' '}
                    {new Date(result.createdAt).toLocaleDateString()}
                  </div>
                  <div style={styles.info}>
                    <strong>{t('results.validUntil')}:</strong>{' '}
                    {new Date(result.expiryDate).toLocaleDateString()}
                  </div>
                </>
              )}

              <button
                style={styles.button}
                onClick={() => navigate(`/organization/recommendations/${evaluation.evaluationId}`)}
                onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
              >
                {t('results.viewRecommendations')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;