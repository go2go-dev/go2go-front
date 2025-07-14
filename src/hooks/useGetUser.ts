import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';

export interface User {
  userId: number;
  name: string;
  email: string;
}

export const getUserMe = async (): Promise<User> => {
  const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/users/me`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 불러오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.result; // ✅ result 객체만 반환
};

export const useGetUserMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: getUserMe,
  });
};
