import {
  ApiErrorResponse,
  Application,
  ApplicationEvent,
  AuthResponse,
  CreateApplicationRequest,
  CreateInterviewRequest,
  CreateReminderRequest,
  Interview,
  ListApplicationsQuery,
  ListResponse,
  LoginRequest,
  PaginatedResponse,
  RegisterRequest,
  Reminder,
  Statistics,
  UpdateApplicationRequest,
  UpdateInterviewRequest,
  UpdateReminderRequest,
  User,
} from '@/types/api';

const TOKEN_STORAGE_KEY = 'job_tracker_token';
const SERVER_URL_STORAGE_KEY = 'job_tracker_server_url';
const DEFAULT_URL = process.env.NEXT_PUBLIC_DEFAULT_API_URL || 'https://job-tracker-server-9drb.onrender.com';

export class ApiError extends Error {
  code: string;
  details?: Record<string, string> | null;
  status: number;

  constructor(message: string, code = 'API_ERROR', status = 500, details?: Record<string, string> | null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  set: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  remove: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export const serverStorage = {
  get: (): string => {
    if (typeof window === 'undefined') return DEFAULT_URL;
    return localStorage.getItem(SERVER_URL_STORAGE_KEY) || DEFAULT_URL;
  },
  set: (url: string) => {
    if (typeof window === 'undefined') return;
    // Clean trailing slash
    const cleanUrl = url.replace(/\/+$/, '');
    localStorage.setItem(SERVER_URL_STORAGE_KEY, cleanUrl);
  },
  reset: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SERVER_URL_STORAGE_KEY);
  },
};

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  customBackendUrl?: string;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const backendUrl = options.customBackendUrl || serverStorage.get();
  const token = tokenStorage.get();

  // Strip leading slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Use Next.js local proxy when running in browser to prevent CORS issues with the Go server
  const isBrowser = typeof window !== 'undefined';
  const url = isBrowser
    ? new URL(`/api/proxy/${cleanEndpoint}`, window.location.origin)
    : new URL(`${backendUrl}/${cleanEndpoint}`);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (isBrowser) {
    headers['x-backend-url'] = backendUrl;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Auth-Token'] = token;
  }

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null as unknown as T;
    }

    const contentType = response.headers.get('content-type');
    let data: any = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const errRes = data as ApiErrorResponse;
      const code = errRes?.error?.code || `HTTP_${response.status}`;
      const message = errRes?.error?.message || data?.message || response.statusText || 'An unexpected error occurred';
      const details = errRes?.error?.details || null;
      throw new ApiError(message, code, response.status, details);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Network connection failed';
    throw new ApiError(message, 'NETWORK_ERROR', 0);
  }
}

export const api = {
  // Health & Server Verification
  checkHealth: async (customUrl?: string): Promise<boolean> => {
    try {
      await request<{ status: string }>('/health', {
        method: 'GET',
        customBackendUrl: customUrl,
      });
      return true;
    } catch {
      return false;
    }
  },

  checkReady: async (customUrl?: string): Promise<boolean> => {
    try {
      await request<{ status: string }>('/ready', {
        method: 'GET',
        customBackendUrl: customUrl,
      });
      return true;
    } catch {
      return false;
    }
  },

  // Auth & Profile
  register: (payload: RegisterRequest): Promise<AuthResponse> =>
    request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginRequest): Promise<AuthResponse> =>
    request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: async (): Promise<void> => {
    try {
      await request<void>('/api/v1/auth/logout', {
        method: 'POST',
      });
    } finally {
      tokenStorage.remove();
    }
  },

  getMe: (): Promise<User> =>
    request<User>('/api/v1/me', {
      method: 'GET',
    }),

  // Applications
  createApplication: (payload: CreateApplicationRequest): Promise<Application> =>
    request<Application>('/api/v1/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listApplications: (query?: ListApplicationsQuery): Promise<PaginatedResponse<Application>> =>
    request<PaginatedResponse<Application>>('/api/v1/applications', {
      method: 'GET',
      params: query as Record<string, string | number | boolean | undefined | null>,
    }),

  getApplication: (id: string): Promise<Application> =>
    request<Application>(`/api/v1/applications/${id}`, {
      method: 'GET',
    }),

  updateApplication: (id: string, payload: UpdateApplicationRequest): Promise<Application> =>
    request<Application>(`/api/v1/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteApplication: (id: string): Promise<void> =>
    request<void>(`/api/v1/applications/${id}`, {
      method: 'DELETE',
    }),

  getApplicationEvents: (id: string): Promise<ListResponse<ApplicationEvent>> =>
    request<ListResponse<ApplicationEvent>>(`/api/v1/applications/${id}/events`, {
      method: 'GET',
    }),

  // Interviews
  createInterview: (applicationId: string, payload: CreateInterviewRequest): Promise<Interview> =>
    request<Interview>(`/api/v1/applications/${applicationId}/interviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listInterviewsByApplication: (applicationId: string): Promise<ListResponse<Interview>> =>
    request<ListResponse<Interview>>(`/api/v1/applications/${applicationId}/interviews`, {
      method: 'GET',
    }),

  getInterview: (id: string): Promise<Interview> =>
    request<Interview>(`/api/v1/interviews/${id}`, {
      method: 'GET',
    }),

  updateInterview: (id: string, payload: UpdateInterviewRequest): Promise<Interview> =>
    request<Interview>(`/api/v1/interviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteInterview: (id: string): Promise<void> =>
    request<void>(`/api/v1/interviews/${id}`, {
      method: 'DELETE',
    }),

  // Reminders
  createReminder: (payload: CreateReminderRequest): Promise<Reminder> =>
    request<Reminder>('/api/v1/reminders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listReminders: (): Promise<ListResponse<Reminder>> =>
    request<ListResponse<Reminder>>('/api/v1/reminders', {
      method: 'GET',
    }),

  updateReminder: (id: string, payload: UpdateReminderRequest): Promise<Reminder> =>
    request<Reminder>(`/api/v1/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteReminder: (id: string): Promise<void> =>
    request<void>(`/api/v1/reminders/${id}`, {
      method: 'DELETE',
    }),

  // Statistics
  getStatistics: (): Promise<Statistics> =>
    request<Statistics>('/api/v1/statistics', {
      method: 'GET',
    }),
};
