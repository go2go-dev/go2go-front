import SettingItem from '@/components/setting/SettingItem';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useGetUserMe } from '@/hooks/useGetUser';
// import useRevoke from '@/hooks/useRevoke'; // ✅ 추가

export default function Setting() {
  const navigate = useNavigate();
  // const { data: user, isLoading, error } = useGetUserMe();
  //const revokeMutation = useRevoke(); // ✅ 회원탈퇴 훅

  // 로그아웃 처리 함수
  // const handleLogout = () => {
  //   try {
  //     if (window.ReactNativeWebView) {
  //       window.ReactNativeWebView.postMessage('LOGOUT_REQUEST');
  //       console.log('📤 React Native로 로그아웃 요청 전송');
  //     } else {
  //       console.log('🌐 웹 환경에서 로그아웃');
  //       localStorage.removeItem('accessToken');
  //       localStorage.removeItem('refreshToken');
  //       navigate('/');
  //     }
  //   } catch (error) {
  //     console.error('❌ 로그아웃 처리 실패:', error);
  //   }
  // };

  // // ✅ 회원탈퇴 처리 함수
  // const handleDeleteAccount = () => {
  //   const isConfirmed = confirm(
  //     '정말로 회원탈퇴를 하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.',
  //   );

  //   if (!isConfirmed) return;

  //   // 두 번째 확인
  //   const isDoubleConfirmed = confirm('마지막 확인입니다.\n회원탈퇴를 진행하시겠습니까?');

  //   if (!isDoubleConfirmed) return;

  //   revokeMutation.mutate(undefined, {
  //     onSuccess: () => {
  //       alert('회원탈퇴가 완료되었습니다.');

  //       // 웹 환경에서는 홈으로 이동
  //       if (!window.ReactNativeWebView) {
  //         navigate('/');
  //       }
  //     },
  //     onError: () => {
  //       alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
  //     },
  //   });
  // };

  return (
    <div className="flex-1 pt-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">설정</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="mt-6">
        {/* Profile Section */}
        {/* <div className="bg-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              {isLoading ? (
                <>
                  <div className="h-5 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </>
              ) : error ? (
                <>
                  <div className="text-base font-medium text-red-500">로딩 실패</div>
                  <div className="text-sm text-gray-500">사용자 정보를 불러올 수 없습니다</div>
                </>
              ) : (
                <>
                  <div className="text-base font-medium text-gray-900">
                    {user?.name || '사용자'}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email || 'email@example.com'}</div>
                </>
              )}
            </div>
          </div>
        </div> */}

        {/* 전체 Section */}
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500">전체</h2>

          <div className="bg-white mt-2 divide-y divide-gray-100">
            <SettingItem
              title="개인정보처리방침"
              onClick={() =>
                window.open(
                  'https://gratis-newsstand-285.notion.site/219b56b97792804f9583e6592ccd8d16',
                  '_blank',
                )
              }
            />
            <SettingItem
              title="서비스 이용약관"
              onClick={() =>
                window.open(
                  'https://gratis-newsstand-285.notion.site/219b56b9779280199f85de8ee21dc395?source=copy_link',
                  '_blank',
                )
              }
            />
          </div>
        </div>

        {/* 설정 Section */}
        {/* <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500">설정</h2>

          <div className="bg-white mt-2 divide-y divide-gray-100">
            <SettingItem title="로그아웃" onClick={handleLogout} />
            <SettingItem
              title="회원탈퇴"
              onClick={handleDeleteAccount} // ✅ 회원탈퇴 핸들러 연결
              hasArrow={revokeMutation.isPending ? false : true} // 로딩 중에는 화살표 숨김
              rightText={revokeMutation.isPending ? '처리 중...' : undefined} // 로딩 상태 표시
            />
          </div>
        </div> */}

        {/* Version Info */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">버전 정보</span>
            <span className="text-sm text-gray-500">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
