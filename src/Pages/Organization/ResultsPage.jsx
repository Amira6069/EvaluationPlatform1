import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES } from '../../utils/constants';
import ChatWidget from '../../components/organization/AIAssistant/ChatWidget';

const ResultsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    const allEvaluations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        const evaluation = JSON.parse(localStorage.getItem(key));
        if (evaluation.status === 'approved' || evaluation.status === 'submitted') {
          allEvaluations.push(evaluation);
        }
      }
    }
    allEvaluations.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    setEvaluations(allEvaluations);
    if (allEvaluations.length > 0) setSelectedEvaluation(allEvaluations[0]);
  };

  const calculateScore = (evaluation) => {
    if (!evaluation?.responses) return 0;
    const responses = Object.values(evaluation.responses);
    if (!responses.length) return 0;
    const total = responses.reduce((sum, r) => sum + (r.maturityLevel || 0), 0);
    return Math.round((total / (responses.length * 3)) * 100);
  };

  const getPrincipleScore = (principle, evaluation) => {
    if (!evaluation?.responses) return 0;
    let total = 0, scoreSum = 0;
    principle.practices.forEach(practice => {
      practice.criteria.forEach(criterion => {
        total++;
        const key = `${principle.id}-${practice.id}-${criterion.id}`;
        const response = evaluation.responses[key];
        if (response?.maturityLevel != null) scoreSum += response.maturityLevel;
      });
    });
    return total > 0 ? Math.round((scoreSum / (total * 3)) * 100) : 0;
  };

  const getGovernanceLabel = (score) => {
    if (score >= 90) return { label: 'Platinum', color: '#8b5cf6', emoji: '💎', bgColor: '#f3e8ff', next: null };
    if (score >= 80) return { label: 'Gold', color: '#f59e0b', emoji: '🥇', bgColor: '#fef3c7', next: 'Platinum at 90%' };
    if (score >= 65) return { label: 'Silver', color: '#6b7280', emoji: '🥈', bgColor: '#f3f4f6', next: 'Gold at 80%' };
    if (score >= 50) return { label: 'Bronze', color: '#c2410c', emoji: '🥉', bgColor: '#fed7aa', next: 'Silver at 65%' };
    return { label: 'Not Certified', color: '#ef4444', emoji: '📋', bgColor: '#fee2e2', next: 'Bronze at 50%' };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb' },
    header: {
      background: 'white', borderBottom: '1px solid #e5e7eb',
      padding: '16px 0', position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    headerContent: {
      maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    logoIcon: {
      width: '40px', height: '40px', background: '#2563eb', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    userSection: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500',
    },
    layout: { display: 'flex', maxWidth: '1280px', margin: '0 auto' },
    sidebar: {
      width: '250px', background: 'white', borderRight: '1px solid #e5e7eb',
      padding: '24px 0', height: 'calc(100vh - 64px)', position: 'sticky', top: '64px',
    },
    menuItem: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 24px', color: '#374151', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500',
    },
    menuItemActive: {
      background: '#eff6ff', color: '#2563eb', borderLeft: '3px solid #2563eb',
    },
    main: { flex: 1, padding: '32px 24px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    pageSubtitle: { color: '#6b7280', marginBottom: '32px' },
    select: {
      padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
      fontSize: '15px', minWidth: '320px', cursor: 'pointer', background: 'white',
      outline: 'none',
    },
    scoreCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px', padding: '48px 40px', color: 'white',
      marginBottom: '24px', textAlign: 'center',
      boxShadow: '0 10px 25px rgba(118,75,162,0.3)',
    },
    scoreValue: { fontSize: '80px', fontWeight: 'bold', marginBottom: '8px' },
    scoreLabel: { fontSize: '20px', marginBottom: '20px', opacity: 0.9 },
    labelBadge: {
      display: 'inline-flex', alignItems: 'center', gap: '12px',
      padding: '12px 32px', background: 'rgba(255,255,255,0.2)',
      borderRadius: '24px', fontSize: '20px', fontWeight: '600',
      backdropFilter: 'blur(10px)', marginBottom: '16px',
    },
    nextLabel: { fontSize: '14px', opacity: 0.8, marginTop: '8px' },
    metricsGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px', marginBottom: '32px',
    },
    metricCard: {
      background: 'white', borderRadius: '12px', padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center',
    },
    metricValue: { fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '6px' },
    metricLabel: { fontSize: '13px', color: '#6b7280' },
    sectionTitle: {
      fontSize: '20px', fontWeight: '600', color: '#111827',
      marginBottom: '16px', marginTop: '8px',
    },
    principlesGrid: {
      display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px',
    },
    principleRow: {
      background: 'white', borderRadius: '10px', padding: '16px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: '16px',
    },
    principleNum: {
      width: '36px', height: '36px', background: '#2563eb', color: 'white',
      borderRadius: '8px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0,
    },
    principleInfo: { flex: 1 },
    principleName: { fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '6px' },
    progressBar: { height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' },
    principleScore: { fontSize: '14px', fontWeight: '600', minWidth: '44px', textAlign: 'right' },
    aiHint: {
      background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
      borderRadius: '12px', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: '16px',
      marginBottom: '32px', border: '1px solid #c4b5fd',
    },
    aiHintIcon: { fontSize: '36px', flexShrink: 0 },
    aiHintText: { flex: 1 },
    aiHintTitle: { fontSize: '16px', fontWeight: '600', color: '#4c1d95', marginBottom: '4px' },
    aiHintDesc: { fontSize: '14px', color: '#5b21b6' },
    emptyState: {
      textAlign: 'center', padding: '80px 20px', background: 'white',
      borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    button: {
      padding: '12px 24px', background: '#2563eb', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '14px', fontWeight: '600',
    },
  };

  const SidebarContent = () => (
    <aside style={styles.sidebar}>
      <div style={styles.menuItem}
        onClick={() => navigate('/organization/dashboard')}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      ><span>📊</span><span>Dashboard</span></div>
      <div style={styles.menuItem}
        onClick={() => navigate('/organization/evaluations')}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      ><span>📝</span><span>Evaluations</span></div>
      <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
        <span>📈</span><span>Results</span>
      </div>
      <div style={styles.menuItem}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      ><span>⚙️</span><span>Settings</span></div>
    </aside>
  );

  const HeaderContent = () => (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logo} onClick={() => navigate('/organization/dashboard')}>
          <div style={styles.logoIcon}>🛡️</div>
          <span style={styles.logoText}>Governance Platform</span>
        </div>
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <span>👤</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.fullName || 'User'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >Logout</button>
        </div>
      </div>
    </header>
  );

  if (evaluations.length === 0) {
    return (
      <div style={styles.container}>
        <HeaderContent />
        <div style={styles.layout}>
          <SidebarContent />
          <main style={styles.main}>
            <div style={styles.emptyState}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                No Results Available
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Complete and submit an evaluation to see your results
              </p>
              <button style={styles.button}
                onClick={() => navigate('/organization/evaluations/new')}
                onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.background = '#2563eb'}
              >Start New Evaluation</button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const score = calculateScore(selectedEvaluation);
  const governanceLabel = getGovernanceLabel(score);
  const totalResponses = Object.keys(selectedEvaluation?.responses || {}).length;
  const completedResponses = Object.values(selectedEvaluation?.responses || {})
    .filter(r => r.maturityLevel != null).length;
  const avgMaturity = completedResponses > 0
    ? (Object.values(selectedEvaluation?.responses || {})
        .reduce((s, r) => s + (r.maturityLevel || 0), 0) / completedResponses).toFixed(1)
    : 0;

  return (
    <div style={styles.container}>
      <HeaderContent />

      <div style={styles.layout}>
        <SidebarContent />

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Evaluation Results</h1>
          <p style={styles.pageSubtitle}>View your governance evaluation scores and insights</p>

          {/* Evaluation Selector */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Select Evaluation:
            </label>
            <select
              style={styles.select}
              value={selectedEvaluation?.id || ''}
              onChange={(e) => {
                const ev = evaluations.find(ev => String(ev.id) === e.target.value);
                setSelectedEvaluation(ev || null);
              }}
            >
              {evaluations.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} — {ev.period}
                </option>
              ))}
            </select>
          </div>

          {/* Score Card */}
          <div style={styles.scoreCard}>
            <div style={styles.scoreValue}>{score}%</div>
            <div style={styles.scoreLabel}>Governance Score</div>
            <div style={styles.labelBadge}>
              <span style={{ fontSize: '28px' }}>{governanceLabel.emoji}</span>
              <span>{governanceLabel.label}</span>
            </div>
            {governanceLabel.next && (
              <div style={styles.nextLabel}>🎯 Next target: {governanceLabel.next}</div>
            )}
          </div>

          {/* Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{totalResponses}</div>
              <div style={styles.metricLabel}>Total Criteria</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{completedResponses}</div>
              <div style={styles.metricLabel}>Answered</div>
            </div>
            <div style={styles.metricCard}>
              <div style={{ ...styles.metricValue, fontSize: '24px' }}>
                {selectedEvaluation?.period || 'N/A'}
              </div>
              <div style={styles.metricLabel}>Period</div>
            </div>
            <div style={styles.metricCard}>
              <div style={{ ...styles.metricValue, color: '#10b981' }}>{avgMaturity}</div>
              <div style={styles.metricLabel}>Avg Maturity Level</div>
            </div>
            <div style={styles.metricCard}>
              <div style={{ ...styles.metricValue, color: governanceLabel.color, fontSize: '22px' }}>
                {governanceLabel.emoji} {governanceLabel.label}
              </div>
              <div style={styles.metricLabel}>Governance Label</div>
            </div>
          </div>

          {/* AI Assistant Hint */}
          <div style={styles.aiHint}>
            <div style={styles.aiHintIcon}>🤖</div>
            <div style={styles.aiHintText}>
              <div style={styles.aiHintTitle}>AI Assistant Available!</div>
              <div style={styles.aiHintDesc}>
                Click the 🤖 button in the bottom-right corner to get personalized AI recommendations
                based on your governance scores and specific action steps to improve.
              </div>
            </div>
          </div>

          {/* Principle Scores Breakdown */}
          <h2 style={styles.sectionTitle}>📊 Score by Principle</h2>
          <div style={styles.principlesGrid}>
            {GOVERNANCE_PRINCIPLES.map((principle) => {
              const pScore = getPrincipleScore(principle, selectedEvaluation);
              const color = getScoreColor(pScore);
              return (
                <div key={principle.id} style={styles.principleRow}>
                  <div style={styles.principleNum}>{principle.id}</div>
                  <div style={styles.principleInfo}>
                    <div style={styles.principleName}>{principle.name}</div>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${pScore}%`,
                        background: color,
                      }} />
                    </div>
                  </div>
                  <div style={{ ...styles.principleScore, color }}>
                    {pScore}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Label Thresholds Reference */}
          <h2 style={styles.sectionTitle}>🏆 Governance Labels</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px', marginBottom: '80px',
          }}>
            {[
              { emoji: '💎', label: 'Platinum', range: '≥ 90%', color: '#8b5cf6', bg: '#f3e8ff' },
              { emoji: '🥇', label: 'Gold', range: '≥ 80%', color: '#f59e0b', bg: '#fef3c7' },
              { emoji: '🥈', label: 'Silver', range: '≥ 65%', color: '#6b7280', bg: '#f3f4f6' },
              { emoji: '🥉', label: 'Bronze', range: '≥ 50%', color: '#c2410c', bg: '#fed7aa' },
              { emoji: '📋', label: 'Not Certified', range: '< 50%', color: '#ef4444', bg: '#fee2e2' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: '10px', textAlign: 'center',
                background: item.bg,
                border: governanceLabel.label === item.label ? `2px solid ${item.color}` : '2px solid transparent',
                boxShadow: governanceLabel.label === item.label ? `0 0 0 3px ${item.color}30` : 'none',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.emoji}</div>
                <div style={{ fontWeight: '600', color: item.color, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{item.range}</div>
                {governanceLabel.label === item.label && (
                  <div style={{ fontSize: '11px', fontWeight: '600', color: item.color, marginTop: '6px' }}>
                    ← Your Level
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* AI Chat Widget - floating bottom right */}
      <ChatWidget evaluation={selectedEvaluation} />
    </div>
  );
};

export default ResultsPage;