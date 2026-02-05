import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/auth.service';
import { type User, type LoginRequest, type RegisterRequest } from '../types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    await authService.login(data);
    await fetchUser();
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
    await fetchUser();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
