import { useEffect } from 'react';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { router } from './router';
import FallbackUI from './pages/FallbackUI';
import Loading from './pages/Loading/Loading';
import { Suspense } from 'react';

function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const { accessToken, refreshToken } = JSON.parse(event.data);

        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          console.log('[WebView] 토큰 저장 완료');

          // ✅ 로그인 완료 후 홈으로 이동
          window.location.href = '/home';
        }
      } catch (error) {
        console.error('[WebView] 토큰 파싱 실패:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
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
    </div>
  );
}

export default App;
