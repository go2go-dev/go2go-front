// hooks/useRevoke.ts
import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useMutation } from '@tanstack/react-query';

const useRevoke = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/auth/apple/revoke`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('회원탈퇴에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      console.log('✅ 회원탈퇴 성공');

      // 로컬 스토리지 토큰 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // React Native로 회원탈퇴 완료 메시지 전송
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('ACCOUNT_DELETED');
        console.log('📤 React Native로 회원탈퇴 완료 메시지 전송');
      }
    },
    onError: (error) => {
      console.error('❌ 회원탈퇴 실패:', error);
    },
  });
};

export default useRevoke;
