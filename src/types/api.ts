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
  role: 'user' | 'admin';
  disabled?: boolean;
  created_at: string;
  updated_at: string;
}

// Admin
export interface DayCount {
  day: string;
  count: number;
}

export interface ActivityItem {
  id: number;
  created_at: string;
  action: string;
  method: string;
  path: string;
  status: number;
  duration_ms: number;
  ip: string;
  user_agent: string;
  request_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
}

export interface AdminOverview {
  totals: {
    users: number;
    applications: number;
    interviews: number;
    reminders: number;
    reviews: number;
    average_rating: number;
  };
  users: {
    new_7d: number;
    new_30d: number;
    disabled: number;
    active_24h: number;
    active_7d: number;
  };
  last_24h: {
    events: number;
    logins: number;
    failed_logins: number;
    blocked: number;
    client_errors: number;
    server_errors: number;
  };
  signups_by_day: DayCount[];
  events_by_day: DayCount[];
  applications_by_status: Record<string, number>;
  recent_events: ActivityItem[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  disabled: boolean;
  applications: number;
  last_login_at: string | null;
  created_at: string;
}

export interface AdminReview {
  id: string;
  author: string;
  email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ActivityQuery {
  action?: string;
  user_id?: string;
  ip?: string;
  min_status?: number;
  page?: number;
  limit?: number;
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

export interface PublicReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  distribution: Record<string, number>;
}

export interface ReviewsResponse {
  summary: ReviewSummary;
  data: PublicReview[];
}

export interface MyReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface SaveReviewRequest {
  rating: number;
  comment?: string;
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

