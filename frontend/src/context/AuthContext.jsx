import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe, logoutUser } from '../api/auth';
import { getAccessToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.warn('Failed to hydrate authenticated session:', err);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    const handleForceLogout = () => {
      setUser(null);
      setProfile(null);
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [initAuth]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    await initAuth();
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setUser(data.user);
    await initAuth();
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setProfile(null);
  };

  const refreshUser = async () => {
    await initAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
