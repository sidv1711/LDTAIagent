import { useState, useEffect, useCallback, useRef } from 'react';

export type ServiceStatus = 'healthy' | 'degraded' | 'down';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
  name: string;
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  response?: {
    healthy?: (data: any) => boolean;
    degradable?: (data: any) => boolean;
  };
}

export interface ServiceState {
  endpoint: ApiEndpoint;
  status: ServiceStatus;
  lastChecked: Date;
  responseTime: number;
  errorMessage?: string;
}

export interface UseApiStatusOptions {
  endpoints: ApiEndpoint[];
  refreshInterval?: number;
  retries?: number;
  retryDelay?: number;
  autoRefresh?: boolean;
}

export interface UseApiStatus {
  services: ServiceState[];
  loading: boolean;
  lastRefreshed: Date | null;
  refresh: () => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
}

const DEFAULT_OPTIONS = {
  refreshInterval: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  autoRefresh: true,
};

export const useApiStatus = (options: UseApiStatusOptions): UseApiStatus => {
  const { endpoints, refreshInterval, retries, retryDelay, autoRefresh } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const [services, setServices] = useState<ServiceState[]>(() =>
    endpoints.map((endpoint) => ({
      endpoint,
      status: 'healthy',
      lastChecked: new Date(),
      responseTime: 0,
    }))
  );

  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(autoRefresh);
  const [currentRefreshInterval, setCurrentRefreshInterval] = useState(refreshInterval);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkEndpoint = useCallback(
    async (endpoint: ApiEndpoint, attempt = 1): Promise<ServiceState> => {
      const startTime = Date.now();
      const controller = new AbortController();
      
      try {
        const config: RequestInit = {
          method: endpoint.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...endpoint.headers,
          },
          signal: controller.signal,
        };

        if (endpoint.body && endpoint.method !== 'GET') {
          config.body = JSON.stringify(endpoint.body);
        }

        const response = await fetch(endpoint.url, config);
        const responseTime = Date.now() - startTime;
        const data = await response.json().catch(() => null);

        let status: ServiceStatus = 'healthy';
        
        if (!response.ok) {
          status = response.status >= 500 ? 'down' : 'degraded';
        } else {
          if (endpoint.response?.healthy) {
            const isHealthy = endpoint.response.healthy(data);
            status = isHealthy ? 'healthy' : endpoint.response?.degradable?.(data) ? 'degraded' : 'down';
          } else if (endpoint.response?.degradable) {
            const isDegradable = endpoint.response.degradable(data);
            status = isDegradable ? 'degraded' : 'healthy';
          }
        }

        return {
          endpoint,
          status,
          lastChecked: new Date(),
          responseTime,
        };
      } catch (error) {
        if (attempt < retries && (error as Error)?.name !== 'AbortError') {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return checkEndpoint(endpoint, attempt + 1);
        }

        return {
          endpoint,
          status: 'down',
          lastChecked: new Date(),
          responseTime: Date.now() - startTime,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    [retries, retryDelay]
  );

  const refresh = useCallback(async () => {
    if (loading) return;
    
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    
    try {
      const results = await Promise.all(
        endpoints.map((endpoint) => checkEndpoint(endpoint))
      );
      
      setServices(results);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Failed to refresh API status:', error);
    } finally {
      setLoading(false);
    }
  }, [endpoints, checkEndpoint, loading]);

  const setAutoRefresh = useCallback((enabled: boolean) => {
    setAutoRefreshEnabled(enabled);
  }, []);

  const setRefreshInterval = useCallback((interval: number) => {
    setCurrentRefreshInterval(interval);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoRefreshEnabled && currentRefreshInterval > 0) {
      intervalRef.current = setInterval(refresh, currentRefreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      abortControllerRef.current?.abort();
    };
  }, [autoRefreshEnabled, currentRefreshInterval, refresh]);

  return {
    services,
    loading,
    lastRefreshed,
    refresh,
    setAutoRefresh,
    setRefreshInterval,
  };
};