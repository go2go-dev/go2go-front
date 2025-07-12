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
  const [storedTokens, setStoredTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
  });

  // 웹뷰 환경 감지
  const isWebView = () => {
    return (
      !!(window as any).ReactNativeWebView ||
      navigator.userAgent.includes('WebView') ||
      window.location.protocol === 'file:'
    );
  };

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
    setStoredTokens({ accessToken: null, refreshToken: null });
    addToLog('토큰 삭제 완료');
  };

  useEffect(() => {
    const tokens = checkStoredTokens();
    if (tokens.accessToken && tokens.refreshToken) {
      setTokenReceived(true);
      setReceivedMethod('기존 저장됨');
    }
    setStoredTokens(tokens);
  }, []);

  useEffect(() => {
    const handleTokenReceived = (event: any) => {
      const now = new Date().toLocaleTimeString();
      setTokenReceived(true);
      setLastReceivedTime(now);

      const method = event.detail?.method || '커스텀 이벤트';
      setReceivedMethod(method);
      setStoredTokens(checkStoredTokens());
      addToLog(`${method}로 토큰 수신 완료`);
    };

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
          />
          <span>토큰 수신: {tokenReceived ? '완료' : '대기중'}</span>
        </div>

        {receivedMethod && <div className="text-blue-600">수신 방법: {receivedMethod}</div>}
        {lastReceivedTime && <div className="text-gray-600">마지막 수신: {lastReceivedTime}</div>}

        <div className="text-blue-600">환경: {isWebView() ? '웹뷰' : '일반 웹'}</div>

        <div className="border-t pt-2">
          <div className="mb-1">Access Token:</div>
          <div className="bg-gray-100 p-1 rounded text-xs break-all">
            {storedTokens.accessToken ? `${storedTokens.accessToken.slice(0, 30)}...` : '없음'}
          </div>
        </div>
        <div>
          <div className="mb-1">Refresh Token:</div>
          <div className="bg-gray-100 p-1 rounded text-xs break-all">
            {storedTokens.refreshToken ? `${storedTokens.refreshToken.slice(0, 30)}...` : '없음'}
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
            onClick={() => {
              const tokens = checkStoredTokens();
              setStoredTokens(tokens);
            }}
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
  const [isAppReady, setIsAppReady] = useState(false);

  // 웹뷰 환경 감지
  const isWebView = () => {
    return (
      !!(window as any).ReactNativeWebView ||
      navigator.userAgent.includes('WebView') ||
      window.location.protocol === 'file:'
    );
  };

  useEffect(() => {
    console.log('[Web] App 컴포넌트 마운트됨');
    console.log('[Web] 환경 감지:', isWebView() ? '웹뷰' : '일반 웹');

    // 앱이 완전히 준비되었음을 알리는 함수
    const notifyAppReady = () => {
      if ((window as any).ReactNativeWebView && !isAppReady) {
        console.log('[Web] React Native에 준비 완료 신호 전송');
        (window as any).ReactNativeWebView.postMessage('WEBVIEW_READY');
        setIsAppReady(true);
      }
    };

    // 토큰 처리 함수들
    const handleTokens = (accessToken: string, refreshToken: string, method: string) => {
      try {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log(`[Web] ${method}으로 토큰 저장 완료`);

        window.dispatchEvent(new CustomEvent('tokensReceived', { detail: { method } }));

        // React Native에 성공 신호
        if ((window as any).ReactNativeWebView) {
          (window as any).ReactNativeWebView.postMessage('TOKEN_SAVED_SUCCESS');
        }

        // 홈으로 리다이렉트 (React Router 방식으로 변경)
        setTimeout(() => {
          // React Router navigate 사용을 시도, 실패시 window.location 사용
          try {
            const event = new CustomEvent('navigateToHome');
            window.dispatchEvent(event);
          } catch (error) {
            console.error('[Web] Navigate 실패, location.href 사용:', error);
            window.location.href = '/home';
          }
        }, 500);

        return true;
      } catch (error) {
        console.error(`[Web] ${method} 토큰 저장 실패:`, error);

        // React Native에 실패 신호
        if ((window as any).ReactNativeWebView) {
          (window as any).ReactNativeWebView.postMessage('TOKEN_SAVED_ERROR');
        }

        return false;
      }
    };

    // postMessage 이벤트 리스너
    const handleMessage = (event: MessageEvent) => {
      console.log('[Web] 수신된 postMessage:', {
        origin: event.origin,
        data: event.data,
        type: typeof event.data,
      });

      try {
        const isFromReactNative =
          event.origin === 'null' ||
          event.origin === 'file://' ||
          event.origin === '' ||
          !event.origin;

        if (!isFromReactNative) {
          console.log('[Web] React Native가 아닌 소스에서 메시지:', event.origin);
          return;
        }

        let data;
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
          handleTokens(accessToken, refreshToken, 'postMessage');
        } else {
          console.log('[Web] 토큰이 없는 메시지:', data);
        }
      } catch (error) {
        console.error('[Web] postMessage 파싱 실패:', error);
        console.log('[Web] 원본 데이터:', event.data);
      }
    };

    // 전역 함수 정의
    (window as any).receiveTokensFromRN = (tokensString: string) => {
      console.log('[Web] 전역 함수로 토큰 수신:', tokensString);
      try {
        const data = JSON.parse(tokensString);
        const { accessToken, refreshToken } = data;

        if (accessToken && refreshToken) {
          handleTokens(accessToken, refreshToken, '전역함수');
        }
      } catch (error) {
        console.error('[Web] 전역 함수 토큰 파싱 실패:', error);

        if ((window as any).ReactNativeWebView) {
          (window as any).ReactNativeWebView.postMessage('TOKEN_SAVED_ERROR');
        }
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);

    // 환경 정보 로그
    console.log('[Web] 환경 정보:', {
      userAgent: navigator.userAgent,
      hasReactNativeWebView: !!(window as any).ReactNativeWebView,
      origin: window.location.origin,
      href: window.location.href,
      readyState: document.readyState,
      isWebView: isWebView(),
    });

    // DOM과 React가 모두 준비되면 React Native에 알림
    const checkAndNotify = () => {
      if (document.readyState === 'complete' && document.querySelector('#root')) {
        console.log('[Web] DOM과 React 모두 준비 완료');
        notifyAppReady();
      }
    };

    // 즉시 체크
    checkAndNotify();

    // DOM 로드 완료 이벤트
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndNotify);
    }

    // 약간의 지연 후 한 번 더 체크 (React 렌더링 완료 대기)
    const timeoutId = setTimeout(() => {
      console.log('[Web] 지연 후 준비 상태 재확인');
      notifyAppReady();
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as any);
      document.removeEventListener('DOMContentLoaded', checkAndNotify);
      delete (window as any).receiveTokensFromRN;
      clearTimeout(timeoutId);
    };
  }, [isAppReady]);

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
