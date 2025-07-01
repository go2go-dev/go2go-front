import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import TodoItem from '@/components/todo/TodoItem';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEndTimer } from '@/hooks/useEndTimer';
import { useTimerDetail } from '@/hooks/useTimerDetail';
import { useAddTodo } from '@/hooks/useAddTodo';
import timerChar2 from '@/assets/gif/timer2.gif';

export default function TimerDetail() {
  const { timerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, minutes } = location.state || {};
  const { data } = useTimerDetail(timerId ? Number(timerId) : undefined);

  const [remainingSeconds, setRemainingSeconds] = useState(minutes ? minutes * 60 : 0);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: endTimer, isPending: isEnding } = useEndTimer();
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: addTodoMutation } = useAddTodo();

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

  useEffect(() => {
    if (isCompleted) alert('타이머가 완료되었습니다! 🎉');
  }, [isCompleted]);

  useEffect(() => {
    if (isAdding && inputRef.current) inputRef.current.focus();
  }, [isAdding]);

  const handleAddTodo = () => {
    if (!inputValue.trim() || !timerId) return;

    addTodoMutation(
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

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const handleBack = () => {
    if (confirm('타이머를 중단하고 나가시겠습니까?')) {
      setIsRunning(false);
      navigate('/');
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white h-screen flex flex-col items-center  pt-5 pb-6 relative">
      <div className="relative w-full">
        <div className="absolute left-4 top-2 cursor-pointer" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </div>
        <h1 className="text-lg font-semibold text-center">{name || '타이머'}</h1>
      </div>

      <div className="mb-2 pt-20">
        <img src={timerChar2} alt="캐릭터" className="w-60 h-60 mx-auto" />
      </div>

      <div className="relative">
        <div className="relative w-48 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-800">
              {isCompleted ? '완료!' : formatTime(remainingSeconds)}
            </div>
          </div>
        </div>
      </div>

      <button
        className={`mt-6 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        onClick={handleEnd}
        disabled={isEnding}
      >
        {isCompleted ? '완료하기' : '종료하기'}
      </button>

      {/* 바텀시트 */}
      <AnimatePresence>
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-100 rounded-t-2xl z-50 max-h-[60vh] flex flex-col shadow-xl"
          initial={{ y: '65%' }}
          animate={{ y: isSheetExpanded ? 0 : '65%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <div
            className="w-20 h-1.5 bg-500 rounded-full mx-auto mt-6 cursor-pointer"
            onClick={() => setIsSheetExpanded((prev) => !prev)}
          />

          <div className="pt-10 p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-body4 font-semibold">지금 생각난 할 일을 적어보세요</h2>
            <button onClick={() => setIsAdding(true)}>
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 pt-4 pb-6 flex-1">
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-white mb-3"
                >
                  <div className="w-5 h-5 bg-gray-200 rounded-md" />
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

            <div className="space-y-3">
              {data?.todoList?.map((todo: { todoId: number; isDone: boolean; content: string }) => (
                <TodoItem key={todo.todoId} text={todo.content} isChecked={todo.isDone} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
