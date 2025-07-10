import { useEffect, useState, Suspense } from 'react';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { router } from './router';
import FallbackUI from './pages/FallbackUI';
import Loading from './pages/Loading/Loading';

const queryClient = new QueryClient();

const TokenDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tokenReceived, setTokenReceived] = useState(false);
  const [lastReceivedTime, setLastReceivedTime] = useState<string | null>(null);

  const checkStoredTokens = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setTokenReceived(false);
    setLastReceivedTime(null);
  };

  useEffect(() => {
    const { accessToken, refreshToken } = checkStoredTokens();
    if (accessToken && refreshToken) {
      setTokenReceived(true);
    }
  }, []);

  useEffect(() => {
    const handleTokenReceived = () => {
      setTokenReceived(true);
      setLastReceivedTime(new Date().toLocaleTimeString());
    };
    window.addEventListener('tokensReceived', handleTokenReceived);
    return () => {
      window.removeEventListener('tokensReceived', handleTokenReceived);
    };
  }, []);

  const { accessToken, refreshToken } = checkStoredTokens();

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
            {accessToken ? `${accessToken.slice(0, 30)}...` : '없음'}
          </div>
        </div>
        <div>
          <div className="mb-1">Refresh Token:</div>
          <div className="bg-gray-100 p-1 rounded text-xs break-all">
            {refreshToken ? `${refreshToken.slice(0, 30)}...` : '없음'}
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
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.origin !== 'null') {
          console.log('[Web] 무시된 메시지 origin:', event.origin);
          return;
        }

        const data = JSON.parse(event.data);
        console.log('[Web] 수신된 메시지:', data);

        const { accessToken, refreshToken } = data;
        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('[Web] 토큰 저장 완료');

          window.dispatchEvent(new CustomEvent('tokensReceived'));
          window.location.href = '/home';
        }
      } catch (error) {
        console.error('[Web] 메시지 파싱 실패:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
