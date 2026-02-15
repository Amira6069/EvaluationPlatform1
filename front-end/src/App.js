import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';
import DashboardPage from './Pages/Organization/DashboardPage';
import { ROUTES } from './utils/constants';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('governance_token');
  return token ? children : <Navigate to={ROUTES.LOGIN} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route
          path={ROUTES.ORG_DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;