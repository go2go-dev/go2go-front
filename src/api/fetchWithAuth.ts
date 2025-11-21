// RN WebView에서 postMessage 쓸 수 있도록 타입 선언
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (data: string) => void;
    };
  }
}

// 공통 API 에러 타입
interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

/**
 * 인증 포함 fetch 유틸
 * - localStorage에서 accessToken / refreshToken 읽어서 Authorization 헤더에 붙임
 * - 401 + "만료된 토큰입니다." → /api/auth/refresh 호출
 * - 새 토큰 발급되면 localStorage 갱신 + RN(WebView)에 TOKENS_UPDATED 전송
 * - refresh 마저 실패 시 토큰 삭제 + RN에 TOKENS_INVALID 전송
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // 1차 요청
  let response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  // 토큰 만료 처리
  if (response.status === 401) {
    const result: ApiErrorResponse | null = await response
      .clone()
      .json()
      .catch(() => null);

    if (result?.message === '만료된 토큰입니다.') {
      console.log('[Auth] accessToken 만료, refresh 시도');

      if (!refreshToken) {
        console.error('[Auth] refreshToken 없음, 갱신 불가');
        throw new Error('refreshToken 없음');
      }

      // 리프레시 요청
      const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!refreshRes.ok) {
        console.error('[Auth] refreshToken도 만료됨. 수동 로그인 필요');

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.dispatchEvent(
          new CustomEvent('authLogout', {
            detail: { reason: 'refresh_failed' },
          }),
        );

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TOKENS_INVALID' }));
        }

        throw new Error('토큰 갱신 실패');
      }

      const refreshData = await refreshRes.json();
      console.log('[Auth] 토큰 갱신 응답:', refreshData);

      const newAccessToken = refreshData.result?.accessToken;
      const newRefreshToken = refreshData.result?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        console.error('[Auth] 갱신 응답에 토큰이 없음:', refreshData);
        throw new Error('토큰 갱신 응답 형식 오류');
      }

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      console.log('[Auth] 토큰 재발급 성공. 요청 재시도');

      window.dispatchEvent(
        new CustomEvent('tokensRefreshed', {
          detail: { method: 'fetchWithAuth' },
        }),
      );

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'TOKENS_UPDATED',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          }),
        );
      }

      response = await fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return response;
}

// =============================
//  편의용 래퍼 함수들
// =============================

export async function apiGet<T = any>(url: string): Promise<T> {
  const response = await fetchWithAuth(url);

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

/*
사용 예시:

// GET
const notes = await apiGet(`${import.meta.env.VITE_API_URL}/api/notes`);

// POST
const created = await apiPost(`${import.meta.env.VITE_API_URL}/api/notes`, {
  title: '새 메모',
  content: '...',
});

// 직접 fetchWithAuth 사용
const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/me`, {
  method: 'GET',
});
*/
