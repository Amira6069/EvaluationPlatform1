import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GOVERNANCE_PRINCIPLES } from '../../utils/constants';

const GovernancePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const [activeTab, setActiveTab] = useState('scores');
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [editingPrinciple, setEditingPrinciple] = useState(null);
  const [principles, setPrinciples] = useState(GOVERNANCE_PRINCIPLES);
  const [expandedPrinciple, setExpandedPrinciple] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  useEffect(() => {
    const all = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('evaluation_')) {
        all.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    all.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    setEvaluations(all);
    if (all.length > 0) setSelectedEvaluation(all[0]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate('/login');
  };

  const getPrincipleScore = (principle, evaluation) => {
    if (!evaluation?.responses) return { score: 0, completed: 0, total: 0 };
    let total = 0, completed = 0, scoreSum = 0;
    principle.practices.forEach(practice => {
      practice.criteria.forEach(criterion => {
        total++;
        const key = `${principle.id}-${practice.id}-${criterion.id}`;
        const response = evaluation.responses[key];
        if (response?.maturityLevel != null) {
          completed++;
          scoreSum += response.maturityLevel;
        }
      });
    });
    const score = total > 0 ? Math.round((scoreSum / (total * 3)) * 100) : 0;
    return { score, completed, total };
  };

  const getOverallScore = (evaluation) => {
    if (!evaluation?.responses) return 0;
    const responses = Object.values(evaluation.responses);
    if (!responses.length) return 0;
    const total = responses.reduce((sum, r) => sum + (r.maturityLevel || 0), 0);
    return Math.round((total / (responses.length * 3)) * 100);
  };

  const getGovernanceLabel = (score) => {
    if (score >= 90) return { label: 'Platinum', color: '#7c3aed', emoji: '💎' };
    if (score >= 80) return { label: 'Gold', color: '#d97706', emoji: '🥇' };
    if (score >= 65) return { label: 'Silver', color: '#6b7280', emoji: '🥈' };
    if (score >= 50) return { label: 'Bronze', color: '#c2410c', emoji: '🥉' };
    return { label: 'Not Certified', color: '#ef4444', emoji: '📋' };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const handleEditPrinciple = (principle) => {
    setEditingPrinciple(principle.id);
    setEditForm({ name: principle.name, description: principle.description });
  };

  const handleSavePrinciple = (principleId) => {
    setPrinciples(prev => prev.map(p =>
      p.id === principleId ? { ...p, name: editForm.name, description: editForm.description } : p
    ));
    setEditingPrinciple(null);
  };

  const styles = {
    container: { minHeight: '100vh', background: '#f9fafb' },
    header: {
      background: 'white', borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px', position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '8px' },
    logoIcon: {
      width: '40px', height: '40px', background: '#7c3aed', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
    },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', background: '#f3f4f6', borderRadius: '8px',
    },
    adminBadge: {
      padding: '4px 10px', background: '#ede9fe', color: '#7c3aed',
      borderRadius: '6px', fontSize: '12px', fontWeight: '600',
    },
    logoutBtn: {
      padding: '8px 16px', background: '#ef4444', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    },
    layout: { display: 'flex', maxWidth: '1280px', margin: '0 auto' },
    sidebar: {
      width: '250px', background: 'white', borderRight: '1px solid #e5e7eb',
      padding: '24px 0', height: 'calc(100vh - 65px)', position: 'sticky', top: '65px',
    },
    sidebarLabel: {
      padding: '8px 24px', fontSize: '11px', fontWeight: '600',
      color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px',
    },
    menuItem: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 24px', color: '#374151', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500',
    },
    menuItemActive: { background: '#f5f3ff', color: '#7c3aed', borderLeft: '3px solid #7c3aed' },
    main: { flex: 1, padding: '32px 24px' },
    pageTitle: { fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' },
    pageSubtitle: { color: '#6b7280', marginBottom: '24px' },
    tabs: { display: 'flex', gap: '4px', marginBottom: '28px', background: '#f3f4f6', padding: '4px', borderRadius: '10px', width: 'fit-content' },
    tab: {
      padding: '10px 24px', borderRadius: '8px', border: 'none',
      cursor: 'pointer', fontSize: '14px', fontWeight: '500',
      color: '#6b7280', background: 'transparent', transition: 'all 0.2s',
    },
    tabActive: { background: 'white', color: '#7c3aed', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    card: {
      background: 'white', borderRadius: '12px', padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px',
    },
    select: {
      padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
      fontSize: '14px', background: 'white', cursor: 'pointer',
      marginBottom: '24px', width: '100%', maxWidth: '400px',
    },
    scoreHeader: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '24px',
      padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px', color: 'white',
    },
    principleRow: {
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '16px', borderRadius: '10px', marginBottom: '10px',
      background: '#f9fafb', border: '1px solid #e5e7eb', cursor: 'pointer',
    },
    principleNum: {
      width: '36px', height: '36px', background: '#7c3aed', color: 'white',
      borderRadius: '8px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0,
    },
    progressBar: {
      flex: 1, height: '8px', background: '#e5e7eb',
      borderRadius: '4px', overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
    principleCard: {
      border: '1px solid #e5e7eb', borderRadius: '10px',
      marginBottom: '12px', overflow: 'hidden',
    },
    principleHeader: {
      padding: '16px 20px', background: '#f9fafb',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', cursor: 'pointer',
    },
    principleTitle: {
      display: 'flex', alignItems: 'center', gap: '12px',
      fontSize: '15px', fontWeight: '600', color: '#111827',
    },
    editBtn: {
      padding: '6px 14px', background: '#eff6ff', color: '#2563eb',
      border: '1px solid #bfdbfe', borderRadius: '6px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    },
    saveBtn: {
      padding: '6px 14px', background: '#7c3aed', color: 'white',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
    },
    cancelBtn: {
      padding: '6px 14px', background: '#f3f4f6', color: '#374151',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
    },
    input: {
      width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
      borderRadius: '6px', fontSize: '14px', outline: 'none',
      marginBottom: '10px', boxSizing: 'border-box',
    },
    criteriaList: {
      padding: '16px 20px', background: 'white',
    },
    criterionItem: {
      padding: '10px 14px', background: '#f9fafb',
      borderRadius: '6px', marginBottom: '8px', fontSize: '14px', color: '#374151',
    },
  };

  const overallScore = selectedEvaluation ? getOverallScore(selectedEvaluation) : 0;
  const govLabel = getGovernanceLabel(overallScore);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>👑</div>
          <span style={styles.logoText}>Governance Platform - Admin</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.adminBadge}>Administrator</span>
          <div style={styles.userInfo}>
            <span>👤</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.fullName || 'Admin'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >Logout</button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <p style={styles.sidebarLabel}>Main Menu</p>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>📊</span><span>Dashboard</span></div>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/users')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>👥</span><span>User Management</span></div>
          <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <span>🏛️</span><span>Governance</span>
          </div>
          <div style={styles.menuItem}
            onClick={() => navigate('/admin/settings')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          ><span>⚙️</span><span>Settings</span></div>
        </aside>

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>Governance</h1>
          <p style={styles.pageSubtitle}>View scores and manage the governance framework</p>

          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(activeTab === 'scores' ? styles.tabActive : {}) }}
              onClick={() => setActiveTab('scores')}
            >📈 Scores Overview</button>
            <button
              style={{ ...styles.tab, ...(activeTab === 'framework' ? styles.tabActive : {}) }}
              onClick={() => setActiveTab('framework')}
            >🏛️ Manage Framework</button>
          </div>

          {activeTab === 'scores' && (
            <div>
              <div style={styles.card}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Select Evaluation:
                </label>
                <select style={styles.select}
                  value={selectedEvaluation?.id || ''}
                  onChange={(e) => {
                    const ev = evaluations.find(ev => String(ev.id) === e.target.value);
                    setSelectedEvaluation(ev || null);
                  }}
                >
                  {evaluations.length === 0 && <option>No evaluations found</option>}
                  {evaluations.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name} - {ev.period}</option>
                  ))}
                </select>

                {selectedEvaluation && (
                  <>
                    <div style={styles.scoreHeader}>
                      <div>
                        <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{overallScore}%</div>
                        <div style={{ opacity: 0.9, marginTop: '4px' }}>Overall Governance Score</div>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                          {selectedEvaluation.name} · {selectedEvaluation.period}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px' }}>{govLabel.emoji}</div>
                        <div style={{ fontSize: '18px', fontWeight: '600', marginTop: '4px' }}>{govLabel.label}</div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', marginTop: '24px' }}>
                      Score by Principle
                    </h3>

                    {principles.map((principle) => {
                      const { score, completed, total } = getPrincipleScore(principle, selectedEvaluation);
                      const color = getScoreColor(score);
                      return (
                        <div key={principle.id} style={styles.principleRow}>
                          <div style={styles.principleNum}>{principle.id}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                {principle.name}
                              </span>
                              <span style={{ fontSize: '14px', fontWeight: '600', color }}>
                                {score}% ({completed}/{total})
                              </span>
                            </div>
                            <div style={styles.progressBar}>
                              <div style={{ ...styles.progressFill, width: `${score}%`, background: color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {!selectedEvaluation && (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p style={{ fontSize: '40px', marginBottom: '12px' }}>📊</p>
                    <p style={{ fontWeight: '600' }}>No evaluations available</p>
                    <p style={{ fontSize: '14px' }}>Evaluations will appear here once submitted</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'framework' && (
            <div>
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                    12 Governance Principles
                  </h3>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    Click a principle to view criteria
                  </span>
                </div>

                {principles.map((principle) => (
                  <div key={principle.id} style={styles.principleCard}>
                    <div
                      style={styles.principleHeader}
                      onClick={() => setExpandedPrinciple(
                        expandedPrinciple === principle.id ? null : principle.id
                      )}
                    >
                      <div style={styles.principleTitle}>
                        <div style={{
                          ...styles.principleNum,
                          width: '30px', height: '30px', fontSize: '13px',
                        }}>{principle.id}</div>
                        {editingPrinciple === principle.id ? (
                          <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                            <input
                              style={styles.input}
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              placeholder="Principle name"
                            />
                            <input
                              style={{ ...styles.input, marginBottom: 0 }}
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              placeholder="Principle description"
                            />
                          </div>
                        ) : (
                          <div>
                            <div>{principle.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400', marginTop: '2px' }}>
                              {principle.description}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        {editingPrinciple === principle.id ? (
                          <>
                            <button style={styles.saveBtn}
                              onClick={() => handleSavePrinciple(principle.id)}
                            >Save</button>
                            <button style={styles.cancelBtn}
                              onClick={() => setEditingPrinciple(null)}
                            >Cancel</button>
                          </>
                        ) : (
                          <button style={styles.editBtn}
                            onClick={() => handleEditPrinciple(principle)}
                          >✏️ Edit</button>
                        )}
                        <span>{expandedPrinciple === principle.id ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedPrinciple === principle.id && (
                      <div style={styles.criteriaList}>
                        {principle.practices.map((practice) => (
                          <div key={practice.id} style={{ marginBottom: '16px' }}>
                            <div style={{
                              fontSize: '14px', fontWeight: '600', color: '#374151',
                              marginBottom: '8px', padding: '8px 12px',
                              background: '#f3f4f6', borderRadius: '6px',
                            }}>
                              Practice {practice.id}: {practice.name}
                            </div>
                            {practice.criteria.map((criterion) => (
                              <div key={criterion.id} style={styles.criterionItem}>
                                <span style={{ color: '#7c3aed', fontWeight: '500', marginRight: '8px' }}>
                                  C{criterion.id}
                                </span>
                                {criterion.text}
                                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontStyle: 'italic' }}>
                                  📎 {criterion.evidence}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GovernancePage;