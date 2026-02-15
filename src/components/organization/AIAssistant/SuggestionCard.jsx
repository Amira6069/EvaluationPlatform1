import React, { useState } from 'react';

const SuggestionCard = ({ suggestion, onAsk }) => {
  const [hovered, setHovered] = useState(false);

  const styles = {
    card: {
      padding: '10px 14px',
      border: `1px solid ${hovered ? '#7c3aed' : '#e5e7eb'}`,
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '13px',
      color: hovered ? '#7c3aed' : '#374151',
      background: hovered ? '#f5f3ff' : 'white',
      transition: 'all 0.2s',
      textAlign: 'left',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    icon: { fontSize: '16px', flexShrink: 0 },
    text: { flex: 1, lineHeight: '1.4' },
    arrow: {
      fontSize: '14px',
      color: '#7c3aed',
      opacity: hovered ? 1 : 0,
      transition: 'opacity 0.2s',
    },
  };

  return (
    <button
      style={styles.card}
      onClick={() => onAsk(suggestion.text)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.icon}>{suggestion.icon}</span>
      <span style={styles.text}>{suggestion.text}</span>
      <span style={styles.arrow}>→</span>
    </button>
  );
};

export default SuggestionCard;