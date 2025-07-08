// hooks/useNativeAuth.ts
import { useState, useEffect } from 'react';

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  identityToken?: string;
  authorizationCode?: string;
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const useNativeAuth = () => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬스토리지에서 기존 토큰 확인
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedUserInfo = localStorage.getItem('userInfo');

    if (savedAccessToken && savedRefreshToken) {
      setAuthTokens({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
        user: savedUserInfo ? JSON.parse(savedUserInfo) : undefined,
      });
      setIsLoading(false);
    }

    // 네이티브에서 토큰 받는 이벤트 리스너
    const handleAuthTokens = (event: CustomEvent) => {
      console.log('Auth tokens received from native:', event.detail);
      setAuthTokens(event.detail);
      setIsLoading(false);
    };

    window.addEventListener('authTokensReceived', handleAuthTokens as EventListener);

    // 네이티브에 토큰 요청
    const requestTokens = () => {
      if (window.postMessageToNative) {
        window.postMessageToNative({ type: 'REQUEST_AUTH_TOKENS' });
      }
    };

    // 페이지 로드 후 토큰 요청
    if (document.readyState === 'complete') {
      setTimeout(requestTokens, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(requestTokens, 100);
      });
    }

    // 주기적으로 토큰 요청 (네이티브에서 아직 안보냈을 경우)
    const interval = setInterval(() => {
      if (!authTokens?.accessToken) {
        requestTokens();
      }
    }, 1000);

    // 3초 후 로딩 상태 해제 (토큰이 없어도)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      window.removeEventListener('authTokensReceived', handleAuthTokens as EventListener);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [authTokens?.accessToken]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    setAuthTokens(null);

    // 네이티브에 로그아웃 알림
    if (window.postMessageToNative) {
      window.postMessageToNative({ type: 'LOGOUT' });
    }
  };

  return {
    authTokens,
    isLoading,
    isAuthenticated: !!authTokens?.accessToken,
    logout,
  };
};

// API 호출을 위한 fetch wrapper
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('No access token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 토큰 만료시 처리
  if (response.status === 401) {
    // 리프레시 토큰으로 갱신 시도
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch('/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const { accessToken: newAccessToken } = await refreshResponse.json();
          localStorage.setItem('accessToken', newAccessToken);

          // 원래 요청 재시도
          return fetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }

    // 리프레시 실패시 로그아웃
    localStorage.clear();
    window.location.reload();
  }

  return response;
};

// React Query와 함께 사용할 수 있는 커스텀 hook
import { useQuery } from '@tanstack/react-query';

export const useAuthenticatedQuery = <T>(queryKey: string[], url: string, options?: any) => {
  const { isAuthenticated } = useNativeAuth();

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await authenticatedFetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: isAuthenticated,
    ...options,
  });
};
