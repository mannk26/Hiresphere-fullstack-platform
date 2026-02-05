import api from '../api/axios';
import { type ChatRoom, type ChatMessage } from '../types';

export const chatService = {
  initiateChat: async (candidateId: number): Promise<ChatRoom> => {
    const response = await api.post<ChatRoom>('/chat/initiate', { candidateId });
    return response.data;
  },

  getMyChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get<ChatRoom[]>('/chat/rooms');
    return response.data;
  },

  getChatHistory: async (roomId: number): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(`/chat/rooms/${roomId}/history`);
    return response.data;
  },

  markAsRead: async (roomId: number): Promise<void> => {
    await api.post(`/chat/rooms/${roomId}/read`);
  }
};
