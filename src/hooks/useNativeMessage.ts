import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NativeMessage {
  type: 'NAVIGATE' | 'OPEN_TODO' | 'OPEN_PAGE';
  path?: string;
  autoAdd?: boolean;
}

export const useNativeMessage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ RN에서 오는 네비게이션 메시지 처리
    const handleNavigationMessage = (event: MessageEvent) => {
      try {
        const data: NativeMessage = JSON.parse(event.data);

        console.log('[Web] RN 네비게이션 메시지 수신:', data);

        switch (data.type) {
          case 'NAVIGATE':
            if (data.path) {
              const url = data.autoAdd ? `${data.path}?autoAdd=true` : data.path;
              console.log('[Web] 네비게이션 실행:', url);
              navigate(url);

              // RN에 완료 신호 전송
              if ((window as any).ReactNativeWebView) {
                (window as any).ReactNativeWebView.postMessage('NAVIGATION_COMPLETED');
              }
            }
            break;

          case 'OPEN_TODO':
            const todoUrl = data.autoAdd ? '/todo?autoAdd=true' : '/todo';
            console.log('[Web] Todo 페이지 열기:', todoUrl);
            navigate(todoUrl);
            break;

          case 'OPEN_PAGE':
            if (data.path) {
              console.log('[Web] 페이지 열기:', data.path);
              navigate(data.path);
            }
            break;

          default:
            console.log('[Web] 알 수 없는 네비게이션 메시지 타입:', data.type);
        }
      } catch (error) {
        // JSON 파싱 실패는 네비게이션 메시지가 아닐 수 있으므로 조용히 무시
        console.log('[Web] 네비게이션 메시지 파싱 실패 (일반 메시지일 수 있음):', event.data);
      }
    };

    // ✅ RN에서 오는 커스텀 이벤트 처리
    const handleNavigationEvent = (event: CustomEvent) => {
      const data = event.detail;
      console.log('[Web] 네비게이션 커스텀 이벤트 수신:', data);

      if (data.type === 'NAVIGATE' && data.path) {
        const url = data.autoAdd ? `${data.path}?autoAdd=true` : data.path;
        console.log('[Web] 커스텀 이벤트로 네비게이션:', url);
        navigate(url);
      }
    };

    // ✅ 홈으로 이동하는 커스텀 이벤트 (기존 코드 호환)
    const handleNavigateToHome = () => {
      console.log('[Web] 홈으로 네비게이션');
      navigate('/');
    };

    // React Native WebView에서 오는 메시지 리스너
    if ((window as any).ReactNativeWebView) {
      window.addEventListener('message', handleNavigationMessage);
      document.addEventListener('message', handleNavigationMessage as any);
    }

    // 커스텀 이벤트 리스너들
    window.addEventListener('navigationFromRN', handleNavigationEvent as EventListener);
    window.addEventListener('navigateToHome', handleNavigateToHome);

    return () => {
      window.removeEventListener('message', handleNavigationMessage);
      document.removeEventListener('message', handleNavigationMessage as any);
      window.removeEventListener('navigationFromRN', handleNavigationEvent as EventListener);
      window.removeEventListener('navigateToHome', handleNavigateToHome);
    };
  }, [navigate]);
};

// 웹에서 RN으로 메시지 보내기 (필요한 경우)
export const sendMessageToNative = (message: any) => {
  if ((window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
  }
};
