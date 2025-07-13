import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import TodoItem from '@/components/todo/TodoItem';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEndTimer } from '@/hooks/useEndTimer';
import { useTimerDetail } from '@/hooks/useTimerDetail';
import { useAddTodo } from '@/hooks/useAddTodo';
import timerChar2 from '@/assets/gif/timer2.gif';
import PlusBtn from '@/assets/svg/plusBtnIcon.svg?react';

// API 응답 타입 정의
interface TodoItemData {
  todoId: number;
  content: string;
  isDone: boolean;
}

export default function TimerDetail() {
  const { timerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, minutes } = location.state || {};

  // React Query로 타이머 상세 정보 가져오기
  const { data, isLoading, error } = useTimerDetail(timerId ? Number(timerId) : undefined);

  // 타이머 상태
  const [remainingSeconds, setRemainingSeconds] = useState(minutes ? minutes * 60 : 0);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // mutation hooks
  const { mutate: endTimer, isPending: isEnding } = useEndTimer();
  const addTodoMutation = useAddTodo();

  // TODO 추가 상태
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 바텀시트 상태
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);

  // 데이터 로딩 완료 시 한 번만 로그 출력
  useEffect(() => {
    if (data) {
      console.log('Timer data loaded:', data);
    }
  }, [data]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error('Timer detail fetch error:', error);
      alert('타이머 정보를 불러오는데 실패했습니다.');
    }
  }, [error]);

  // 타이머 카운트다운 로직
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsCompleted(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds]);

  // 타이머 완료 알림
  useEffect(() => {
    if (isCompleted) {
      alert('타이머가 완료되었습니다! 🎉');
    }
  }, [isCompleted]);

  // TODO 추가 시 input focus
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // TODO 추가 핸들러
  const handleAddTodo = () => {
    if (!inputValue.trim() || !timerId || addTodoMutation.isPending) return;

    addTodoMutation.mutate(
      { timerId: Number(timerId), content: inputValue.trim() },
      {
        onSuccess: () => {
          setInputValue('');
          setIsAdding(false);
        },
        onError: () => alert('할일 추가에 실패했습니다.'),
      },
    );
  };

  // 시간 포맷팅
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 타이머 종료 핸들러
  const handleEnd = () => {
    if (!timerId) return;

    setIsRunning(false);

    if (confirm('타이머를 종료하시겠습니까?')) {
      endTimer(Number(timerId), {
        onSuccess: () => navigate('/'),
        onError: () => {
          alert('타이머 종료 실패');
          setIsRunning(true);
        },
      });
    } else {
      setIsRunning(true);
    }
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (confirm('타이머를 중단하고 나가시겠습니까?')) {
      setIsRunning(false);
      navigate('/');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto bg-white h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 실제 타이머 이름과 분 (API 데이터 우선, fallback으로 location.state 사용)
  const timerName = data?.result?.name || name || '타이머';

  // ✅ TODO 리스트 확인 (빈 배열도 허용)
  const todoList = data?.result?.todoList || [];
  const hasTodos = todoList.length > 0;

  return (
    <div className="max-w-sm mx-auto bg-white h-screen flex flex-col items-center pt-5 pb-6 relative overflow-hidden">
      {/* 헤더 */}
      <div className="relative w-full">
        <div className="absolute left-4 top-2 cursor-pointer" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </div>
        <h1 className="text-lg font-semibold text-center">{timerName}</h1>
      </div>

      {/* 캐릭터 이미지 */}
      <div className="mb-2 pt-20">
        <img src={timerChar2} alt="캐릭터" className="w-60 h-60 mx-auto" />
      </div>

      {/* 타이머 디스플레이 */}
      <div className="relative">
        <div className="relative w-48 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-800">
              {isCompleted ? '완료!' : formatTime(remainingSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* 종료 버튼 */}
      <button
        className={`mt-6 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        onClick={handleEnd}
        disabled={isEnding}
      >
        {isCompleted ? '완료하기' : '종료하기'}
      </button>

      {/* 배경 오버레이 */}
      <AnimatePresence>
        {isBottomSheetExpanded && (
          <motion.div
            className="absolute inset-0 bg-black/30 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsBottomSheetExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* ✅ 바텀시트 - TODO가 없어도 항상 표시 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gray-100 rounded-t-2xl shadow-lg border-t border-gray-200 z-20"
        initial={{ y: '90%' }}
        animate={{ y: isBottomSheetExpanded ? 0 : '90%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          const shouldExpand = info.velocity.y < -500 || info.offset.y < -50;
          const shouldCollapse = info.velocity.y > 500 || info.offset.y > 50;

          if (shouldExpand) {
            setIsBottomSheetExpanded(true);
          } else if (shouldCollapse) {
            setIsBottomSheetExpanded(false);
          }
        }}
        style={{ height: '70vh' }}
      >
        {/* 드래그 핸들 */}
        <div
          className="flex justify-center py-3 cursor-pointer "
          onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* 바텀시트 헤더 - 확장되었을 때만 표시 */}
        {isBottomSheetExpanded && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-body5 font-semibold">지금 생각난 할 일을 적어보세요</h2>
            </div>

            <button
              onClick={() => setIsAdding(true)}
              disabled={addTodoMutation.isPending}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <PlusBtn />
            </button>
          </div>
        )}

        {/* TODO 리스트 - 확장되었을 때만 표시 */}
        {isBottomSheetExpanded && (
          <div className="flex-1 overflow-y-auto px-4">
            {/* TODO 추가 입력창 */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="mb-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-white border-2 border-dashed"
                  >
                    <div className="w-5 h-5 min-w-5 min-h-5 rounded-md flex items-center justify-center bg-gray-200"></div>

                    <div className="text-sm flex-1">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddTodo();
                        }}
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="할 일을 적어주세요"
                          className="w-full border-0 outline-none bg-transparent placeholder-gray-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsAdding(false);
                              setInputValue('');
                            }
                          }}
                        />
                      </form>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ TODO 리스트 또는 빈 상태 */}
            <div className="space-y-2 pb-4">
              {hasTodos
                ? // TODO가 있을 때
                  todoList.map((todo: TodoItemData) => (
                    <TodoItem
                      key={todo.todoId}
                      todoId={todo.todoId}
                      text={todo.content}
                      isChecked={todo.isDone}
                      isTag={false}
                      timerName={timerName}
                      timerId={Number(timerId)}
                      onDelete={() => {
                        console.log('Todo deleted:', todo.todoId);
                      }}
                    />
                  ))
                : // ✅ TODO가 없을 때 빈 상태
                  !isAdding && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">할 일이 없어요</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        + 버튼을 눌러서 할 일을 추가해보세요
                      </p>
                      <button
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm transition-colors"
                      >
                        할 일 추가하기
                      </button>
                    </motion.div>
                  )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
