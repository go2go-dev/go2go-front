import React, { createContext, useContext, useEffect, useState } from 'react';

type Tokens = { accessToken: string; refreshToken: string };

interface AuthContextValue {
  tokens: Tokens | null;
  setTokens: (t: Tokens | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | null>(null);

  // 1) 앱 시작 시 localStorage에서 읽기 (브라우저로 열어도 동작)
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
    }
  }, []);

  // 2) RN에서 주입하는 글로벌 함수 / 이벤트 등록
  useEffect(() => {
    // 전역 함수 정의
    (window as any).receiveTokensFromRN = (tokensJson: string) => {
      try {
        const parsed: Tokens = JSON.parse(tokensJson);

        localStorage.setItem('accessToken', parsed.accessToken);
        localStorage.setItem('refreshToken', parsed.refreshToken);

        setTokens(parsed);
        console.log('[Web] RN에서 토큰 수신 & 저장 완료:', parsed);
      } catch (e) {
        console.error('[Web] receiveTokensFromRN 파싱 실패', e);
      }
    };

    // RN에서 보내는 커스텀 이벤트도 같이 듣기 (선택)
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      console.log('[Web] tokensReceived 이벤트:', custom.detail);
      // 필요하면 여기서도 별도 처리 가능
    };

    window.addEventListener('tokensReceived', handler as EventListener);

    return () => {
      window.removeEventListener('tokensReceived', handler as EventListener);
    };
  }, []);

  return <AuthContext.Provider value={{ tokens, setTokens }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
