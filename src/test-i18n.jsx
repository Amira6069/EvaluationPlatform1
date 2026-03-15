import React from 'react';
import { useTranslation } from 'react-i18next';

const TestI18n = () => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h2>i18n Test</h2>
      <p>Language: {i18n.language}</p>
      <p>Is initialized: {i18n.isInitialized ? 'YES ✅' : 'NO ❌'}</p>
      <hr />
      <p>auth.signIn: {t('auth.signIn')}</p>
      <p>nav.dashboard: {t('nav.dashboard')}</p>
      <p>common.logout: {t('common.logout')}</p>
      <p>ev.level3: {t('ev.level3')}</p>
    </div>
  );
};

export default TestI18n;