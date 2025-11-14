import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from './client';
import type { ApiResponse } from './types';

// Mock fetch
global.fetch = vi.fn();

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ApiClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com/v1',
    });
  });

  it('should create client with default config', () => {
    const defaultClient = new ApiClient();
    expect(defaultClient.getBaseUrl()).toBe('https://api.skygenesisenterprise.com/api/v1');
  });

  it('should create client with custom config', () => {
    expect(client.getBaseUrl()).toBe('https://api.test.com/v1');
  });

  it('should set API key correctly', () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { test: 'data' } }),
    } as Response);

    client.get('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test.com/v1/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
        }),
      })
    );
  });

  it('should handle GET request with params', async () => {
    const mockResponse: ApiResponse = {
      success: true,
      data: [{ id: '1', name: 'Test' }],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await client.get('/users', { page: 1, limit: 10 });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.com/v1/users?page=1&limit=10',
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle POST request', async () => {
    const mockResponse: ApiResponse = {
      success: true,
      data: { id: '1', name: 'New User' },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const userData = { name: 'New User', email: 'test@example.com' };
    const result = await client.post('/users', userData);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.com/v1/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(userData),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    const errorResponse = {
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => errorResponse,
    } as Response);

    await expect(client.get('/nonexistent')).rejects.toThrow('Resource not found');
  });

  it('should handle timeout', async () => {
    const timeoutClient = new ApiClient({ timeout: 100 });

    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          const error = new Error('AbortError') as any;
          error.name = 'AbortError';
          setTimeout(() => reject(error), 50);
        })
    );

    await expect(timeoutClient.get('/slow')).rejects.toThrow('Request timeout');
  }, 10000);

  it('should update API key', () => {
    client.setApiKey('new-api-key');

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    client.get('/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer new-api-key',
        }),
      })
    );
  });

  it('should manage custom headers', () => {
    client.setDefaultHeader('X-Custom-Header', 'custom-value');
    client.removeDefaultHeader('Content-Type');

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    client.get('/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Custom-Header': 'custom-value',
        }),
      })
    );
  });
});
