import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import evaluationService from '../../Services/evaluationService';
import governanceService from '../../Services/governanceService';

const NewEvaluationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const topRef = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [evaluationData, setEvaluationData] = useState({
    name: '',
    description: '',
    period: '',
  });

  const [evaluationId, setEvaluationId] = useState(id || null);
  const [currentPrincipleIndex, setCurrentPrincipleIndex] = useState(0);
  const [responses, setResponses] = useState({});

  // ✅ DYNAMIC CRITERIA STATE
  const [principles, setPrinciples] = useState([]);
  const [loadingPrinciples, setLoadingPrinciples] = useState(true);

  useEffect(() => {
    loadPrinciples(); // ✅ Load dynamic criteria first
    
    if (id) {
      loadEvaluation(id);
    }
  }, [id]);

  useEffect(() => {
    if (topRef.current && step === 2) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPrincipleIndex, step]);

  // ✅ LOAD DYNAMIC PRINCIPLES FROM API
  const loadPrinciples = async () => {
    try {
      setLoadingPrinciples(true);
      const framework = await governanceService.getFramework();
      console.log('✅ Loaded dynamic framework:', framework.length, 'principles');
      setPrinciples(framework);
    } catch (error) {
      console.error('❌ Error loading governance framework:', error);
      alert('Failed to load evaluation criteria. Please refresh the page.');
    } finally {
      setLoadingPrinciples(false);
    }
  };

  const loadEvaluation = async (evalId) => {
    try {
      setLoading(true);
      const response = await evaluationService.getEvaluationById(evalId);
      const evaluation = response;

      setEvaluationData({
        name: evaluation.name,
        description: evaluation.description || '',
        period: evaluation.period,
      });

      setStep(2);
    } catch (err) {
      console.error('Error loading evaluation:', err);
      setError('Failed to load evaluation');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    
    if (!evaluationData.name || !evaluationData.period) {
      setError(t('ev.fillAllFields') || 'Name and period are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (evaluationId) {
        await evaluationService.updateEvaluation(evaluationId, evaluationData);
        console.log('✅ Evaluation updated');
      } else {
        const response = await evaluationService.createEvaluation(evaluationData);
        setEvaluationId(response.evaluationId);
        console.log('✅ Evaluation created:', response.name, ' (ID:', response.evaluationId, ')');
      }

      setStep(2);
    } catch (err) {
      console.error('Error saving evaluation:', err);
      setError(t('evaluation.createFailed') || 'Failed to create evaluation');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (principleId, practiceId, criterionId, field, value) => {
    const key = `${principleId}-${practiceId}-${criterionId}`;
    setResponses((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSaveProgress = async () => {
    if (!evaluationId) return;

    try {
      setSaving(true);
      
      const responsesArray = Object.keys(responses).map((key) => {
        const [principleId, practiceId, criterionId] = key.split('-').map(Number);
        return {
          principleId,
          practiceId,
          criterionId,
          maturityLevel: responses[key].maturityLevel,
          evidence: responses[key].evidence || '',
          comments: responses[key].comments || '',
        };
      });

      console.log('📤 Saving', responsesArray.length, 'responses');
      await evaluationService.saveResponses(evaluationId, responsesArray);
      console.log('✅ Progress saved');
      
      alert(t('ev.progressSaved') || 'Progress saved successfully!');
    } catch (err) {
      console.error('Error saving progress:', err);
      alert('Failed to save progress: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!evaluationId) return;

    let totalCriteria = 0;
    let filledCriteria = 0;

    principles.forEach((principle) => {
      principle.practices.forEach((practice) => {
        practice.criteria.forEach((criterion) => {
          totalCriteria++;
          const key = `${principle.principleId}-${practice.practiceId}-${criterion.criterionId}`;
          if (responses[key]?.maturityLevel != null) {
            filledCriteria++;
          }
        });
      });
    });

    if (filledCriteria < totalCriteria) {
      const proceed = window.confirm(
        `Only ${filledCriteria}/${totalCriteria} criteria filled. Submit anyway?`
      );
      if (!proceed) return;
    }

    try {
      setSaving(true);

      const responsesArray = Object.keys(responses).map((key) => {
        const [principleId, practiceId, criterionId] = key.split('-').map(Number);
        return {
          principleId,
          practiceId,
          criterionId,
          maturityLevel: responses[key].maturityLevel || 0,
          evidence: responses[key].evidence || '',
          comments: responses[key].comments || '',
        };
      });

      await evaluationService.saveResponses(evaluationId, responsesArray);
      const result = await evaluationService.submitEvaluation(evaluationId);
      
      console.log('✅ Evaluation submitted:', result);
      
      alert(
        `${t('evaluation.evaluationSubmitted')}\nScore: ${Math.round(result.totalScore || 0)}%`
      );

      navigate('/organization/evaluations');
    } catch (err) {
      console.error('Error submitting evaluation:', err);
      alert('Failed to submit: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    progressBar: {
      height: '8px',
      background: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '32px',
    },
    progressFill: {
      height: '100%',
      background: '#2563eb',
      transition: 'width 0.3s',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formGroup: { marginBottom: '24px' },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    button: {
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    buttonSecondary: {
      padding: '12px 24px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
      marginRight: '12px',
    },
    error: {
      padding: '12px 16px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      marginBottom: '16px',
    },
    principleHeader: {
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
      marginBottom: '24px',
    },
    principleTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' },
    practiceCard: {
      padding: '20px',
      background: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '16px',
    },
    practiceTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    criterionRow: {
      padding: '16px',
      background: 'white',
      borderRadius: '8px',
      marginBottom: '12px',
      border: '1px solid #e5e7eb',
    },
    criterionText: {
      fontSize: '14px',
      color: '#374151',
      marginBottom: '12px',
      fontWeight: '500',
    },
    maturityButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      marginBottom: '12px',
    },
    maturityButton: {
      padding: '8px',
      border: '2px solid #e5e7eb',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '12px',
      textAlign: 'center',
      transition: 'all 0.2s',
    },
    maturityButtonActive: {
      borderColor: '#2563eb',
      background: '#eff6ff',
      color: '#2563eb',
      fontWeight: '600',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
    },
    saveButton: {
      padding: '10px 20px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
  };

  if (loading || loadingPrinciples) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>{loadingPrinciples ? 'Loading evaluation criteria...' : t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // STEP 1: Basic Information
  if (step === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {evaluationId ? t('evaluation.editEvaluation') : t('evaluation.createEvaluation')}
          </h1>
          <p style={styles.subtitle}>{t('evaluation.fillAllFields')}</p>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleBasicInfoSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('evaluation.evaluationName')} *</label>
              <input
                type="text"
                style={styles.input}
                placeholder={t('evaluation.enterName')}
                value={evaluationData.name}
                onChange={(e) =>
                  setEvaluationData({ ...evaluationData, name: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('ev.period')} *</label>
              <input
                type="text"
                style={styles.input}
                placeholder={t('evaluation.enterPeriod')}
                value={evaluationData.period}
                onChange={(e) =>
                  setEvaluationData({ ...evaluationData, period: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('ev.description')}</label>
              <textarea
                style={styles.textarea}
                placeholder={t('evaluation.enterDescription')}
                value={evaluationData.description}
                onChange={(e) =>
                  setEvaluationData({ ...evaluationData, description: e.target.value })
                }
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={() => navigate('/organization/evaluations')}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
                onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
              >
                {loading ? t('common.loading') : t('ev.next')} →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Fill Criteria
  const maturityLevels = [
    { value: 0, label: t('ev.level0') },
    { value: 1, label: t('ev.level1') },
    { value: 2, label: t('ev.level2') },
    { value: 3, label: t('ev.level3') },
  ];

  const currentPrinciple = principles[currentPrincipleIndex];
  const totalPrinciples = principles.length;
  const progress = ((currentPrincipleIndex + 1) / totalPrinciples) * 100;

  if (!currentPrinciple) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p>No evaluation criteria available. Please contact administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{evaluationData.name}</h1>
        <p style={styles.subtitle}>
          {t('ev.principle')} {currentPrincipleIndex + 1} {t('ev.of')} {totalPrinciples}
        </p>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.card}>
        <div style={styles.principleHeader}>
          <div style={styles.principleTitle}>
            {t('ev.principle')}: {currentPrinciple.name}
          </div>
          {currentPrinciple.description && (
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {currentPrinciple.description}
            </div>
          )}
        </div>

        {currentPrinciple.practices.map((practice) => (
          <div key={practice.practiceId} style={styles.practiceCard}>
            <div style={styles.practiceTitle}>
              {t('ev.practice')}: {practice.name}
            </div>
            {practice.description && (
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                {practice.description}
              </div>
            )}

            {practice.criteria.map((criterion) => {
              const key = `${currentPrinciple.principleId}-${practice.practiceId}-${criterion.criterionId}`;
              const response = responses[key] || {};

              return (
                <div key={criterion.criterionId} style={styles.criterionRow}>
                  <div style={styles.criterionText}>
                    <strong>{criterion.description}</strong>
                  </div>

                  <div style={styles.maturityButtons}>
                    {maturityLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        style={{
                          ...styles.maturityButton,
                          ...(response.maturityLevel === level.value
                            ? styles.maturityButtonActive
                            : {}),
                        }}
                        onClick={() =>
                          handleResponseChange(
                            currentPrinciple.principleId,
                            practice.practiceId,
                            criterion.criterionId,
                            'maturityLevel',
                            level.value
                          )
                        }
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          {level.value}
                        </div>
                        <div style={{ fontSize: '10px' }}>{level.label}</div>
                      </button>
                    ))}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, fontSize: '13px' }}>
                      {t('ev.evidence')}
                    </label>
                    <textarea
                      style={{ ...styles.textarea, minHeight: '60px', fontSize: '13px' }}
                      placeholder={t('ev.provideEvidence')}
                      value={response.evidence || ''}
                      onChange={(e) =>
                        handleResponseChange(
                          currentPrinciple.principleId,
                          practice.practiceId,
                          criterion.criterionId,
                          'evidence',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, fontSize: '13px' }}>
                      {t('ev.comments')}
                    </label>
                    <textarea
                      style={{ ...styles.textarea, minHeight: '60px', fontSize: '13px' }}
                      placeholder={t('ev.addComments')}
                      value={response.comments || ''}
                      onChange={(e) =>
                        handleResponseChange(
                          currentPrinciple.principleId,
                          practice.practiceId,
                          criterion.criterionId,
                          'comments',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div style={styles.navigation}>
          <div>
            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={() => {
                if (currentPrincipleIndex > 0) {
                  setCurrentPrincipleIndex(currentPrincipleIndex - 1);
                } else {
                  setStep(1);
                }
              }}
            >
              ← {t('ev.previous')}
            </button>
            <button
              type="button"
              style={styles.saveButton}
              onClick={handleSaveProgress}
              disabled={saving}
              onMouseEnter={(e) => (e.target.style.background = '#059669')}
              onMouseLeave={(e) => (e.target.style.background = '#10b981')}
            >
              {saving ? '💾 Saving...' : `💾 ${t('ev.saveProgress')}`}
            </button>
          </div>

          <div>
            {currentPrincipleIndex < totalPrinciples - 1 ? (
              <button
                type="button"
                style={styles.button}
                onClick={() => setCurrentPrincipleIndex(currentPrincipleIndex + 1)}
                onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
              >
                {t('ev.next')} →
              </button>
            ) : (
              <button
                type="button"
                style={{ ...styles.button, background: '#10b981' }}
                onClick={handleSubmitEvaluation}
                disabled={saving}
                onMouseEnter={(e) => (e.target.style.background = '#059669')}
                onMouseLeave={(e) => (e.target.style.background = '#10b981')}
              >
                {saving ? 'Submitting...' : `✓ ${t('ev.submitEvaluation')}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvaluationPage;