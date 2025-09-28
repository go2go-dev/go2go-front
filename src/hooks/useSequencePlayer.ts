// --------------------------------------------------
// Hook: Timed sequence player (fixed)

import { useCallback, useEffect, useRef, useState } from "react";

// --------------------------------------------------
export function useSequencePlayer<T>({
  sequence,
  stepMs,
  autoStart,
  onFinished,
}: {
  sequence: T[];
  stepMs: number;
  autoStart?: boolean;
  onFinished?: () => void;
}) {
  const [index, setIndex] = useState<number>(-1);
  const timerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (nextIndex: number) => {
      if (nextIndex >= sequence.length) {
        stop();
        onFinished?.();
        return;
      }
      setIndex(nextIndex);
      timerRef.current = window.setTimeout(() => tick(nextIndex + 1), stepMs);
    },
    [sequence.length, stepMs, onFinished, stop],
  );

  const start = useCallback(() => {
    stop();
    if (sequence.length === 0) return;
    tick(0);
  }, [sequence.length, tick, stop]);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    if (autoStart) start();
  }, [autoStart, start]);

  return {
    index,
    current: index >= 0 && index < sequence.length ? sequence[index] : undefined,
    isRunning: index >= 0 && index < sequence.length,
    start,
    stop,
    reset: () => setIndex(-1),
  };
}
