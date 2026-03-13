import React from 'react';

const GovernanceLabel = () => {
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '16px',
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <span>🏛️</span>
        <span>Governance Framework</span>
      </h2>
      <p style={styles.subtitle}>
        Based on ISO 37000:2021 - Governance of Organizations
      </p>
    </div>
  );
};

export default GovernanceLabel;