export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // 1차 요청
  let response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // 토큰 만료라면
  if (response.status === 401) {
    const result = await response.clone().json();

    if (result?.message === '만료된 토큰입니다.') {
      console.log('[Auth] accessToken 만료, refresh 시도');

      // ✅ 리프레시 요청
      const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!refreshRes.ok) {
        console.error('[Auth] refreshToken도 만료됨. 수동 로그인 필요');

        // 토큰 정리 및 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 로그아웃 이벤트 발생
        window.dispatchEvent(
          new CustomEvent('authLogout', {
            detail: { reason: 'refresh_failed' },
          }),
        );

        throw new Error('토큰 갱신 실패');
      }

      // ✅ 수정: API 응답 구조에 맞게 토큰 추출
      const refreshData = await refreshRes.json();
      console.log('[Auth] 토큰 갱신 응답:', refreshData);

      // API 응답이 { result: { accessToken, refreshToken } } 구조
      const newAccessToken = refreshData.result?.accessToken;
      const newRefreshToken = refreshData.result?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        console.error('[Auth] 갱신 응답에 토큰이 없음:', refreshData);
        throw new Error('토큰 갱신 응답 형식 오류');
      }

      // ✅ 새 토큰 저장
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      console.log('[Auth] 토큰 재발급 성공. 요청 재시도');

      // 토큰 갱신 이벤트 발생
      window.dispatchEvent(
        new CustomEvent('tokensRefreshed', {
          detail: { method: 'fetchWithAuth' },
        }),
      );

      // 요청 재시도
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

// 사용 예시를 위한 wrapper 함수들
export async function apiGet<T = any>(url: string): Promise<T> {
  const response = await fetchWithAuth(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
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
    const errorData = await response.json().catch(() => ({}));
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

// 사용 예시:
/*
// GET 요청
const userProfile = await apiGet('/api/user/profile');

// POST 요청  
const createResult = await apiPost('/api/user/create', {
  name: '홍길동',
  email: 'hong@example.com'
});

// PUT 요청
const updateResult = await apiPut('/api/user/123', {
  name: '김철수'
});

// DELETE 요청
await apiDelete('/api/user/123');

// 직접 fetchWithAuth 사용
const response = await fetchWithAuth('/api/custom-endpoint', {
  method: 'PATCH',
  body: JSON.stringify({ status: 'active' })
});
*/
