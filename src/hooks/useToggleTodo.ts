import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const toggleTodo = async (todoId: number): Promise<void> => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/todos/${todoId}/toggle`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('할일 상태 변경에 실패했습니다.');
  }
};

export const useToggleTodo = (timerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTodo,

    // 🎯 Optimistic Update: API 호출 전에 즉시 캐시 업데이트
    onMutate: async (todoId: number) => {
      // 진행 중인 refetch 취소 (경쟁 상태 방지)
      if (timerId) {
        await queryClient.cancelQueries({ queryKey: ['timerDetail', timerId] });
      }
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // 이전 데이터 백업 (롤백용)
      const previousTimerData = timerId
        ? queryClient.getQueryData(['timerDetail', timerId])
        : undefined;
      const previousTodosData = queryClient.getQueryData(['todos']);

      // 즉시 캐시 업데이트 (낙관적 업데이트)
      if (timerId && previousTimerData) {
        queryClient.setQueryData(['timerDetail', timerId], (oldData: any) => {
          if (!oldData?.result?.todoList) return oldData;

          return {
            ...oldData,
            result: {
              ...oldData.result,
              todoList: oldData.result.todoList.map((todo: any) =>
                todo.todoId === todoId ? { ...todo, isDone: !todo.isDone } : todo,
              ),
            },
          };
        });
      }

      // todos 데이터도 업데이트 (TodoApp에서도 동기화)
      if (previousTodosData) {
        queryClient.setQueryData(['todos'], (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;

          return oldData.map((section: any) => ({
            ...section,
            todos: section.todos.map((todo: any) =>
              todo.todoId === todoId ? { ...todo, isDone: !todo.isDone } : todo,
            ),
          }));
        });
      }

      // 백업 데이터 반환 (에러 시 롤백용)
      return { previousTimerData, previousTodosData };
    },

    // ✅ 성공 시: 백그라운드에서 최신 데이터로 동기화 (사용자는 못 느낌)
    onSuccess: () => {
      // 백그라운드에서 조용히 동기화 (UI 변화 없음)
      setTimeout(() => {
        if (timerId) {
          queryClient.refetchQueries({
            queryKey: ['timerDetail', timerId],
            type: 'active',
            stale: true,
          });
        }
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      }, 500); // 0.5초 후 백그라운드 동기화
    },

    // ❌ 실패 시: 이전 상태로 롤백
    onError: (error, todoId, context) => {
      // 백업된 데이터로 롤백
      if (context?.previousTimerData && timerId) {
        queryClient.setQueryData(['timerDetail', timerId], context.previousTimerData);
      }
      if (context?.previousTodosData) {
        queryClient.setQueryData(['todos'], context.previousTodosData);
      }

      // 사용자에게 에러 알림
      alert('할일 상태 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
