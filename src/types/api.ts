// Standard Application Status Enum & Type
export type ApplicationStatus =
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'TECHNICAL_INTERVIEW'
  | 'OFFER'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export const APPLICATION_STATUS_LIST: ApplicationStatus[] = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'TECHNICAL_INTERVIEW',
  'OFFER',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
];

// Standard Interview Type Enum & Type
export type InterviewType =
  | 'PHONE_SCREEN'
  | 'HR'
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'SYSTEM_DESIGN'
  | 'FINAL'
  | 'OTHER';

export const INTERVIEW_TYPE_LIST: InterviewType[] = [
  'PHONE_SCREEN',
  'HR',
  'TECHNICAL',
  'BEHAVIORAL',
  'SYSTEM_DESIGN',
  'FINAL',
  'OTHER',
];

// Models
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location?: string | null;
  job_url?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  status: ApplicationStatus;
  applied_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationEvent {
  id: string;
  application_id: string;
  old_status: string | null;
  new_status: string;
  note?: string | null;
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  type: InterviewType;
  scheduled_at: string;
  duration_minutes?: number | null;
  location?: string | null;
  meeting_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Optional client-side joined reference for global views
  application?: Application;
}

export interface Reminder {
  id: string;
  user_id: string;
  application_id?: string | null;
  title: string;
  description?: string | null;
  remind_at: string;
  completed: boolean;
  created_at: string;
  // Optional client-side joined reference
  application?: Application;
}

export interface Statistics {
  total_applications: number;
  by_status: Record<string, number>;
  response_rate: number;
  interview_rate: number;
  offer_rate: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ListResponse<T> {
  data: T[];
}

export interface ErrorDetails {
  [key: string]: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetails | null;
  };
}

// Request Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateApplicationRequest {
  company: string;
  position: string;
  location?: string;
  job_url?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  status?: ApplicationStatus;
  applied_at?: string;
  notes?: string;
}

export interface UpdateApplicationRequest {
  company?: string;
  position?: string;
  location?: string;
  job_url?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  status?: ApplicationStatus;
  notes?: string;
}

export interface ListApplicationsQuery {
  status?: string;
  company?: string;
  location?: string;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateInterviewRequest {
  type?: InterviewType;
  scheduled_at: string;
  duration_minutes?: number;
  location?: string;
  meeting_url?: string;
  notes?: string;
}

export interface UpdateInterviewRequest {
  type?: InterviewType;
  scheduled_at?: string;
  duration_minutes?: number;
  location?: string;
  meeting_url?: string;
  notes?: string;
}

export interface CreateReminderRequest {
  application_id?: string;
  title: string;
  description?: string;
  remind_at: string;
}

export interface UpdateReminderRequest {
  title?: string;
  description?: string;
  remind_at?: string;
  completed?: boolean;
}

