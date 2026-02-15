import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    window.location.href = '/login';
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Governance Platform
            </span>
          </Link>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <User size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.fullName || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;