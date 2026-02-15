import React, { useState, useEffect, useRef } from 'react';
import { GOVERNANCE_PRINCIPLES } from '../../../utils/constants';
import MessageBubble from './MessageBubble';
import SuggestionCard from './SuggestionCard';

const SUGGESTIONS = [
  { icon: '📊', text: 'Analyze my governance scores and give me recommendations' },
  { icon: '🎯', text: 'What are my top 3 weakest areas to improve?' },
  { icon: '🏆', text: 'What label can I achieve and what do I need to get there?' },
  { icon: '⚡', text: 'Give me one quick win I can implement immediately' },
];

const ChatWidget = ({ evaluation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your Governance AI Assistant 🤖\n\nI can analyze your evaluation results and provide specific recommendations to improve your governance score.\n\nSelect a suggestion below or ask me anything about your results!",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const buildSystemPrompt = () => {
    if (!evaluation?.responses) {
      return 'You are a governance expert assistant. The user has not submitted an evaluation yet. Encourage them to complete and submit an evaluation to get personalized recommendations.';
    }

    const responses = evaluation.responses;
    const principleScores = [];

    GOVERNANCE_PRINCIPLES.forEach((principle) => {
      let total = 0;
      let scoreSum = 0;
      const weakCriteria = [];
      const strongCriteria = [];

      principle.practices.forEach((practice) => {
        practice.criteria.forEach((criterion) => {
          total++;
          const key = `${principle.id}-${practice.id}-${criterion.id}`;
          const response = responses[key];
          const level = response?.maturityLevel ?? 0;
          scoreSum += level;
          if (level <= 1) {
            weakCriteria.push(`"${criterion.text}" (Level ${level}/3)`);
          } else if (level === 3) {
            strongCriteria.push(`"${criterion.text}"`);
          }
        });
      });

      const score = total > 0 ? Math.round((scoreSum / (total * 3)) * 100) : 0;
      principleScores.push({
        id: principle.id,
        name: principle.name,
        score,
        weakCriteria,
        strongCriteria,
        total,
      });
    });

    const allResponses = Object.values(responses);
    const overallScore =
      allResponses.length > 0
        ? Math.round(
            (allResponses.reduce((s, r) => s + (r.maturityLevel || 0), 0) /
              (allResponses.length * 3)) *
              100
          )
        : 0;

    const label =
      overallScore >= 90
        ? 'Platinum'
        : overallScore >= 80
        ? 'Gold'
        : overallScore >= 65
        ? 'Silver'
        : overallScore >= 50
        ? 'Bronze'
        : 'Not Certified';

    const nextLabel =
      overallScore < 50
        ? 'Bronze (50%)'
        : overallScore < 65
        ? 'Silver (65%)'
        : overallScore < 80
        ? 'Gold (80%)'
        : overallScore < 90
        ? 'Platinum (90%)'
        : 'Already at Platinum!';

    const weakPrinciples = [...principleScores]
      .sort((a, b) => a.score - b.score)
      .slice(0, 4);

    return `You are an expert governance consultant AI assistant for the Governance Evaluation Platform.

EVALUATION CONTEXT:
- Organization: ${evaluation.name}
- Period: ${evaluation.period}
- Overall Score: ${overallScore}%
- Current Governance Label: ${label}
- Next Target Label: ${nextLabel}
- Points needed to next label: ${
      overallScore >= 90
        ? 0
        : overallScore < 50
        ? 50 - overallScore
        : overallScore < 65
        ? 65 - overallScore
        : overallScore < 80
        ? 80 - overallScore
        : 90 - overallScore
    }%

ALL 12 PRINCIPLE SCORES:
${principleScores.map((p) => `${p.id}. ${p.name}: ${p.score}%`).join('\n')}

WEAKEST PRINCIPLES (Priority Focus):
${weakPrinciples
  .map(
    (p) => `
- ${p.name} (${p.score}%):
  Weak criteria: ${p.weakCriteria.slice(0, 3).join(', ') || 'None'}`
  )
  .join('\n')}

INSTRUCTIONS:
- Be specific, practical, and encouraging
- Reference actual principle names and scores from the data above
- Give concrete action steps, not vague advice
- When recommending improvements, mention what level to aim for (0→1, 1→2, 2→3)
- Keep responses concise but actionable (max 300 words)
- Use emojis to make responses readable
- Always end with an encouraging note
- You can answer follow-up questions about specific principles`;
  };

  const sendMessage = async (text) => {
    const userMessage = text || inputText.trim();
    if (!userMessage || loading) return;

    setInputText('');
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const conversationHistory = [
      ...messages.slice(1).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: conversationHistory,
        }),
      });

      const data = await response.json();

      if (data.content && data.content.length > 0) {
        const aiResponse = data.content
          .map((c) => c.text || '')
          .filter(Boolean)
          .join('');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: aiResponse },
        ]);
      } else {
        throw new Error('No response content');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '❌ Sorry, I could not connect to the AI service. Please check your internet connection and try again.',
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hello! I'm your Governance AI Assistant 🤖\n\nI can analyze your evaluation results and provide specific recommendations to improve your governance score.\n\nSelect a suggestion below or ask me anything about your results!",
      },
    ]);
    setShowSuggestions(true);
    setInputText('');
  };

  const styles = {
    floatingBtn: {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '26px',
      boxShadow: '0 8px 25px rgba(118,75,162,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      transition: 'transform 0.2s',
    },
    notifDot: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '12px',
      height: '12px',
      background: '#ef4444',
      borderRadius: '50%',
      border: '2px solid white',
    },
    chatWindow: {
      position: 'fixed',
      bottom: '104px',
      right: '32px',
      width: '400px',
      height: isMinimized ? 'auto' : '560px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      transition: 'height 0.3s ease',
    },
    chatHeader: {
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
    headerAvatar: {
      width: '36px',
      height: '36px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
    },
    headerTitle: { fontSize: '15px', fontWeight: '600' },
    headerSubtitle: { fontSize: '11px', opacity: 0.85, marginTop: '1px' },
    headerBtns: { display: 'flex', gap: '6px' },
    headerBtn: {
      width: '28px',
      height: '28px',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusBar: {
      padding: '8px 16px',
      background: evaluation ? '#f0fdf4' : '#fff7ed',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '12px',
      color: evaluation ? '#065f46' : '#92400e',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flexShrink: 0,
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
    },
    suggestionsSection: {
      padding: '0 16px 16px',
      flexShrink: 0,
    },
    suggestionsTitle: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '500',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    suggestionsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    loadingDots: {
      display: 'flex',
      gap: '4px',
      padding: '12px 16px',
      background: '#f3f4f6',
      borderRadius: '18px 18px 18px 4px',
      width: 'fit-content',
      alignItems: 'center',
    },
    dot: {
      width: '8px',
      height: '8px',
      background: '#9ca3af',
      borderRadius: '50%',
    },
    inputArea: {
      padding: '12px 16px',
      borderTop: '1px solid #f3f4f6',
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-end',
      flexShrink: 0,
      background: 'white',
    },
    textarea: {
      flex: 1,
      padding: '10px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '14px',
      outline: 'none',
      resize: 'none',
      fontFamily: 'inherit',
      lineHeight: '1.5',
      maxHeight: '80px',
      overflowY: 'auto',
    },
    sendBtn: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      opacity: loading || !inputText.trim() ? 0.5 : 1,
    },
    resetBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#9ca3af',
      padding: '4px 8px',
      borderRadius: '6px',
      flexShrink: 0,
    },
  };

  return (
    <>
      <button
        style={styles.floatingBtn}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="AI Governance Assistant"
      >
        {isOpen ? '✕' : '🤖'}
        {!isOpen && <div style={styles.notifDot} />}
      </button>

      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <div style={styles.headerLeft}>
              <div style={styles.headerAvatar}>🤖</div>
              <div>
                <div style={styles.headerTitle}>AI Governance Assistant</div>
                <div style={styles.headerSubtitle}>Powered by Claude AI</div>
              </div>
            </div>
            <div style={styles.headerBtns}>
              <button
                style={styles.headerBtn}
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              <button
                style={styles.headerBtn}
                onClick={handleReset}
                title="Reset conversation"
              >
                🔄
              </button>
              <button
                style={styles.headerBtn}
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div style={styles.statusBar}>
                {evaluation ? (
                  <>
                    ✅ Analyzing: <strong>{evaluation.name}</strong> — Score:{' '}
                    <strong>
                      {evaluation.responses
                        ? Math.round(
                            (Object.values(evaluation.responses).reduce(
                              (s, r) => s + (r.maturityLevel || 0),
                              0
                            ) /
                              (Object.values(evaluation.responses).length *
                                3)) *
                              100
                          )
                        : 0}
                      %
                    </strong>
                  </>
                ) : (
                  <>⚠️ No evaluation selected — select one on the Results page</>
                )}
              </div>

              <div style={styles.messagesArea}>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}

                {loading && (
                  <div style={{ display: 'flex', marginBottom: '12px' }}>
                    <div
                      style={{
                        ...styles.loadingDots,
                        marginLeft: '40px',
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            ...styles.dot,
                            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {showSuggestions && (
                <div style={styles.suggestionsSection}>
                  <div style={styles.suggestionsTitle}>
                    💡 Quick suggestions
                  </div>
                  <div style={styles.suggestionsGrid}>
                    {SUGGESTIONS.map((s, i) => (
                      <SuggestionCard
                        key={i}
                        suggestion={s}
                        onAsk={sendMessage}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.inputArea}>
                <textarea
                  ref={inputRef}
                  style={styles.textarea}
                  placeholder="Ask about your governance results..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
                />
                <button
                  style={styles.resetBtn}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  title="Toggle suggestions"
                >
                  💡
                </button>
                <button
                  style={styles.sendBtn}
                  onClick={() => sendMessage()}
                  disabled={loading || !inputText.trim()}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;