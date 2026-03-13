import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  createEvaluation,
  updateEvaluation,
  getEvaluationById,
  saveResponses,
  submitEvaluation,
} from '../../Services/evaluationService';
import { GOVERNANCE_PRINCIPLES } from '../../utils/constants';

const NewEvaluationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If editing existing evaluation
  const { t } = useTranslation();
  const topRef = useRef(null); // ✅ For auto-scroll

  const [step, setStep] = useState(1); // 1 = Basic Info, 2 = Fill Criteria
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Basic evaluation info
  const [evaluationData, setEvaluationData] = useState({
    name: '',
    description: '',
    period: '',
  });

  const [evaluationId, setEvaluationId] = useState(id || null);
  const [currentPrincipleIndex, setCurrentPrincipleIndex] = useState(0);
  
  // Responses: { "1-1-1": { maturityLevel: 2, evidence: "...", comments: "..." } }
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (id) {
      loadEvaluation(id);
    }
  }, [id]);

  // ✅ Auto-scroll to top when principle changes
  useEffect(() => {
    if (topRef.current && step === 2) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPrincipleIndex, step]);

  const loadEvaluation = async (evalId) => {
    try {
      setLoading(true);
      const response = await getEvaluationById(evalId);
      const { evaluation, responses: existingResponses } = response.data;

      setEvaluationData({
        name: evaluation.name,
        description: evaluation.description,
        period: evaluation.period,
      });

      // Convert responses array to object
      const responsesObj = {};
      existingResponses.forEach((r) => {
        const key = `${r.principleId}-${r.practiceId}-${r.criterionId}`;
        responsesObj[key] = {
          maturityLevel: r.maturityLevel,
          evidence: r.evidence || '',
          comments: r.comments || '',
        };
      });

      setResponses(responsesObj);
      setStep(2); // Go directly to filling criteria if editing
    } catch (err) {
      console.error('Error loading evaluation:', err);
      setError(t('evaluation.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    
    if (!evaluationData.name || !evaluationData.period) {
      setError(t('evaluation.nameRequired') || 'Name and period are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (evaluationId) {
        // Update existing
        await updateEvaluation(evaluationId, evaluationData);
        console.log('✅ Evaluation updated');
      } else {
        // Create new
        const response = await createEvaluation(evaluationData);
        setEvaluationId(response.data.evaluationId);
        console.log('✅ Evaluation created:', response.data.evaluationId);
      }

      setStep(2); // Move to criteria filling
    } catch (err) {
      console.error('Error saving evaluation:', err);
      setError(t('evaluation.createFailed'));
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
      
      // Convert responses object to array
      const responsesArray = Object.keys(responses).map((key) => {
        const [principleId, practiceId, criterionId] = key.split('-').map(Number);
        return {
          principleId,
          practiceId,
          criterionId,
          maturityLevel: responses[key].maturityLevel,
          evidence: responses[key].evidence,
          comments: responses[key].comments,
        };
      });

      await saveResponses(evaluationId, responsesArray);
      console.log('✅ Progress saved');
      
      alert(t('evaluation.progressSaved') || 'Progress saved successfully!');
    } catch (err) {
      console.error('Error saving progress:', err);
      alert(t('evaluation.saveFailed') || 'Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!evaluationId) return;

    // Check if all criteria are filled
    let totalCriteria = 0;
    let filledCriteria = 0;

    GOVERNANCE_PRINCIPLES.forEach((principle) => {
      principle.practices.forEach((practice) => {
        practice.criteria.forEach((criterion) => {
          totalCriteria++;
          const key = `${principle.id}-${practice.id}-${criterion.id}`;
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

      // Save responses first
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

      await saveResponses(evaluationId, responsesArray);

      // Submit evaluation
      const result = await submitEvaluation(evaluationId);
      
      console.log('✅ Evaluation submitted:', result.data);
      
      alert(
        `${t('evaluation.evaluationSubmitted')}\n${t('evaluation.score')}: ${Math.round(
          result.data.score
        )}%`
      );

      navigate('/organization/evaluations');
    } catch (err) {
      console.error('Error submitting evaluation:', err);
      alert(t('evaluation.submitFailed') || 'Failed to submit evaluation');
    } finally {
      setSaving(false);
    }
  };

  const currentPrinciple = GOVERNANCE_PRINCIPLES[currentPrincipleIndex];

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

  // STEP 1: Basic Information
  if (step === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {evaluationId ? t('evaluation.editEvaluation') : t('evaluation.createEvaluation')}
          </h1>
          <p style={styles.subtitle}>{t('evaluation.evaluationDetails')}</p>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleBasicInfoSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('evaluation.evaluationName')} *</label>
              <input
                type="text"
                style={styles.input}
                placeholder={t('evaluation.enterEvaluationName')}
                value={evaluationData.name}
                onChange={(e) =>
                  setEvaluationData({ ...evaluationData, name: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('evaluation.period')} *</label>
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
              <label style={styles.label}>{t('evaluation.description')}</label>
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
                {loading ? t('common.loading') : t('common.next')} →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Fill Criteria
  const maturityLevels = [
    { value: 0, label: t('evaluation.notExists') },
    { value: 1, label: t('evaluation.inDevelopment') },
    { value: 2, label: t('evaluation.completed') },
    { value: 3, label: t('evaluation.validated') },
  ];

  const totalPrinciples = GOVERNANCE_PRINCIPLES.length;
  const progress = ((currentPrincipleIndex + 1) / totalPrinciples) * 100;

  return (
    <div ref={topRef} style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{evaluationData.name}</h1>
        <p style={styles.subtitle}>
          {t('evaluation.principle')} {currentPrincipleIndex + 1} / {totalPrinciples}
        </p>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.card}>
        <div style={styles.principleHeader}>
          <div style={styles.principleTitle}>
            {t('evaluation.principle')} {currentPrinciple.number}: {currentPrinciple.name}
          </div>
        </div>

        {currentPrinciple.practices.map((practice) => (
          <div key={practice.id} style={styles.practiceCard}>
            <div style={styles.practiceTitle}>
              {t('evaluation.practice')} {practice.id}: {practice.name}
            </div>

            {practice.criteria.map((criterion) => {
              const key = `${currentPrinciple.id}-${practice.id}-${criterion.id}`;
              const response = responses[key] || {};

              return (
                <div key={criterion.id} style={styles.criterionRow}>
                  <div style={styles.criterionText}>
                    <strong>C{criterion.id}:</strong> {criterion.text}
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
                            currentPrinciple.id,
                            practice.id,
                            criterion.id,
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
                      {t('evaluation.evidence')}
                    </label>
                    <textarea
                      style={{ ...styles.textarea, minHeight: '60px', fontSize: '13px' }}
                      placeholder={t('evaluation.evidence')}
                      value={response.evidence || ''}
                      onChange={(e) =>
                        handleResponseChange(
                          currentPrinciple.id,
                          practice.id,
                          criterion.id,
                          'evidence',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, fontSize: '13px' }}>
                      {t('evaluation.comments')}
                    </label>
                    <textarea
                      style={{ ...styles.textarea, minHeight: '60px', fontSize: '13px' }}
                      placeholder={t('evaluation.comments')}
                      value={response.comments || ''}
                      onChange={(e) =>
                        handleResponseChange(
                          currentPrinciple.id,
                          practice.id,
                          criterion.id,
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
              ← {t('common.previous')}
            </button>
            <button
              type="button"
              style={styles.saveButton}
              onClick={handleSaveProgress}
              disabled={saving}
              onMouseEnter={(e) => (e.target.style.background = '#059669')}
              onMouseLeave={(e) => (e.target.style.background = '#10b981')}
            >
              {saving ? '💾 Saving...' : `💾 ${t('evaluation.saveProgress')}`}
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
                {t('common.next')} →
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
                {saving ? 'Submitting...' : `✓ ${t('evaluation.submitEvaluation')}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvaluationPage;