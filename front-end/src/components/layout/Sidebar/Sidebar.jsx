import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/organization/dashboard' 
    },
    { 
      label: 'Evaluations', 
      icon: FileText, 
      path: '/organization/evaluations' 
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      path: '/organization/settings' 
    },
  ];
  
  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;