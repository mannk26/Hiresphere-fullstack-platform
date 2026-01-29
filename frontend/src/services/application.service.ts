import api from '../api/axios';
import type { Application, ApplicationStatus, StatusHistory } from '../types';

export const applicationService = {
  async applyToJob(jobId: number): Promise<Application> {
    const response = await api.post('/applications', { jobId });
    return response.data;
  },

  async getMyApplications(userId: number): Promise<Application[]> {
    const response = await api.get(`/applications/user/${userId}`);
    return response.data;
  },

  async getRecruiterApplications(): Promise<Application[]> {
    const response = await api.get('/applications/recruiter');
    return response.data;
  },

  async updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const response = await api.patch(`/applications/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  async getApplicationHistory(id: number): Promise<StatusHistory[]> {
    const response = await api.get(`/applications/${id}/history`);
    return response.data;
  }
};
