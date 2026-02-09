import React, { useState, useRef, useEffect } from 'react';

import DoneIcon from '@/assets/svg/done.svg?react';
import type { Memo, MemoColor, MemoFont } from '@/stores/memoStore';
import { StickerRenderer } from './StickerRenderer';
import { MEMO_ASPECT_RATIO } from './MemoEditorPage';

const COLOR_CLASSES: Record<MemoColor, string> = {
  pink: 'bg-[#FFE4F4]',
  yellow: 'bg-[#FFF7C5]',
  blue: 'bg-[#DFF1FF]',
  white: 'bg-white',
};

const FONT_CLASSES: Record<MemoFont, string> = {
  kim: 'font-kim',
  kkonkon: 'font-kkonkon',
  memoment: 'font-memoment',
};

const CARD_STICKER_SIZE = 56;

/** 비율(0~1) → 카드 기준 px */
function ratioToPx(ratio: number, containerSize: number, stickerSize: number): number {
  return ratio * (containerSize - stickerSize);
}

// function FlameIcon() {
//   return (
//     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F5F5]">
//       <span className="text-[14px]">🔥</span>
//     </span>
//   );
// }

interface MemoCardProps {
  memo: Memo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MemoCard({ memo, onToggleComplete, onDelete }: MemoCardProps) {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 카드 크기 측정 (스티커 비율 좌표 → px 변환용)
  const [cardSize, setCardSize] = useState({ w: 160, h: 160 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCardSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (isSwiping || translateX !== 0) return;
    onToggleComplete(memo.id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (diff < 0) {
      setTranslateX(diff);
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    if (translateX < -80) {
      setTranslateX(-300);
      setTimeout(() => onDelete(memo.id), 300);
    } else {
      setTranslateX(0);
      setTimeout(() => setIsSwiping(false), 300);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* 삭제 배경 */}
      <div className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end pr-6">
        <span className="text-white text-xl font-bold">삭제</span>
      </div>

      {/* 메모 카드 — aspect-ratio로 에디터와 비율 동일하게 */}
      <div
        ref={cardRef}
        className={`relative rounded-2xl p-3 cursor-pointer border border-gray-100 ${COLOR_CLASSES[memo.color]} ${FONT_CLASSES[memo.font]} bg-opacity-90 flex flex-col justify-between transition-transform duration-300 ease-out`}
        style={{
          aspectRatio: `${MEMO_ASPECT_RATIO}`,
          transform: `translateX(${translateX}px)`,
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 완료 표시 */}
        {memo.completed && (
          <>
            <div className="absolute inset-0 bg-black/40 rounded-2xl z-[4]" />
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-[5]">
              <DoneIcon className="w-30 h-30" />
            </div>
          </>
        )}

        {/* 스티커 레이어 — 비율 좌표(0~1)를 카드 크기 기준 px로 변환 */}
        {memo.stickers && memo.stickers.length > 0 && (
          <div className="absolute inset-0 z-[2] pointer-events-none">
            {memo.stickers.map((s) => {
              const left = ratioToPx(s.posX, cardSize.w, CARD_STICKER_SIZE);
              const top = ratioToPx(s.posY, cardSize.h, CARD_STICKER_SIZE);

              return (
                <div
                  key={s.id}
                  className="absolute"
                  style={{
                    left,
                    top,
                    width: CARD_STICKER_SIZE,
                    height: CARD_STICKER_SIZE,
                  }}
                >
                  <StickerRenderer name={s.name} size={CARD_STICKER_SIZE} />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex-1 flex items-center justify-center text-center relative z-[1]">
          <div className="text-body2 font-weight text-gray-900 whitespace-pre-line">
            {memo.content || '새 메모'}
          </div>
        </div>

        {/* <div className="mt-3 flex justify-end relative z-[1]">
          <FlameIcon />
        </div> */}
      </div>
    </div>
  );
}
