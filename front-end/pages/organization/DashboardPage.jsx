import React from 'react';

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    window.location.href = '/login';
  };
  
  return (
    <div style={{ padding: '40px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.fullName}!</p>
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;