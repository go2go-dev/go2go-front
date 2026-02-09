/**
 * 스티커 설정 — 에디터와 카드 모두에서 공유
 *
 * SVG 캐릭터 스티커는 Vite의 `?react` 방식으로 import합니다.
 * SVG 파일은 `@/assets/svg/stickers/` 폴더에 넣어주세요:
 *   - black.svg
 *   - dojanko.svg
 *   - tanning.svg
 *   - newyear.svg
 */
import type { FC, SVGProps } from 'react';
import type { StickerName } from '@/stores/memoStore';

// SVG 캐릭터 스티커 import
import BlackSvg from '@/assets/svg/stickers/black.svg?react';
import DojankoSvg from '@/assets/svg/stickers/dojanko.svg?react';
import TanningSvg from '@/assets/svg/stickers/tanning.svg?react';
import NewyearSvg from '@/assets/svg/stickers/newyear.svg?react';

// =====================
// 스티커 타입
// =====================

export type StickerRenderType = 'emoji' | 'svg';

export interface StickerPreset {
  name: StickerName;
  label: string;
  type: StickerRenderType;
  emoji?: string;
  Svg?: FC<SVGProps<SVGSVGElement>>;
}

// =====================
// 스티커 프리셋 목록
// =====================

export const STICKER_PRESETS: StickerPreset[] = [
  // 이모지 스티커
  { name: 'cherry', label: '태양', type: 'emoji', emoji: '🌞' },
  { name: 'chick', label: '병아리', type: 'emoji', emoji: '🐤' },
  { name: 'lemon', label: '레몬', type: 'emoji', emoji: '🍋' },
  { name: 'rainbow', label: '무지개', type: 'emoji', emoji: '🌈' },
  { name: 'popcorn', label: '팝콘', type: 'emoji', emoji: '🍿' },
  // SVG 캐릭터 스티커
  { name: 'black', label: '블랙', type: 'svg', Svg: BlackSvg },
  { name: 'dojanko', label: '도장코', type: 'svg', Svg: DojankoSvg },
  { name: 'tanning', label: '태닝', type: 'svg', Svg: TanningSvg },
  { name: 'newyear', label: '새해', type: 'svg', Svg: NewyearSvg },
];

// =====================
// 빠른 조회용 맵
// =====================

const _presetMap = new Map<StickerName, StickerPreset>(STICKER_PRESETS.map((p) => [p.name, p]));

export function getStickerPreset(name: StickerName): StickerPreset | undefined {
  return _presetMap.get(name);
}
