import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🚀 AuthProvider mounted');
    loadAuthFromStorage();
  }, []);

  const loadAuthFromStorage = () => {
    try {
      console.log('🔍 Loading auth from localStorage...');
      const storedToken = localStorage.getItem('governance_token');
      const storedUser = localStorage.getItem('governance_user');
      
      console.log('  Token:', storedToken ? 'EXISTS (' + storedToken.substring(0, 20) + '...)' : 'MISSING');
      console.log('  User:', storedUser ? 'EXISTS' : 'MISSING');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ Auth found in localStorage');
        console.log('  User:', parsedUser);
        
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        console.log('⚠️ No auth found in localStorage');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error loading auth:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, newUser) => {
    console.log('🔐 AuthContext.login called');
    console.log('  Token:', newToken?.substring(0, 20) + '...');
    console.log('  User:', newUser);

    // ✅ FORCE SAVE TO LOCALSTORAGE
    localStorage.setItem('governance_token', newToken);
    localStorage.setItem('governance_user', JSON.stringify(newUser));
    
    console.log('💾 Saved to localStorage');
    console.log('  Verify token:', localStorage.getItem('governance_token')?.substring(0, 20) + '...');
    console.log('  Verify user:', localStorage.getItem('governance_user'));

    // ✅ UPDATE STATE
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    
    console.log('✅ Auth state updated');
  };

  const logout = () => {
    console.log('👋 AuthContext.logout called');
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  console.log('🔍 AuthContext current state:', {
    user: user?.email,
    hasToken: !!token,
    isAuthenticated,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};