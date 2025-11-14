import type { User, Project, ApiKey, AuditLog, PaginationParams } from './types';
import { ApiClient } from './client';

export class EnterpriseApiService {
  private client: ApiClient;

  constructor(apiKey?: string, config?: { baseUrl?: string; timeout?: number }) {
    this.client = new ApiClient({
      apiKey,
      baseUrl: config?.baseUrl,
      timeout: config?.timeout,
    });
  }

  // Users endpoints
  async getUsers(
    params?: PaginationParams & {
      search?: string;
      role?: string;
      active?: boolean;
    }
  ) {
    return this.client.get<User[]>('/users', params);
  }

  async getUser(id: string) {
    return this.client.get<User>(`/users/${id}`);
  }

  async createUser(userData: { email: string; name: string; password: string; roles?: string[] }) {
    return this.client.post<User>('/users', userData);
  }

  async updateUser(
    id: string,
    userData: Partial<{
      name: string;
      roles: string[];
      active: boolean;
    }>
  ) {
    return this.client.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string) {
    return this.client.delete(`/users/${id}`);
  }

  // Projects endpoints
  async getProjects(
    params?: PaginationParams & {
      search?: string;
      status?: 'active' | 'inactive' | 'archived';
      ownerId?: string;
    }
  ) {
    return this.client.get<Project[]>('/projects', params);
  }

  async getProject(id: string) {
    return this.client.get<Project>(`/projects/${id}`);
  }

  async createProject(projectData: {
    name: string;
    description?: string;
    settings?: Record<string, any>;
  }) {
    return this.client.post<Project>('/projects', projectData);
  }

  async updateProject(
    id: string,
    projectData: Partial<{
      name: string;
      description: string;
      status: 'active' | 'inactive' | 'archived';
      settings: Record<string, any>;
    }>
  ) {
    return this.client.put<Project>(`/projects/${id}`, projectData);
  }

  async deleteProject(id: string) {
    return this.client.delete(`/projects/${id}`);
  }

  async addProjectMember(projectId: string, userId: string) {
    return this.client.post(`/projects/${projectId}/members`, { userId });
  }

  async removeProjectMember(projectId: string, userId: string) {
    return this.client.delete(`/projects/${projectId}/members/${userId}`);
  }

  // API Keys endpoints
  async getApiKeys(
    params?: PaginationParams & {
      search?: string;
      active?: boolean;
    }
  ) {
    return this.client.get<ApiKey[]>('/api-keys', params);
  }

  async getApiKey(id: string) {
    return this.client.get<ApiKey>(`/api-keys/${id}`);
  }

  async createApiKey(keyData: { name: string; permissions: string[]; expiresAt?: string }) {
    return this.client.post<ApiKey>('/api-keys', keyData);
  }

  async updateApiKey(
    id: string,
    keyData: Partial<{
      name: string;
      permissions: string[];
      expiresAt?: string;
      active: boolean;
    }>
  ) {
    return this.client.put<ApiKey>(`/api-keys/${id}`, keyData);
  }

  async deleteApiKey(id: string) {
    return this.client.delete(`/api-keys/${id}`);
  }

  // Audit Logs endpoints
  async getAuditLogs(
    params?: PaginationParams & {
      userId?: string;
      action?: string;
      resource?: string;
      resourceId?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    return this.client.get<AuditLog[]>('/audit-logs', params);
  }

  async getAuditLog(id: string) {
    return this.client.get<AuditLog>(`/audit-logs/${id}`);
  }

  // Health check
  async healthCheck() {
    return this.client.get<{ status: string; timestamp: string }>('/health');
  }

  // Get API info
  async getApiInfo() {
    return this.client.get<{
      version: string;
      endpoints: string[];
      documentation: string;
    }>('/info');
  }

  // Direct access to client for custom endpoints
  get apiClient() {
    return this.client;
  }
}
