import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n/i18n'; // ✅ Import i18n configuration
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);