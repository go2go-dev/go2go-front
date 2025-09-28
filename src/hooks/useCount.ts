// --------------------------------------------------
// Hook: Countdown (ms)

import { useCallback, useEffect, useRef, useState } from "react";

// --------------------------------------------------
export function useCountdown(totalMs: number, opts?: { autoStart?: boolean; onEnd?: () => void }) {
  const { autoStart, onEnd } = opts || {};
  const [remaining, setRemaining] = useState<number>(autoStart ? totalMs : 0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const totalRef = useRef<number>(totalMs);

  const stop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const frame = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startRef.current;
    const left = Math.max(0, totalRef.current - elapsed);
    setRemaining(left);
    if (left <= 0) {
      stop();
      onEnd?.();
      return;
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [onEnd, stop]);

  const start = useCallback(
    (ms?: number) => {
      stop();
      totalRef.current = ms ?? totalRef.current;
      startRef.current = performance.now();
      setRemaining(totalRef.current);
      rafRef.current = requestAnimationFrame(frame);
    },
    [frame, stop],
  );

  useEffect(() => stop, [stop]);
  useEffect(() => {
    if (autoStart) start(totalMs);
  }, [autoStart, start, totalMs]);

  return {
    remainingMs: remaining,
    isRunning: remaining > 0 && remaining < totalRef.current,
    start,
    stop,
    reset: () => {
      stop();
      setRemaining(0);
      totalRef.current = totalMs;
    },
  };
}
