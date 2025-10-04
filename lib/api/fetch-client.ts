import { TokenManager } from "@/lib/auth/token-manager";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  requiresApiKey?: boolean;
}

export async function fetchClient<T>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  if (options?.requiresApiKey) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiKeyHeader = process.env.NEXT_PUBLIC_API_KEY_HEADER || "X-API-Key";
    if (apiKey) {
      headers[apiKeyHeader] = apiKey;
    }
  }

  if (options?.requiresAuth) {
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function fetchFromBFF<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${baseURL}/api${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}
