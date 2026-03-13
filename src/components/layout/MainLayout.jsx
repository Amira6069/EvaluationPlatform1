import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";  // ✅ FIXED: Added /Sidebar
import Header from "./Header/Header";      // ✅ FIXED: Added /Header

const MainLayout = () => {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f9fafb", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      {/* Fixed Header at Top */}
      <Header />
      
      {/* Sidebar + Content Area */}
      <div style={{ display: "flex", flex: 1, paddingTop: "64px" }}>
        {/* Fixed Sidebar on Left */}
        <Sidebar />
        
        {/* Main Content - Pages render here */}
        <main style={{ 
          flex: 1, 
          marginLeft: "220px",  // Match your sidebar width
          padding: "32px",
          overflowY: "auto" 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;