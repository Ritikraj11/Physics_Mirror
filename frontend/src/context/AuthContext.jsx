import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('pm_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pm_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('pm_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            localStorage.setItem('pm_user', JSON.stringify(res.data.user));
            if (res.data.profile) {
              localStorage.setItem('pm_profile', JSON.stringify(res.data.profile));
            }
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.success) {
      const { token: newToken, user: newUser, profile: newProfile } = res.data;
      setToken(newToken);
      setUser(newUser);
      setProfile(newProfile);
      localStorage.setItem('pm_token', newToken);
      localStorage.setItem('pm_user', JSON.stringify(newUser));
      if (newProfile) {
        localStorage.setItem('pm_profile', JSON.stringify(newProfile));
      }
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('pm_token');
    localStorage.removeItem('pm_user');
    localStorage.removeItem('pm_profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, logout, setUser, setProfile }}>
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

