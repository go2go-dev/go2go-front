/**
 * StickerRenderer — 이모지/SVG 스티커를 크기에 맞게 렌더링하는 공용 컴포넌트
 *
 * 에디터(큰 사이즈)와 카드(작은 사이즈) 모두에서 사용합니다.
 * 이렇게 하면 에디터와 카드의 스티커 비율이 동일하게 유지됩니다.
 */
import type { StickerName } from '@/stores/memoStore';
import { getStickerPreset } from './StickerPresets';

interface StickerRendererProps {
  name: StickerName;
  /** 렌더링할 크기 (px). 에디터에서는 56, 카드에서는 28 등 */
  size: number;
  className?: string;
}

export function StickerRenderer({ name, size, className = '' }: StickerRendererProps) {
  const preset = getStickerPreset(name);

  if (!preset) {
    // fallback
    const fontSize = Math.round(size * 0.7);
    return (
      <span
        className={`select-none flex items-center justify-center ${className}`}
        style={{ width: size, height: size, fontSize }}
      >
        ⭐
      </span>
    );
  }

  if (preset.type === 'svg' && preset.Svg) {
    const Svg = preset.Svg;
    return <Svg className={className} style={{ width: size, height: size }} />;
  }

  // 이모지
  const fontSize = Math.round(size);
  return (
    <span
      className={`select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size, fontSize }}
    >
      {preset.emoji ?? '⭐'}
    </span>
  );
}
