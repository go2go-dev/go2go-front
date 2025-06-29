import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import TodoItem from '@/components/todo/TodoItem';
import { useParams, useNavigate } from 'react-router-dom';
import { useEndTimer } from '@/hooks/useEndTimer';
import { useLocation } from 'react-router-dom';
import { useTimerDetail } from '@/hooks/useTimerDetail';
import { useAddTodo } from '@/hooks/useAddTodo';

type Todo = {
  todoId: number;
  isDone: boolean;
  content: string;
};

type TimerData = {
  name: string;
  minutes: number;
  todoList: Todo[];
};

export default function TimerDetail() {
  const { timerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, minutes } = location.state || {};
  const { data, isLoading } = useTimerDetail(timerId ? Number(timerId) : undefined);

  // 타이머 관련 상태
  const [remainingSeconds, setRemainingSeconds] = useState(minutes ? minutes * 60 : 0);
  const [isRunning, setIsRunning] = useState(true); // 타이머 시작 시 자동으로 실행
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: endTimer, isPending: isEnding } = useEndTimer();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: addTodoMutation, isPending: isAddingTodo } = useAddTodo();

  // 타이머 로직 - 1초마다 감소
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds]);

  // 타이머 완료 시 알림
  useEffect(() => {
    if (isCompleted) {
      alert('타이머가 완료되었습니다! 🎉');
    }
  }, [isCompleted]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddTodo = () => {
    if (!inputValue.trim() || !timerId) return;

    addTodoMutation(
      {
        timerId: Number(timerId),
        content: inputValue.trim(),
      },
      {
        onSuccess: () => {
          setInputValue('');
          setIsAdding(false);
        },
        onError: () => {
          alert('할일 추가에 실패했습니다.');
        },
      },
    );
  };
  // 초를 MM:SS 형태로 변환
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    if (!timerId) return;

    // 타이머 중지
    setIsRunning(false);

    // 확인 후 종료
    if (confirm('타이머를 종료하시겠습니까?')) {
      endTimer(Number(timerId), {
        onSuccess: () => {
          navigate('/');
        },
        onError: () => {
          alert('타이머 종료 실패');
          setIsRunning(true); // 실패 시 다시 실행
        },
      });
    } else {
      setIsRunning(true); // 취소 시 다시 실행
    }
  };

  const handleBack = () => {
    if (confirm('타이머를 중단하고 나가시겠습니까?')) {
      setIsRunning(false);
      navigate('/');
    }
  };

  // 진행률 계산
  const totalSeconds = minutes ? minutes * 60 : 0;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div className="max-w-sm mx-auto bg-white h-screen flex flex-col items-center justify-between px-4 pt-16 pb-6 relative">
      {/* 헤더 */}
      <div className="absolute top-4 left-4 cursor-pointer p-2" onClick={handleBack}>
        <ArrowLeft className="w-5 h-5 text-gray-800" />
      </div>
      <h1 className="text-lg font-semibold">{name || '타이머'}</h1>

      {/* 원형 프로그레스바와 타이머 */}
      <div className="relative mt-10">
        <div className="relative w-48 h-48">
          {/* 배경 원 */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            {/* 진행률 원 */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#fbbf24"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* 중앙 타이머 표시 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${isCompleted ? 'text-green-500' : 'text-gray-800'}`}
              >
                {isCompleted ? '완료!' : formatTime(remainingSeconds)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {isCompleted ? '수고하셨습니다!' : isRunning ? '진행 중' : '일시정지'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 종료하기 버튼 */}
      <button
        className={`mt-6 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        onClick={handleEnd}
        disabled={isEnding}
      >
        {isCompleted ? '완료하기' : '종료하기'}
      </button>

      {/* 바텀시트 트리거 */}
      <button
        onClick={() => setIsSheetOpen(true)}
        className="mt-auto text-sm bg-gray-800 text-white px-4 py-2 rounded-full relative"
      >
        오늘 해야 할 일을 적어보세요!!
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-3 h-3 bg-gray-800 rotate-45"></div>
      </button>

      {/* 바텀시트 */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setIsSheetOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* 시트 */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[60vh] flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* 고정된 헤더 영역 */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">오늘의 할 일</h2>
                <button onClick={() => setIsAdding(true)}>
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* 스크롤 가능한 내용 영역 */}
              <div className="overflow-y-auto px-6 pt-4 pb-6 flex-1">
                {/* 입력창 */}
                <AnimatePresence>
                  {isAdding && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2 p-3 rounded-lg bg-gray-100 mb-3"
                    >
                      <div className="w-5 h-5 min-w-5 min-h-5 bg-gray-200 rounded-md" />
                      <input
                        ref={inputRef}
                        type="text"
                        className="text-[16px] flex-1 bg-transparent outline-none text-gray-800"
                        placeholder="할 일을 적어주세요"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTodo();
                          if (e.key === 'Escape') setIsAdding(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 할일 목록 */}
                <div className="space-y-3">
                  {data?.todoList?.map(
                    (todo: { todoId: number; isDone: boolean; content: string }) => (
                      <TodoItem key={todo.todoId} text={todo.content} isChecked={todo.isDone} />
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
