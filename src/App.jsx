import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LoginPage from "./Pages/auth/LoginPage";
import RegisterPage from "./Pages/auth/RegisterPage";
import MainLayout from "./components/layout/MainLayout";

// Organization Pages
import OrganizationDashboardPage from "./Pages/Organization/DashboardPage";
import OrganizationEvaluationsPage from "./Pages/Organization/EvaluationsPage";
import NewEvaluationPage from "./Pages/Organization/NewEvaluationPage";
import OrganizationSettingsPage from "./Pages/Organization/SettingsPage";
import ResultsPage from "./Pages/Organization/ResultsPage";
import RecommendationsPage from "./Pages/Organization/RecommendationsPage";

// Evaluator Pages
import EvaluatorDashboardPage from "./Pages/Evaluator/DashboardPage";
import QueuePage from "./Pages/Evaluator/QueuePage";
import ReviewPage from "./Pages/Evaluator/ReviewPage";

// Admin Pages
import AdminDashboardPage from "./Pages/Admin/DashboardPage";
import UsersPage from "./Pages/Admin/UsersPage";
import EvaluationsPage from "./Pages/Admin/EvaluationsPage";
import GovernancePage from "./Pages/Admin/GovernancePage";

import { ROUTES } from "./utils/constants";

// Import i18n config
import './i18n/config';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading, isAuthenticated } = useAuth();

  console.log('🔐 ProtectedRoute Check:');
  console.log('  Loading:', loading);
  console.log('  IsAuthenticated:', isAuthenticated);
  console.log('  Token:', token ? 'EXISTS' : 'MISSING');
  console.log('  User:', user);
  console.log('  User Role:', user?.role);
  console.log('  Allowed Roles:', allowedRoles);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated - redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`❌ Role ${user.role} not authorized - redirecting`);
    
    if (user.role === "ORGANIZATION") return <Navigate to={ROUTES.ORG_DASHBOARD} replace />;
    if (user.role === "EVALUATOR") return <Navigate to={ROUTES.EVAL_DASHBOARD} replace />;
    if (user.role === "ADMIN") return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  console.log('✅ Access granted for role:', user.role);
  return children;
};

function AppContent() {
  const { i18n } = useTranslation();

  // Set document direction based on language
  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* ORGANIZATION ROUTES */}
        <Route
          path="/organization"
          element={
            <ProtectedRoute allowedRoles={["ORGANIZATION", "ADMIN"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OrganizationDashboardPage />} />
          <Route path="evaluations" element={<OrganizationEvaluationsPage />} />
          <Route path="evaluations/new" element={<NewEvaluationPage />} />
<Route path="evaluations/:id" element={<NewEvaluationPage />} />
          <Route path="settings" element={<OrganizationSettingsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="recommendations/:id" element={<RecommendationsPage />} /> 
        </Route>

        {/* EVALUATOR ROUTES */}
        <Route
          path="/evaluator"
          element={
            <ProtectedRoute allowedRoles={["EVALUATOR", "ADMIN"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EvaluatorDashboardPage />} />
          <Route path="queue" element={<QueuePage />} />
          <Route path="review/:id" element={<ReviewPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="governance" element={<GovernancePage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;