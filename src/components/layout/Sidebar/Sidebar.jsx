import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ROUTES, STORAGE_KEYS } from "../../../utils/constants";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const getMenuItems = () => {
    if (!user) return [];

    if (user.role === "ORGANIZATION") {
      return [
        { path: ROUTES.ORG_DASHBOARD, icon: "📊", label: t('nav.dashboard') },
        { path: ROUTES.ORG_EVALUATIONS, icon: "📋", label: t('nav.evaluations') },
        { path: ROUTES.ORG_RESULTS, icon: "📈", label: t('nav.results') },
        { path: ROUTES.ORG_SETTINGS, icon: "⚙️", label: t('nav.settings') },
      ];
    }

    if (user.role === "EVALUATOR") {
      return [
        { path: ROUTES.EVAL_DASHBOARD, icon: "📊", label: t('nav.dashboard') },
        { path: "/evaluator/queue", icon: "📋", label: t('nav.queue') },
      ];
    }

    if (user.role === "ADMIN") {
      return [
        { path: ROUTES.ADMIN_DASHBOARD, icon: "📊", label: t('nav.dashboard') },
        { path: ROUTES.ADMIN_USERS, icon: "👥", label: t('nav.users') },
        { path: ROUTES.ADMIN_EVALUATIONS, icon: "📋", label: t('nav.evaluations') },
        { path: ROUTES.ADMIN_GOVERNANCE, icon: "🏛️", label: t('nav.governance') },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const styles = {
    sidebar: {
      width: "220px",
      background: "white",
      borderRight: "1px solid #e5e7eb",
      position: "fixed",
      left: 0,
      top: "64px",
      height: "calc(100vh - 64px)",
      display: "flex",
      flexDirection: "column",
      zIndex: 40,
      overflowY: "auto",
    },
    nav: {
      flex: 1,
      padding: "24px 16px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      marginBottom: "8px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      color: "#6b7280",
      fontSize: "15px",
      fontWeight: "500",
      textDecoration: "none",
    },
    menuItemActive: {
      background: "#eff6ff",
      color: "#2563eb",
      fontWeight: "600",
    },
  };

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            style={{
              ...styles.menuItem,
              ...(isActive(item.path) ? styles.menuItemActive : {}),
            }}
            onClick={() => {
              console.log('🔗 Navigating to:', item.path);
              navigate(item.path);
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;