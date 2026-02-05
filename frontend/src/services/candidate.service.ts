import api from '../api/axios';
import { type CandidateProfile } from '../types';

export const candidateService = {
  async updateProfile(formData: FormData): Promise<CandidateProfile> {
    const response = await api.post('/candidates/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getProfile(userId: number): Promise<CandidateProfile> {
    const response = await api.get(`/candidates/profile/${userId}`);
    return response.data;
  },
  
  async getProfileByApplication(applicationId: number): Promise<CandidateProfile> {
    const response = await api.get(`/applications/${applicationId}/profile`);
    return response.data;
  },

  async viewResume(resumeUrl: string): Promise<void> {
    const response = await api.get(resumeUrl, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};
