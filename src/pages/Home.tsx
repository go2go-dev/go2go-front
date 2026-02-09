import React, { useSyncExternalStore } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import LogoIcon from '@/assets/svg/Group.svg?react';
import ProfileIcon from '@/assets/svg/person.svg?react';
import { useGetUserMe } from '@/hooks/useGetUser';
import { memoStore, type Memo } from '@/stores/memoStore';
import { MemoCard } from './Memocard';



export default function TimerApp() {
  const navigate = useNavigate();
  const { data: user } = useGetUserMe();

  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        <header className="flex justify-between items-center pt-8 pb-6">
          <LogoIcon className="h-5" />
          <ProfileIcon
            onClick={() => navigate('/setting')}
            className="w-6 h-6 text-gray-700 cursor-pointer"
          />
        </header>

        <main className="flex-1 overflow-y-auto pb-6 space-y-6">
          {/* <UrgentTodoSection /> */}
          <MemoBoard />
        </main>

        <footer className="pb-5">
          <div className="bg-white">
            <div className="bg-[#F5F6F8] mt-2 px-4 py-4 flex items-center justify-between rounded-xl">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="text-[14px] font-medium text-black">단어 게임</div>
                </div>
                <div className="text-[12px] text-[#9CA3AF] mt-1">할 일을 적고 해치워봐요</div>
              </div>
              <ChevronRight
                className="w-5 h-5 text-black cursor-pointer"
                onClick={() => navigate('/adhd')}
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

type UrgentTodo = { id: number; text: string; checked: boolean };

function UrgentTodoSection() {
  const [todos, setTodos] = React.useState<UrgentTodo[]>([
    { id: 1, text: '급한 불을 끄자!', checked: true },
    { id: 2, text: '급한불을 끄자', checked: false },
  ]);

  const topTwo = todos.slice(0, 2);

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)));
  };

  return (
    <section className="w-full">
      <div className="bg-[#F5F6F8] rounded-xl px-4 py-3.5">
        <h2 className="text-[14px] font-semibold text-black mb-3">급한 불을 끄자!</h2>

        <div className="flex flex-col gap-2">
          {topTwo.map((todo) => (
            <button
              key={todo.id}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left bg-white ${
                todo.checked ? 'shadow-sm' : ''
              }`}
              onClick={() => toggleTodo(todo.id)}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  todo.checked ? 'bg-[#23263B] border-[#23263B]' : 'bg-white border-gray-300'
                }`}
              >
                {todo.checked && (
                  <span className="w-2 h-3 border-[2px] border-white border-l-transparent border-b-transparent rotate-45" />
                )}
              </div>

              <span
                className={`text-[13px] ${todo.checked ? 'text-black font-semibold' : 'text-gray-500'}`}
              >
                {todo.text}
              </span>
            </button>
          ))}

          {topTwo.length === 0 && (
            <div className="text-xs text-gray-400 py-2">급한 일을 즐겨찾기에 추가해보세요.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function MemoBoard() {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<'all' | 'completed' | 'incomplete'>('all');

  const memos = useSyncExternalStore(memoStore.subscribe, memoStore.get, memoStore.get);

  const filteredMemos = React.useMemo(() => {
    if (filter === 'completed') {
      return memos.filter((m) => m.completed);
    }
    if (filter === 'incomplete') {
      return memos.filter((m) => !m.completed);
    }
    return memos;
  }, [memos, filter]);

  const handleCreate = () => {
    navigate('/memo/new');
  };

  const handleToggleComplete = (id: string) => {
    memoStore.toggleComplete(id);
  };

  const handleDelete = (id: string) => {
    memoStore.remove(id);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-[12px] font-semibold ${
            filter === 'all' ? 'bg-[#35384A] text-white' : 'bg-[#F1F2F5] text-gray-400'
          }`}
        >
          모두 보기
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-[12px] font-semibold ${
            filter === 'completed' ? 'bg-[#35384A] text-white' : 'bg-[#F1F2F5] text-gray-400'
          }`}
        >
          완료
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          className={`px-4 py-2 rounded-full text-[12px] font-semibold ${
            filter === 'incomplete' ? 'bg-[#35384A] text-white' : 'bg-[#F1F2F5] text-gray-400'
          }`}
        >
          미완료
        </button>
      </div>

      <MemoList
        memos={filteredMemos}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />

      <div className="flex justify-center mt-4 mb-2">
        <button
          onClick={handleCreate}
          className="px-[34px] py-3 bg-[#35384A] rounded-full inline-flex justify-center items-center border-none cursor-pointer shadow-sm"
        >
          <span className="text-center text-white text-[15px] font-semibold">추가</span>
        </button>
      </div>
    </div>
  );
}

function MemoList({
  memos,
  onToggleComplete,
  onDelete,
}: {
  memos: Memo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (memos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400 text-center">
        아직 메모가 없어요.
        <br />
        아래 '추가' 버튼을 눌러 메모를 만들어보세요!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-2">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
