import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

const AdminLayout = ({ children, title, subtitle, actions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Governance Framework', icon: '🎯', path: '/admin/governance-framework' },
    { label: 'Assign Evaluations', icon: '📝', path: '/admin/assign-evaluations' },
    { label: 'Reports', icon: '📈', path: '/admin/reports' },
    { label: 'Audit History', icon: '🔍', path: '/admin/audit' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl text-white">
              🛡️
            </div>
            <span className="text-xl font-bold text-gray-900">Governance Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              <span>👤</span>
              <span>{user.fullName || user.email || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 py-6 sticky top-16 h-[calc(100vh-64px)] hidden md:block">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
