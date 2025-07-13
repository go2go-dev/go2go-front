import SettingItem from '@/components/setting/SettingItem';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 -ml-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">설정</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="mt-6">
        {/* Profile Section */}
        <div className="bg-white">
          <div className="px-6 py-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-medium text-gray-900">홍길동</div>
              <div className="text-sm text-gray-500">abcd@naver.com</div>
            </div>
          </div>
        </div>

        {/* 전체 Section */}
        <div className="mt-8">
          <div className="px-6 py-2">
            <h2 className="text-sm font-medium text-gray-500">전체</h2>
          </div>
          <div className="bg-white mt-2 divide-y divide-gray-100">
            <SettingItem title="개인정보처리방침" 
            onClick={() => window.open('https://gratis-newsstand-285.notion.site/219b56b97792804f9583e6592ccd8d16', '_blank')}
            />
            <SettingItem title="서비스 이용약관" 
            onClick={() => window.open('https://gratis-newsstand-285.notion.site/219b56b9779280199f85de8ee21dc395?source=copy_link', '_blank')}
          
            />
          </div>
        </div>

        {/* 설정 Section */}
        <div className="mt-8">
          <div className="px-6 py-2">
            <h2 className="text-sm font-medium text-gray-500">설정</h2>
          </div>
          <div className="bg-white mt-2 divide-y divide-gray-100">
            <SettingItem title="로그아웃" />
            <SettingItem title="회원탈퇴" />
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-8 px-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">버전 정보</span>
            <span className="text-sm text-gray-500">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
