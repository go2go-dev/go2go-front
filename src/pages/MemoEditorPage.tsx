import React, { useRef, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { X, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { apiPost } from '@/api/fetchWithAuth';
import {
  memoStore,
  type Memo,
  type MemoColor,
  type MemoFont,
  type StickerInstance,
  type StickerName,
} from '@/stores/memoStore';
import { STICKER_PRESETS } from './StickerPresets';
import { StickerRenderer } from './StickerRenderer';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// =====================
// API
// =====================

interface StickerPayload {
  name: string;
  posX: number;
  posY: number;
}

interface CreateTodoRequest {
  timerId: number;
  content: string;
  color: string;
  fontType: string;
  stickers: StickerPayload[];
}

async function createTodoApi(payload: CreateTodoRequest) {
  return apiPost(`${API_BASE_URL}/api/todos`, payload);
}

// =====================
// 스타일 매핑
// =====================

const COLOR_CLASSES: Record<MemoColor, string> = {
  pink: 'bg-[#FFE4F4]',
  yellow: 'bg-[#FFF7C5]',
  blue: 'bg-[#DFF1FF]',
  white: 'bg-white',
};

const COLOR_OPTIONS: { color: MemoColor; hex: string }[] = [
  { color: 'white', hex: '#FFFFFF' },
  { color: 'blue', hex: '#B8DEFF' },
  { color: 'yellow', hex: '#FFF27A' },
  { color: 'pink', hex: '#D1D5DB' },
];

const FONT_CLASSES: Record<MemoFont, string> = {
  kim: 'font-kim',
  kkonkon: 'font-kkonkon',
  memoment: 'font-memoment',
};

// =====================
// 메모장 비율 상수 — 카드와 동일하게 유지
// =====================

/**
 * 홈 카드와 에디터 메모장의 비율을 동일하게 맞추기 위한 aspect-ratio.
 * 카드가 grid-cols-2 + gap-3 안에서 대략 정사각형에 가까우므로
 * 에디터도 동일 비율을 사용합니다.
 *
 * 만약 카드의 min-h를 변경하면 여기도 같이 맞춰주세요.
 */
export const MEMO_ASPECT_RATIO = 1; // width : height = 1 : 1 (정사각형)

// =====================
// 좌표 변환 유틸
// =====================

function pxToRatio(px: number, canvasSize: number, stickerSize: number): number {
  const max = canvasSize - stickerSize;
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, px / max));
}

const EDITOR_STICKER_SIZE = 120;

// =====================
// 스티커 선택 바텀시트
// =====================

function StickerPickerBottomSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (name: StickerName) => void;
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[50] bg-black/40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl px-5 pt-5 pb-8">
        <div className="text-[15px] font-semibold text-black mb-4">스티커 선택</div>

        <div className="grid grid-cols-3 gap-3">
          {STICKER_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onPick(p.name)}
              className="aspect-square rounded-2xl bg-[#F5F6F8] hover:bg-[#ECEDF0] active:bg-[#E2E3E8] flex items-center justify-center transition-colors"
            >
              <StickerRenderer name={p.name} size={64} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// =====================
// 메모 에디터 페이지
// =====================

export default function MemoEditorPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const isNew = params.id === 'new' || !params.id;

  const initialMemo = (() => {
    if (isNew) return memoStore.createEmpty();
    const found = memoStore.find(params.id!);
    return found ?? memoStore.createEmpty();
  })();

  const [draft, setDraft] = useState<Memo>(initialMemo);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const createTodoMutation = useMutation({
    mutationFn: createTodoApi,
    onSuccess: (data) => console.log('✅ TODO 생성 성공', data),
    onError: (error) => console.error('❌ TODO 생성 실패', error),
  });

  const mapMemoToTodoPayload = useCallback((memo: Memo): CreateTodoRequest => {
    const el = canvasRef.current;
    const rect = el?.getBoundingClientRect();
    const canvasW = rect?.width ?? 300;
    const canvasH = rect?.height ?? 300;

    return {
      timerId: 0,
      content: memo.content,
      color: memo.color,
      fontType: memo.font,
      stickers: memo.stickers.map((s) => ({
        name: s.name,
        posX: pxToRatio(s.posX, canvasW, EDITOR_STICKER_SIZE),
        posY: pxToRatio(s.posY, canvasH, EDITOR_STICKER_SIZE),
      })),
    };
  }, []);

  const update = <K extends keyof Memo>(key: K, value: Memo[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const addStickerToCenter = (name: StickerName) => {
    const el = canvasRef.current;
    const rect = el?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 140;
    const centerY = rect ? rect.height / 2 : 140;

    const instance: StickerInstance = {
      id: nanoid(),
      name,
      posX: centerX - EDITOR_STICKER_SIZE / 2,
      posY: centerY - EDITOR_STICKER_SIZE / 2,
      scale: 1,
      rotate: 0,
    };

    setDraft((prev) => ({ ...prev, stickers: [...prev.stickers, instance] }));
    setSelectedStickerId(instance.id);
  };

  const removeSticker = (id: string) => {
    setDraft((prev) => ({ ...prev, stickers: prev.stickers.filter((s) => s.id !== id) }));
    setSelectedStickerId((prev) => (prev === id ? null : prev));
  };

  const updateStickerPos = (id: string, nextX: number, nextY: number) => {
    setDraft((prev) => ({
      ...prev,
      stickers: prev.stickers.map((s) => (s.id === id ? { ...s, posX: nextX, posY: nextY } : s)),
    }));
  };

  // --- 드래그 ---
  const dragStateRef = useRef<{
    id: string;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    pointerId: number;
  } | null>(null);

  const onStickerPointerDown = (e: React.PointerEvent, sticker: StickerInstance) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStickerId(sticker.id);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    dragStateRef.current = {
      id: sticker.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: sticker.posX,
      startY: sticker.posY,
      pointerId: e.pointerId,
    };
  };

  const onStickerPointerMove = (e: React.PointerEvent) => {
    const state = dragStateRef.current;
    if (!state) return;

    const dx = e.clientX - state.startClientX;
    const dy = e.clientY - state.startClientY;
    const el = canvasRef.current;
    const rect = el?.getBoundingClientRect();

    let nextX = state.startX + dx;
    let nextY = state.startY + dy;

    if (rect) {
      nextX = Math.max(0, Math.min(rect.width - EDITOR_STICKER_SIZE, nextX));
      nextY = Math.max(0, Math.min(rect.height - EDITOR_STICKER_SIZE, nextY));
    }

    updateStickerPos(state.id, nextX, nextY);
  };

  const onStickerPointerUp = () => {
    dragStateRef.current = null;
  };

  // --- 저장 ---
  const onSave = async () => {
    const el = canvasRef.current;
    const rect = el?.getBoundingClientRect();
    const canvasW = rect?.width ?? 300;
    const canvasH = rect?.height ?? 300;

    const normalizedDraft: Memo = {
      ...draft,
      stickers: draft.stickers.map((s) => ({
        ...s,
        posX: pxToRatio(s.posX, canvasW, EDITOR_STICKER_SIZE),
        posY: pxToRatio(s.posY, canvasH, EDITOR_STICKER_SIZE),
      })),
    };

    memoStore.upsert(normalizedDraft);

    const payload = mapMemoToTodoPayload(draft);
    createTodoMutation.mutate(payload);

    navigate(-1);
  };

  const onCancel = () => navigate(-1);

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-md px-5 pt-6 pb-10">
        {/* 상단 바 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onCancel} className="p-2 -ml-2 rounded-xl hover:bg-black/5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button onClick={onSave} className="text-sm font-semibold text-[#f59e0b]">
            저장
          </button>
        </div>

        {/* 메모 캔버스 — aspect-ratio로 카드와 비율 동일하게 */}
        <div
          ref={canvasRef}
          className={`relative rounded-2xl p-5 ${COLOR_CLASSES[draft.color]} ${FONT_CLASSES[draft.font]} text-gray-900 overflow-hidden`}
          style={{ aspectRatio: `${MEMO_ASPECT_RATIO}` }}
          onPointerMove={onStickerPointerMove}
          onPointerUp={onStickerPointerUp}
          onPointerCancel={onStickerPointerUp}
          onClick={() => setSelectedStickerId(null)}
        >
          <textarea
            className="w-full h-full bg-transparent outline-none resize-none text-[18px] leading-relaxed relative z-[1] text-center"
            placeholder="오늘의 메모를 적어보세요 :)"
            value={draft.content}
            onChange={(e) => update('content', e.target.value)}
          />

          {/* 스티커 레이어 */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            {draft.stickers.map((s) => {
              const isSelected = selectedStickerId === s.id;

              return (
                <div
                  key={s.id}
                  className="absolute pointer-events-auto touch-none"
                  style={{
                    left: s.posX,
                    top: s.posY,
                    width: EDITOR_STICKER_SIZE,
                    height: EDITOR_STICKER_SIZE,
                    transform: `scale(${s.scale}) rotate(${s.rotate}deg)`,
                    transformOrigin: 'center',
                  }}
                  onPointerDown={(e) => onStickerPointerDown(e, s)}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center rounded-2xl ${
                      isSelected ? 'ring-2 ring-yellow-300 ring-offset-1' : ''
                    }`}
                  >
                    <StickerRenderer name={s.name} size={EDITOR_STICKER_SIZE} />
                  </div>

                  {isSelected && (
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#111827] text-white border border-white/20 flex items-center justify-center shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSticker(s.id);
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 꾸미기 바 */}
        <div className="mt-5 flex flex-col gap-4">
          {/* 색상 */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400 w-10 shrink-0">색상</span>
            <div className="flex gap-2.5">
              {COLOR_OPTIONS.map(({ color, hex }) => (
                <button
                  key={color}
                  onClick={() => update('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    draft.color === color ? 'border-[#111827] scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* 폰트 */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400 w-10 shrink-0">폰트</span>
            <div className="flex gap-2 text-[13px]">
              <button
                onClick={() => update('font', 'kim')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  draft.font === 'kim'
                    ? 'bg-[#23263B] text-white border-[#23263B]'
                    : 'bg-white text-gray-500 border-gray-200'
                } ${FONT_CLASSES.kim}`}
              >
                WILDgag
              </button>
              <button
                onClick={() => update('font', 'kkonkon')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  draft.font === 'kkonkon'
                    ? 'bg-[#23263B] text-white border-[#23263B]'
                    : 'bg-white text-gray-500 border-gray-200'
                } ${FONT_CLASSES.kkonkon}`}
              >
                콘콘체
              </button>
              <button
                onClick={() => update('font', 'memoment')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  draft.font === 'memoment'
                    ? 'bg-[#23263B] text-white border-[#23263B]'
                    : 'bg-white text-gray-500 border-gray-200'
                } ${FONT_CLASSES.memoment}`}
              >
                메모먼트
              </button>
            </div>
          </div>

          {/* 스티커 */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400 w-10 shrink-0">스티커</span>
            <button
              type="button"
              onClick={() => setIsStickerPickerOpen(true)}
              className="px-4 py-2 rounded-full bg-white text-gray-500 text-[13px] border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              스티커추가 +
            </button>
          </div>
        </div>

        <StickerPickerBottomSheet
          open={isStickerPickerOpen}
          onClose={() => setIsStickerPickerOpen(false)}
          onPick={(name) => {
            setIsStickerPickerOpen(false);
            addStickerToCenter(name);
          }}
        />
      </div>
    </div>
  );
}
