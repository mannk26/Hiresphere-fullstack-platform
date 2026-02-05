import api from '../api/axios';
import { type Job, type PageResponse, type JobRequest } from '../types';

export const jobService = {
  async getAllJobs(page = 0, size = 10, search = '', jobType = '', experienceLevel = ''): Promise<PageResponse<Job>> {
    const response = await api.get('/jobs', {
      params: { page, size, search, jobType, experienceLevel }
    });
    return response.data;
  },

  async getJobById(id: number): Promise<Job> {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(data: JobRequest): Promise<Job> {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  async getMyJobs(): Promise<Job[]> {
    const response = await api.get('/jobs/my-jobs');
    return response.data;
  }
};
