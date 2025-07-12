import { useRouteError, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ErrorResponse {
  statusText?: string;
  message?: string;
  status?: number;
  data?: any;
  error?: Error;
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorResponse;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 상세한 에러 정보 로깅
    console.error('=== React Router Error ===');
    console.error('Error object:', error);
    console.error('Current location:', location);
    console.error('Window location:', window.location);
    console.error('User agent:', navigator.userAgent);
    console.error('Is React Native WebView:', !!(window as any).ReactNativeWebView);
    console.error('Available tokens:', {
      accessToken: !!localStorage.getItem('accessToken'),
      refreshToken: !!localStorage.getItem('refreshToken'),
    });
    console.error('========================');

    // React Native에 에러 알림
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'ROUTER_ERROR',
          error: error.message || error.statusText || 'Unknown router error',
          path: location.pathname,
        }),
      );
    }
  }, [error, location]);

  const handleGoHome = () => {
    try {
      navigate('/', { replace: true });
    } catch (navError) {
      console.error('Navigate error:', navError);
      window.location.href = '/';
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-700 mb-4">죄송합니다. 예상치 못한 오류가 발생했습니다.</p>

          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm font-medium text-gray-600 mb-2">에러 정보:</p>
            <p className="text-sm text-red-600">
              {error.statusText || error.message || '알 수 없는 오류'}
            </p>
            {error.status && <p className="text-sm text-gray-600 mt-1">Status: {error.status}</p>}
            <p className="text-sm text-gray-600 mt-1">Path: {location.pathname}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              홈으로 가기
            </button>
            <button
              onClick={handleReload}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              페이지 새로고침
            </button>
          </div>

          {/* 개발용 디버그 정보 */}
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">개발자용 디버그 정보</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(
                {
                  error: error,
                  location: location,
                  windowLocation: {
                    href: window.location.href,
                    origin: window.location.origin,
                    pathname: window.location.pathname,
                  },
                  tokens: {
                    hasAccessToken: !!localStorage.getItem('accessToken'),
                    hasRefreshToken: !!localStorage.getItem('refreshToken'),
                  },
                  userAgent: navigator.userAgent,
                },
                null,
                2,
              )}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
