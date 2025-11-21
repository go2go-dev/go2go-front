import { useState } from 'react';
import { nanoid } from 'nanoid';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '@/assets/svg/Group.svg?react';
import ProfileIcon from '@/assets/svg/person.svg?react';
import { useGetUserMe } from '@/hooks/useGetUser';

// =====================
// 메모 타입 & 상수
// =====================

type MemoColor = 'pink' | 'yellow' | 'blue' | 'white';
type MemoFont = 'handwriting' | 'sans' | 'serif';

interface Memo {
  id: string;
  title: string;
  content: string;
  color: MemoColor;
  font: MemoFont;
  stickers: string[];
  createdAt: string;
}

const COLOR_CLASSES: Record<MemoColor, string> = {
  pink: 'bg-[#ffe0ec]',
  yellow: 'bg-[#fff6c2]',
  blue: 'bg-[#dfeeff]',
  white: 'bg-white',
};

const FONT_CLASSES: Record<MemoFont, string> = {
  handwriting: 'font-["UhBeeSe_hyun"]', // 나중에 폰트 import
  sans: 'font-sans',
  serif: 'font-serif',
};

const STICKER_PRESETS = ['🍒', '🌷', '⭐️', '🌙', '🐻', '💌'];

// =====================
// 메인 페이지 (기존 TimerApp 틀 + 메모장)
// =====================

export default function TimerApp() {
  const navigate = useNavigate();
  const { data: user } = useGetUserMe();

  return (
    <div className="flex-1 flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center pt-8 pb-8">
        <LogoIcon className="h-5 left-0" />
        <ProfileIcon
          onClick={() => navigate('/setting')}
          className="w-6 h-6 text-gray-600 cursor-pointer"
        />
      </div>

      {/* 가운데 영역: 스크롤 가능한 메모장 */}
      <div className="flex-1 overflow-y-auto pb-6">
        <MemoBoard />
      </div>

      {/* 하단 고정 영역 */}
      <div className="bg-white">
        {/* 먼지 치우기 영역들 */}
        <div className="bg-100 p-4 flex items-center justify-between py-4 rounded-xl">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="text-body2 text-black">먼지 치우기</div>
              <div className="text-body4 text-500 pl-3">
                {user?.name || '사용자'}님의 할 일을 적고 해치워봐요
              </div>
            </div>
          </div>
          <ChevronRight
            className="w-5 h-5 text-black cursor-pointer"
            onClick={() => navigate('/todo')}
          />
        </div>
        <div className="bg-100 mt-3 p-4 flex items-center justify-between py-4 rounded-xl">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="text-body2 text-black">단어 게임</div>
              <div className="text-body4 text-500 pl-3">기억력 테스트 하러가기</div>
            </div>
          </div>
          <ChevronRight
            className="w-5 h-5 text-black cursor-pointer"
            onClick={() => navigate('/adhd')}
          />
        </div>
      </div>
    </div>
  );
}

// =====================
// 메모장 UI
// =====================

function MemoBoard() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleCreate = () => {
    const now = new Date().toISOString();
    const emptyMemo: Memo = {
      id: nanoid(),
      title: '',
      content: '',
      color: 'white',
      font: 'sans',
      stickers: [],
      createdAt: now,
    };
    setEditingMemo(emptyMemo);
    setIsEditorOpen(true);
  };

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo);
    setIsEditorOpen(true);
  };

  const handleSave = (memo: Memo) => {
    setMemos((prev) => {
      const exists = prev.find((m) => m.id === memo.id);
      if (exists) {
        return prev.map((m) => (m.id === memo.id ? memo : m));
      }
      return [...prev, memo];
    });
    setIsEditorOpen(false);
    setEditingMemo(null);
  };

  const handleDelete = (id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-gray-200 px-4 py-4 shadow-sm">
      {/* 상단 탭(대충 “안녕 / 완료 / 미완료” 같은 느낌) */}
      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 rounded-full bg-[#35384A] text-white text-sm font-semibold">
          전체
        </button>
        <button className="px-4 py-2 rounded-full bg-[#F1F2F5] text-gray-400 text-sm font-semibold">
          완료
        </button>
        <button className="px-4 py-2 rounded-full bg-[#F1F2F5] text-gray-400 text-sm font-semibold">
          미완료
        </button>
      </div>

      {/* 메모 리스트 */}
      <div className="border border-[#38A169] rounded-3xl p-3 mb-6 bg-[#F5F6F8]">
        <MemoList memos={memos} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* 추가 버튼 */}
      <div className="flex justify-center mb-2">
        <button
          onClick={handleCreate}
          className="px-[34px] py-3 bg-[#35384A] rounded-full inline-flex justify-center items-center gap-[10px] border-none cursor-pointer"
        >
          <div className="text-center text-white text-[15px] font-semibold">추가</div>
        </button>
      </div>

      {isEditorOpen && editingMemo && (
        <MemoEditor
          memo={editingMemo}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingMemo(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

interface MemoListProps {
  memos: Memo[];
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
}

function MemoList({ memos, onEdit, onDelete }: MemoListProps) {
  if (memos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400 text-center">
        아직 메모가 없어요.
        <br />
        아래 ‘추가’ 버튼을 눌러 메모를 만들어보세요!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onClick={() => onEdit(memo)}
          onDelete={() => onDelete(memo.id)}
        />
      ))}
    </div>
  );
}

interface MemoCardProps {
  memo: Memo;
  onClick: () => void;
  onDelete: () => void;
}

function MemoCard({ memo, onClick, onDelete }: MemoCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-3 cursor-pointer group border border-gray-100 ${COLOR_CLASSES[memo.color]} bg-opacity-90 min-h-[96px]`}
      onClick={onClick}
    >
      {/* 삭제 버튼 */}
      <button
        className="absolute top-1 right-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 bg-white rounded-full px-1"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ✕
      </button>

      {/* 스티커 */}
      <div className="flex gap-1 text-lg mb-1">
        {memo.stickers.slice(0, 2).map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      {/* 내용 */}
      <div className={`text-xs leading-snug text-gray-800 line-clamp-4 ${FONT_CLASSES[memo.font]}`}>
        {memo.content || '새 메모'}
      </div>

      <div className="mt-2 text-[10px] text-gray-400">{memo.createdAt.slice(0, 10)}</div>
    </div>
  );
}

interface MemoEditorProps {
  memo: Memo;
  onClose: () => void;
  onSave: (memo: Memo) => void;
}

function MemoEditor({ memo, onClose, onSave }: MemoEditorProps) {
  const [draft, setDraft] = useState<Memo>(memo);

  const update = <K extends keyof Memo>(key: K, value: Memo[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSticker = (sticker: string) => {
    setDraft((prev) => {
      const exists = prev.stickers.includes(sticker);
      return {
        ...prev,
        stickers: exists ? prev.stickers.filter((s) => s !== sticker) : [...prev.stickers, sticker],
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#111827] text-white rounded-3xl p-4 flex flex-col gap-3">
        {/* 상단 바 */}
        <div className="flex items-center justify-between mb-1">
          <button onClick={onClose} className="text-sm text-gray-300">
            취소
          </button>
          <span className="text-sm text-gray-300">일상메모 ▾</span>
          <button onClick={() => onSave(draft)} className="text-sm font-semibold text-[#facc15]">
            저장
          </button>
        </div>

        {/* 메모 영역 */}
        <div
          className={`flex-1 rounded-2xl p-4 ${COLOR_CLASSES[draft.color]} ${FONT_CLASSES[draft.font]} text-gray-900 overflow-auto`}
        >
          <textarea
            className="w-full h-full bg-transparent outline-none resize-none text-base leading-relaxed"
            placeholder="오늘의 메모를 적어보세요 :)"
            value={draft.content}
            onChange={(e) => update('content', e.target.value)}
          />
        </div>

        {/* 커스텀 바 – 색상 / 폰트 / 스티커 */}
        <div className="mt-3 flex flex-col gap-3">
          {/* 색상 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10">색상</span>
            <div className="flex gap-2">
              {(
                [
                  ['pink', '#ffe0ec'],
                  ['yellow', '#fff6c2'],
                  ['blue', '#dfeeff'],
                  ['white', '#ffffff'],
                ] as [MemoColor, string][]
              ).map(([color, hex]) => (
                <button
                  key={color}
                  onClick={() => update('color', color)}
                  className={`w-7 h-7 rounded-full border ${
                    draft.color === color
                      ? 'ring-2 ring-offset-2 ring-yellow-300 ring-offset-[#111827]'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* 폰트 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10">폰트</span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => update('font', 'handwriting')}
                className={`px-2 py-1 rounded-full border ${
                  draft.font === 'handwriting'
                    ? 'border-yellow-300 text-yellow-200'
                    : 'border-gray-500 text-gray-300'
                } ${FONT_CLASSES.handwriting}`}
              >
                손글씨
              </button>
              <button
                onClick={() => update('font', 'sans')}
                className={`px-2 py-1 rounded-full border ${
                  draft.font === 'sans'
                    ? 'border-yellow-300 text-yellow-200'
                    : 'border-gray-500 text-gray-300'
                } font-sans`}
              >
                산세리프
              </button>
              <button
                onClick={() => update('font', 'serif')}
                className={`px-2 py-1 rounded-full border ${
                  draft.font === 'serif'
                    ? 'border-yellow-300 text-yellow-200'
                    : 'border-gray-500 text-gray-300'
                } font-serif`}
              >
                세리프
              </button>
            </div>
          </div>

          {/* 스티커 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10">스티커</span>
            <div className="flex flex-wrap gap-1">
              {STICKER_PRESETS.map((s) => {
                const active = draft.stickers.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSticker(s)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                      active ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-700 text-white'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
