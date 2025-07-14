import { useEffect, useState, Suspense } from 'react';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { router } from './router';
import FallbackUI from './pages/FallbackUI';
import Loading from './pages/Loading/Loading';

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
            <Suspense fallback={<Loading />}>
              <RouterProvider router={router} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
}

export default App;
