import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div>
        <h1>Register Page</h1>
        <button onClick={() => navigate(ROUTES.LOGIN)}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;