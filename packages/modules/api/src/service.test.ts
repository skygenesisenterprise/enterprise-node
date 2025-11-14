import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnterpriseApiService } from './service';
import type { User, Project } from './types';

// Mock the ApiClient
vi.mock('./client', () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe('EnterpriseApiService', () => {
  let service: EnterpriseApiService;
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EnterpriseApiService('test-api-key', {
      baseUrl: 'https://api.test.com/v1',
    });

    // Get the mocked client instance
    mockClient = (service as any).client;
  });

  it('should create service with API key', () => {
    expect(service).toBeDefined();
  });

  it('should get users', async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user'],
        active: true,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];

    mockClient.get.mockResolvedValue({
      success: true,
      data: mockUsers,
    });

    const result = await service.getUsers({ page: 1, limit: 10 });

    expect(mockClient.get).toHaveBeenCalledWith('/users', { page: 1, limit: 10 });
    expect(result.data).toEqual(mockUsers);
  });

  it('should get a single user', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['user'],
      active: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    mockClient.get.mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const result = await service.getUser('1');

    expect(mockClient.get).toHaveBeenCalledWith('/users/1');
    expect(result.data).toEqual(mockUser);
  });

  it('should create a user', async () => {
    const userData = {
      email: 'new@example.com',
      name: 'New User',
      password: 'password123',
      roles: ['user'],
    };

    const mockUser: User = {
      id: '2',
      ...userData,
      active: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    mockClient.post.mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const result = await service.createUser(userData);

    expect(mockClient.post).toHaveBeenCalledWith('/users', userData);
    expect(result.data).toEqual(mockUser);
  });

  it('should get projects', async () => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        ownerId: '1',
        members: ['1'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];

    mockClient.get.mockResolvedValue({
      success: true,
      data: mockProjects,
    });

    const result = await service.getProjects({ status: 'active' });

    expect(mockClient.get).toHaveBeenCalledWith('/projects', { status: 'active' });
    expect(result.data).toEqual(mockProjects);
  });

  it('should perform health check', async () => {
    const healthData = { status: 'healthy', timestamp: '2023-01-01T00:00:00Z' };

    mockClient.get.mockResolvedValue({
      success: true,
      data: healthData,
    });

    const result = await service.healthCheck();

    expect(mockClient.get).toHaveBeenCalledWith('/health');
    expect(result.data).toEqual(healthData);
  });

  it('should provide access to underlying client', () => {
    expect(service.apiClient).toBeDefined();
  });
});
