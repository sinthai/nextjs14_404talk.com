type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface BFFRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class BFFClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}/api${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    options: BFFRequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, options?: BFFRequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'GET', options);
  }

  async post<T>(endpoint: string, body?: any, options?: BFFRequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'POST', {
      ...options,
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any, options?: BFFRequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'PUT', {
      ...options,
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any, options?: BFFRequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', {
      ...options,
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: BFFRequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

export const bffClient = new BFFClient(process.env.NEXT_PUBLIC_API_URL);

export { BFFClient };
export type { BFFRequestOptions };
