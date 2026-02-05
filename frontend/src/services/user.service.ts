import api from '../api/axios';
import { type User } from '../types';

export const userService = {
  async getMyProfile(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/updateProfile', data);
    return response.data;
  }
};
