import api from '../api/axios';
import { type User, type LoginRequest, type RegisterRequest } from '../types';

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post('/auth/login', data);
    if (response.data) {
      localStorage.setItem('token', response.data);
    }
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await api.post('/auth/register', data);
    if (response.data) {
      localStorage.setItem('token', response.data);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  }
};
