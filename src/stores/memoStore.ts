import { nanoid } from 'nanoid';

export type MemoColor = 'pink' | 'yellow' | 'blue' | 'white';
export type MemoFont =  'kim' | 'kkonkon' | 'memoment';
export type StickerName =
  | 'sun'
  | 'wind'
  | 'chick'
  | 'lemon'
  | 'rainbow'
  | 'popcorn'
  | 'cherry'
  | 'tulip'
  | 'star'
  | 'moon'
  | 'bear'
  | 'letter';

export interface StickerInstance {
  id: string;
  name: StickerName;
  posX: number;
  posY: number;
  scale: number;
  rotate: number;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  color: MemoColor;
  font: MemoFont;
  stickers: StickerInstance[];
  createdAt: string;
  completed?: boolean; // 추가된 필드
}

const seed: Memo[] = [
  {
    id: nanoid(),
    title: '자격증 공부하기',
    content: '자격증 공부하기',
    color: 'pink',
    font: 'kim',
    stickers: [],
    createdAt: new Date().toISOString(),
    completed: false,
  },
  {
    id: nanoid(),
    title: '자격증 공부하기',
    content: '자격증 공부하기',
    color: 'blue',
    font: 'kim',
    stickers: [],
    createdAt: new Date().toISOString(),
    completed: false,
  },
  {
    id: nanoid(),
    title: '쿠팡에서 오렌지주스,\n강아지용품 시키기',
    content: '쿠팡에서 오렌지주스,\n강아지용품 시키기',
    color: 'yellow',
    font: 'kim',
    stickers: [],
    createdAt: new Date().toISOString(),
    completed: false,
  },
];

type Listener = () => void;

let memosState: Memo[] = seed;
const listeners = new Set<Listener>();

export const memoStore = {
  get() {
    return memosState;
  },
  set(next: Memo[]) {
    memosState = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  upsert(memo: Memo) {
    const exists = memosState.some((m) => m.id === memo.id);
    const next = exists
      ? memosState.map((m) => (m.id === memo.id ? memo : m))
      : [...memosState, memo];
    memoStore.set(next);
  },
  remove(id: string) {
    memoStore.set(memosState.filter((m) => m.id !== id));
  },
  // 추가된 메서드: 특정 필드만 업데이트
  update(id: string, updates: Partial<Memo>) {
    const next = memosState.map((m) => (m.id === id ? { ...m, ...updates } : m));
    memoStore.set(next);
  },
  // 완료 상태 토글
  toggleComplete(id: string) {
    const memo = memosState.find((m) => m.id === id);
    if (memo) {
      memoStore.update(id, { completed: !memo.completed });
    }
  },
  createEmpty(): Memo {
    return {
      id: nanoid(),
      title: '',
      content: '',
      color: 'white',
      font: 'kim',
      stickers: [],
      createdAt: new Date().toISOString(),
      completed: false,
    };
  },
  find(id: string) {
    return memosState.find((m) => m.id === id) ?? null;
  },
};
