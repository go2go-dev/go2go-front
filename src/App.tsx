import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { router } from './router';
import FallbackUI from './pages/FallbackUI';
import Loading from './pages/Loading/Loading';
import { Suspense } from 'react';

// 토큰 확인용 디버그 컴포넌트
const TokenDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tokenReceived, setTokenReceived] = useState(false);
  const [lastReceivedTime, setLastReceivedTime] = useState<string | null>(null);

  const checkStoredTokens = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('저장된 토큰 확인:', {
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
    });

    return { accessToken, refreshToken };
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setTokenReceived(false);
    setLastReceivedTime(null);
    console.log('토큰 삭제 완료');
  };

  // 컴포넌트 마운트 시 기존 토큰 확인
  useEffect(() => {
    const { accessToken, refreshToken } = checkStoredTokens();
    if (accessToken && refreshToken) {
      setTokenReceived(true);
    }
  }, []);

  // 토큰 수신 이벤트 리스너
  useEffect(() => {
    const handleTokenReceived = () => {
      setTokenReceived(true);
      setLastReceivedTime(new Date().toLocaleTimeString());
    };

    // localStorage 변화 감지 (같은 탭에서는 발생하지 않으므로 custom event 사용)
    window.addEventListener('tokensReceived', handleTokenReceived);

    return () => {
      window.removeEventListener('tokensReceived', handleTokenReceived);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          🔧 디버그
        </button>
      </div>
    );
  }

  const { accessToken, refreshToken } = checkStoredTokens();

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">토큰 디버그 패널</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${tokenReceived ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          <span>토큰 수신: {tokenReceived ? '완료' : '대기중'}</span>
        </div>

        {lastReceivedTime && <div className="text-gray-600">마지막 수신: {lastReceivedTime}</div>}

        <div className="border-t pt-2">
          <div className="mb-1">Access Token:</div>
          <div className="bg-gray-100 p-1 rounded text-xs break-all">
            {accessToken ? `${accessToken.substring(0, 30)}...` : '없음'}
          </div>
        </div>

        <div>
          <div className="mb-1">Refresh Token:</div>
          <div className="bg-gray-100 p-1 rounded text-xs break-all">
            {refreshToken ? `${refreshToken.substring(0, 30)}...` : '없음'}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={checkStoredTokens}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
          >
            새로고침
          </button>
          <button
            onClick={clearTokens}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
          >
            토큰 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebView] 수신된 데이터:', data);

        const { accessToken, refreshToken } = data;

        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('[WebView] 토큰 저장 완료', {
            accessToken: `${accessToken.substring(0, 20)}...`,
            refreshToken: `${refreshToken.substring(0, 20)}...`,
          });

          // 토큰 수신 이벤트 발생
          window.dispatchEvent(new CustomEvent('tokensReceived'));

          // ✅ 로그인 완료 후 홈으로 이동
          window.location.href = '/home';
        }
      } catch (error) {
        console.error('[WebView] 메시지 파싱 실패:', error);
        console.log('[WebView] 원본 데이터:', event.data);
      }
    };

    // PostMessage 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);

    // React Native WebView에서 오는 메시지도 처리
    document.addEventListener('message', handleMessage as any);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <QueryClientProvider client={queryClient}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
              <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
                <TokenDebugPanel />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </div>
  );
}

export default App;
