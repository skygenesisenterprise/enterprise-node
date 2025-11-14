export interface ApiConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    requestId: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError extends Error {
  code: string;
  status?: number;
  details?: any;
}

export interface EnterpriseResource {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends EnterpriseResource {
  email: string;
  name: string;
  roles: string[];
  active: boolean;
  lastLogin?: string;
}

export interface Project extends EnterpriseResource {
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  ownerId: string;
  members: string[];
  settings?: Record<string, any>;
}

export interface ApiKey extends EnterpriseResource {
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: string;
  lastUsed?: string;
  active: boolean;
}

export interface AuditLog extends EnterpriseResource {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}
