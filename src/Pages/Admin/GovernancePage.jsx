import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GOVERNANCE_PRINCIPLES } from '../../utils/constants';

const GovernancePage = () => {
  const { t } = useTranslation();
  const [expandedPrinciple, setExpandedPrinciple] = useState(null);

  const togglePrinciple = (principleId) => {
    setExpandedPrinciple(expandedPrinciple === principleId ? null : principleId);
  };

  const styles = {
    container: { padding: '24px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: '#6b7280' },
    principleCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    principleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    principleTitle: { fontSize: '18px', fontWeight: '600', color: '#111827' },
    expandIcon: { fontSize: '20px', transition: 'transform 0.2s' },
    practiceSection: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
    },
    practiceCard: {
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '12px',
    },
    practiceTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px',
    },
    criterionItem: {
      padding: '10px',
      background: 'white',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏛️ {t('governance.governanceFramework')}</h1>
        <p style={styles.subtitle}>{t('governance.managePrinciples')}</p>
      </div>

      {GOVERNANCE_PRINCIPLES.map((principle) => {
        const isExpanded = expandedPrinciple === principle.id;
        return (
          <div
            key={principle.id}
            style={styles.principleCard}
            onClick={() => togglePrinciple(principle.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.principleHeader}>
              <div style={styles.principleTitle}>
                {principle.number}. {principle.name}
              </div>
              <div
                style={{
                  ...styles.expandIcon,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▼
              </div>
            </div>

            {isExpanded && (
              <div style={styles.practiceSection}>
                {principle.practices.map((practice) => (
                  <div key={practice.id} style={styles.practiceCard}>
                    <div style={styles.practiceTitle}>
                      Practice {practice.id}: {practice.name}
                    </div>
                    {practice.criteria.map((criterion) => (
                      <div key={criterion.id} style={styles.criterionItem}>
                        <strong>C{criterion.id}:</strong> {criterion.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GovernancePage;