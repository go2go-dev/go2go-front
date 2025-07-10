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
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [receivedMethod, setReceivedMethod] = useState<string | null>(null);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessageLog((prev) => [...prev.slice(-4), `${timestamp}: ${message}`]);
    console.log(`[Debug] ${message}`);
  };

  const checkStoredTokens = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    addToLog(`토큰 확인: ${accessToken ? '있음' : '없음'}`);
    return { accessToken, refreshToken };
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setTokenReceived(false);
    setLastReceivedTime(null);
    setReceivedMethod(null);
    addToLog('토큰 삭제 완료');
  };

  useEffect(() => {
    const { accessToken, refreshToken } = checkStoredTokens();
    if (accessToken && refreshToken) {
      setTokenReceived(true);
      setReceivedMethod('기존 저장됨');
    }
  }, []);

  useEffect(() => {
    const handleTokenReceived = (event: any) => {
      const now = new Date().toLocaleTimeString();
      setTokenReceived(true);
      setLastReceivedTime(now);

      const method = event.detail?.method || '커스텀 이벤트';
      setReceivedMethod(method);
      addToLog(`${method}로 토큰 수신 완료`);
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
          className={`px-3 py-1 rounded text-sm text-white ${
            tokenReceived ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          🔧 디버그 {tokenReceived ? '✅' : '⏳'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm max-h-96 overflow-y-auto">
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

        {receivedMethod && <div className="text-blue-600">수신 방법: {receivedMethod}</div>}

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

        <div className="border-t pt-2">
          <div className="mb-1">메시지 로그:</div>
          <div className="bg-gray-50 p-2 rounded text-xs max-h-20 overflow-y-auto">
            {messageLog.length > 0
              ? messageLog.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              : '로그 없음'}
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
      console.log('[Web] 수신된 전체 이벤트:', {
        origin: event.origin,
        data: event.data,
        source: event.source,
        type: event.type,
      });

      try {
        // ❌ 기존: origin 체크가 너무 엄격함
        // if (event.origin !== 'null') {
        //   console.log('[Web] 무시된 메시지 origin:', event.origin);
        //   return;
        // }

        // ✅ 수정: React Native WebView 메시지만 허용하도록 완화
        const isFromReactNative =
          event.origin === 'null' ||
          event.origin === 'file://' ||
          event.origin === '' ||
          !event.origin;

        console.log('[Web] Origin 체크:', {
          origin: event.origin,
          isFromReactNative,
        });

        let data;

        // 데이터 파싱 시도
        if (typeof event.data === 'string') {
          data = JSON.parse(event.data);
        } else if (typeof event.data === 'object') {
          data = event.data;
        } else {
          console.log('[Web] 알 수 없는 데이터 형식:', typeof event.data);
          return;
        }

        console.log('[Web] 파싱된 데이터:', data);

        const { accessToken, refreshToken } = data;
        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('[Web] 토큰 저장 완료', {
            accessToken: `${accessToken}`,
            refreshToken: `${refreshToken}`,
          });

          // 토큰 수신 이벤트 발생
          window.dispatchEvent(
            new CustomEvent('tokensReceived', {
              detail: { method: 'postMessage' },
            }),
          );

          // 홈으로 리다이렉트
          setTimeout(() => {
            window.location.href = '/home';
          }, 500);
        } else {
          console.log('[Web] 토큰이 없는 메시지:', data);
        }
      } catch (error) {
        console.error('[Web] 메시지 파싱 실패:', error);
        console.log('[Web] 원본 데이터:', event.data);
      }
    };

    // 전역 함수로 토큰 수신 (React Native에서 직접 호출 가능)
    (window as any).receiveTokensFromRN = (tokensString: string) => {
      console.log('[Web] 전역 함수로 토큰 수신:', tokensString);
      try {
        const data = JSON.parse(tokensString);
        const { accessToken, refreshToken } = data;

        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('[Web] 전역 함수로 토큰 저장 완료');

          window.dispatchEvent(
            new CustomEvent('tokensReceived', {
              detail: { method: '전역함수' },
            }),
          );

          setTimeout(() => {
            window.location.href = '/home';
          }, 500);
        }
      } catch (error) {
        console.error('[Web] 전역 함수 토큰 파싱 실패:', error);
      }
    };

    // 다양한 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);

    // React Native 환경 감지 로그
    console.log('[Web] 환경 정보:', {
      userAgent: navigator.userAgent,
      hasReactNativeWebView: !!(window as any).ReactNativeWebView,
      origin: window.location.origin,
      href: window.location.href,
    });

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
      delete (window as any).receiveTokensFromRN;
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
