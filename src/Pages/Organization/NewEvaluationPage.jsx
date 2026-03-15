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
    loadPrinciples();
    
    if (id) {
      loadEvaluation(id);
    }
  }, [id]);

  useEffect(() => {
    if (topRef.current && step === 2) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPrincipleIndex, step]);

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
      setError('Failed to create evaluation');
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

  const handleFileUpload = async (principleId, practiceId, criterionId, file) => {
    if (!file) return;

    if (!evaluationId) {
      alert('Please save the evaluation first before uploading files');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      console.log('📤 Uploading file:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('evaluationId', evaluationId);
      formData.append('criterionId', criterionId);

      const response = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('governance_token'),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('✅ File uploaded:', data.filename);

      // Save filename to response
      handleResponseChange(
        principleId,
        practiceId,
        criterionId,
        'evidenceFile',
        data.filename
      );

      alert('✅ File uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Failed to upload file: ' + error.message);
    }
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
          maturityLevel: responses[key].maturityLevel || 0,
          evidence: responses[key].evidence || '',
          comments: responses[key].comments || '',
          evidenceFile: responses[key].evidenceFile || null,
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
          evidenceFile: responses[key].evidenceFile || null,
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
    fileAttached: {
      marginTop: '8px',
      padding: '8px 12px',
      background: '#d1fae5',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#065f46',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
            {evaluationId ? 'Edit Evaluation' : t('evaluation.createEvaluation')}
          </h1>
          <p style={styles.subtitle}>Fill in the basic information</p>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleBasicInfoSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Evaluation Name *</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Enter evaluation name"
                value={evaluationData.name}
                onChange={(e) =>
                  setEvaluationData({ ...evaluationData, name: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Period *</label>
              <input
                type="text"
                style={styles.input}
                placeholder="e.g., Q1 2026"
                value={evaluationData.period}
                onChange={(e) =>
                  setEvaluationData({ ...evaluationData, period: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                placeholder="Enter description"
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
                Cancel
              </button>
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
                onMouseEnter={(e) => (e.target.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.target.style.background = '#2563eb')}
              >
                {loading ? 'Loading...' : 'Next →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Fill Criteria
  const maturityLevels = [
    { value: 0, label: 'Not Implemented' },
    { value: 1, label: 'Partially Implemented' },
    { value: 2, label: 'Largely Implemented' },
    { value: 3, label: 'Fully Implemented' },
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
          Principle {currentPrincipleIndex + 1} of {totalPrinciples}
        </p>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.card}>
        <div style={styles.principleHeader}>
          <div style={styles.principleTitle}>
            Principle: {currentPrinciple.name}
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
              Practice: {practice.name}
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

                  {/* Maturity Level Buttons */}
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

                  {/* Evidence Text */}
                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, fontSize: '13px' }}>
                      Evidence (Text)
                    </label>
                    <textarea
                      style={{ ...styles.textarea, minHeight: '60px', fontSize: '13px' }}
                      placeholder="Provide evidence for your assessment"
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

                  {/* ✅ FILE UPLOAD */}
                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, fontSize: '13px' }}>
                      📎 Upload Evidence File (PDF, Image - Max 10MB)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      style={{
                        ...styles.input,
                        fontSize: '13px',
                        padding: '8px',
                      }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(
                            currentPrinciple.principleId,
                            practice.practiceId,
                            criterion.criterionId,
                            file
                          );
                        }
                      }}
                    />
                    {response.evidenceFile && (
                      <div style={styles.fileAttached}>
                        <span>✅</span>
                        <span>File attached: {response.evidenceFile.split('_').pop()}</span>
                      </div>
                    )}
                  </div>

                  {/* Comments */}
                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, fontSize: '13px' }}>
                      Additional Comments
                    </label>
                    <textarea
                      style={{ ...styles.textarea, minHeight: '60px', fontSize: '13px' }}
                      placeholder="Add your comments here"
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
              ← Previous
            </button>
            <button
              type="button"
              style={styles.saveButton}
              onClick={handleSaveProgress}
              disabled={saving}
              onMouseEnter={(e) => (e.target.style.background = '#059669')}
              onMouseLeave={(e) => (e.target.style.background = '#10b981')}
            >
              {saving ? '💾 Saving...' : '💾 Save Progress'}
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
                Next →
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
                {saving ? 'Submitting...' : '✓ Submit Evaluation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvaluationPage;