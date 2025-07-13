import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddTodoRequest = {
  timerId?: number;
  content: string;
};

type AddTodoResponse = {
  result: string;
  todoId: number;
};

const addTodo = async (data: AddTodoRequest): Promise<AddTodoResponse> => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');

  // ✅ 요청 바디 구성 - timerId가 있을 때만 포함
  const requestBody: any = {
    content: data.content,
  };

  // timerId가 유효한 값(0보다 큰 숫자)일 때만 포함
  if (data.timerId && data.timerId > 0) {
    requestBody.timerId = data.timerId;
  }

  console.log('API 요청 데이터:', requestBody); // 디버깅용

  const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error('API 에러 응답:', errorData);
    throw new Error(`할일 추가 실패: ${res.status}`);
  }

  return res.json();
};

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onSuccess: (data, variables) => {
      console.log('할일 추가 성공:', data);
      console.log('사용된 변수:', variables);

      // ✅ 항상 todos 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ['todos'] });

      // ✅ timerId가 있을 때만 타이머 상세 정보 갱신
      if (variables?.timerId && variables.timerId > 0) {
        queryClient.invalidateQueries({ queryKey: ['timerDetail'] });
        queryClient.invalidateQueries({ queryKey: ['timerDetail', variables.timerId] });
      }
    },
    onError: (error, variables) => {
      console.error('할일 추가 실패:', error);
      console.error('실패한 변수:', variables);
      alert(`할일 추가에 실패했습니다: ${error.message}`);
    },
  });
}
