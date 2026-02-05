export interface ChatMessage {
  id?: number;
  chatRoomId: number;
  senderId?: number;
  content: string;
  timestamp?: string;
  isRead?: boolean;
}

export interface ChatRoom {
  id: number;
  recruiterId: number;
  recruiterName: string;
  candidateId: number;
  candidateName: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
}

export interface User {
  id: number;
  email: string;
  role: 'CANDIDATE' | 'RECRUITER';
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string;
  experience?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  location: string;
  salaryRange?: string;
  jobType: string;
  experienceLevel: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'REJECTED';

export interface Application {
  id: number;
  userId: number;
  userEmail: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface StatusHistory {
  id: number;
  oldStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  updatedByEmail: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CandidateProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  skills: string;
  experience: string;
  resumeUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  role: 'CANDIDATE' | 'RECRUITER';
  firstName: string;
  lastName: string;
}

export interface JobRequest {
  title: string;
  description: string;
  companyName: string;
  location: string;
  salaryRange?: string;
  jobType: string;
  experienceLevel: string;
}
