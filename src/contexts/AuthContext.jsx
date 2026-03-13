import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

// ✅ ADD THIS - Prevents double initialization
let globalAuthState = {
  token: null,
  user: null,
  initialized: false,
};

export const AuthProvider = ({ children }) => {
  const mountedRef = useRef(false);
  const [user, setUser] = useState(globalAuthState.user);
  const [token, setToken] = useState(globalAuthState.token);
  const [loading, setLoading] = useState(!globalAuthState.initialized);

  // Function to load auth from localStorage
  const loadAuth = () => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      console.log('🔍 Loading auth from localStorage...');
      console.log('  Token:', savedToken ? 'EXISTS' : 'MISSING');
      console.log('  User:', savedUser ? 'EXISTS' : 'MISSING');

      if (savedToken && savedUser) {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
        
        // Update global state
        globalAuthState.token = savedToken;
        globalAuthState.user = userData;
        globalAuthState.initialized = true;
        
        console.log('✅ Auth loaded successfully');
        return true;
      } else {
        console.log('⚠️ No auth found in localStorage');
        setToken(null);
        setUser(null);
        
        globalAuthState.token = null;
        globalAuthState.user = null;
        globalAuthState.initialized = true;
        
        return false;
      }
    } catch (error) {
      console.error('❌ Error loading auth:', error);
      return false;
    }
  };

  // Load auth on mount - only once
  useEffect(() => {
    if (mountedRef.current) {
      console.log('⚠️ AuthProvider already mounted, skipping initialization');
      return;
    }
    
    console.log('🚀 AuthProvider mounted');
    mountedRef.current = true;
    
    // Use global state if already initialized
    if (globalAuthState.initialized) {
      console.log('📦 Using cached auth state');
      setToken(globalAuthState.token);
      setUser(globalAuthState.user);
      setLoading(false);
    } else {
      loadAuth();
      setLoading(false);
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('📢 Storage changed:', e.key);
      
      if (e.key === STORAGE_KEYS.TOKEN || e.key === STORAGE_KEYS.USER || e.key === null) {
        console.log('🔄 Auth-related storage changed, reloading...');
        loadAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token, userData) => {
    console.log('🔐 AuthContext.login called');
    console.log('  Token:', token.substring(0, 20) + '...');
    console.log('  User:', userData);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    
    // Update state immediately
    setToken(token);
    setUser(userData);
    
    // Update global state
    globalAuthState.token = token;
    globalAuthState.user = userData;
    globalAuthState.initialized = true;
    
    console.log('✅ Auth state updated');
  };

  const logout = () => {
    console.log('👋 AuthContext.logout called');
    
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    setToken(null);
    setUser(null);
    
    globalAuthState.token = null;
    globalAuthState.user = null;
    globalAuthState.initialized = true;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  console.log('🔍 AuthContext current state:', {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated: !!token && !!user,
    loading,
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
