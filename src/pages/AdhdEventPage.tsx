import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// --------------------------------------------------
// Utils
// --------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --------------------------------------------------
// Hook: Timed sequence player (fixed)
// --------------------------------------------------
function useSequencePlayer<T>({
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

// --------------------------------------------------
// Hook: Countdown (ms)
// --------------------------------------------------
function useCountdown(totalMs: number, opts?: { autoStart?: boolean; onEnd?: () => void }) {
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

// --------------------------------------------------
// Types & constants
// --------------------------------------------------

type Phase = 'idle' | 'memorize' | 'recall' | 'result';

const WORD_POOL = [
  '사과',
  '바다',
  '하늘',
  '책상',
  '코끼리',
  '초콜릿',
  '지하철',
  '노트북',
  '햇살',
  '비누',
  '우산',
  '달리기',
  '강아지',
  '사막',
  '컵라면',
  '유리',
  '바람',
  '연필',
  '셔츠',
  '구름',
  '커피',
  '소파',
  '카메라',
  '종이',
  '라디오',
  '양말',
  '무지개',
  '치즈',
  '버스',
  '나무',
];

// --------------------------------------------------
// Component
// --------------------------------------------------
export default function AdhdTestPage() {
  const targetCount = 8;
  const distractorCount = 16;
  const memorizeStepMs = 500; // 0.5s
  const recallLimitMs = 20_000; // 20s

  const [phase, setPhase] = useState<Phase>('idle');

  const { targets, options } = useMemo(() => {
    const shuffled = shuffle(WORD_POOL);
    const targets = shuffled.slice(0, targetCount);
    const distractors = shuffled.slice(targetCount, targetCount + distractorCount);
    const options = shuffle([...targets, ...distractors]);
    return { targets, options };
  }, [targetCount, distractorCount]);

  const seq = useSequencePlayer<string>({
    sequence: targets,
    stepMs: memorizeStepMs,
    // autoStart removed; we'll control start via effect to play nice with React 18 StrictMode
    onFinished: () => setPhase('recall'),
  });

  const {
    remainingMs,
    start: startCountdown,
    stop: stopCountdown,
  } = useCountdown(recallLimitMs, {
    autoStart: false,
    onEnd: () => {
      handleSubmit();
    },
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number | null>(null);

  const toggleSelect = useCallback((w: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase === 'recall') {
      startCountdown(recallLimitMs);
    } else {
      stopCountdown();
    }
  }, [phase, startCountdown, stopCountdown]);

  const startTest = () => {
    setSelected(new Set());
    setScore(null);
    setPhase('memorize');
    // sequence will start in the effect above when phase === 'memorize'
  };

  // Ensure sequence plays reliably in React 18 StrictMode (dev) by starting/stopping via effect
  useEffect(() => {
    if (phase === 'memorize') {
      seq.reset();
      seq.start();
    } else {
      seq.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSubmit = () => {
    if (phase !== 'recall') return;
    const correct = targets.filter((t) => selected.has(t)).length;
    setScore(correct);
    setPhase('result');
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">ADHD 단어 기억 테스트</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        8개의 단어가 0.5초 간격으로 순서대로 표시됩니다. 모두 본 뒤, 기억나는 단어를 제한시간 20초
        안에 선택해 제출하세요.
      </p>

      {phase === 'idle' && (
        <div className="mt-6">
          <button
            onClick={startTest}
            className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 active:scale-[0.99]"
          >
            테스트 시작하기
          </button>
        </div>
      )}

      {phase === 'memorize' && (
        <div className="mt-8 rounded-2xl border border-zinc-200 p-10 text-center">
          <div className="text-5xl font-extrabold tabular-nums">{seq.current ?? '준비...'}</div>
          <div className="mt-3 text-sm text-zinc-500">
            {seq.isRunning ? `${seq.index! + 1} / ${targets.length}` : ''}
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">기억나는 단어를 모두 선택하세요</h2>
            <CountdownBadge ms={remainingMs} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {options.map((w) => {
              const active = selected.has(w);
              return (
                <button
                  key={w}
                  onClick={() => toggleSelect(w)}
                  aria-pressed={active}
                  className={[
                    'rounded-2xl border px-4 py-3 text-center font-semibold transition',
                    active
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-zinc-200 bg-white hover:border-zinc-300',
                  ].join(' ')}
                >
                  {w}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 active:scale-[0.99]"
            >
              제출하기
            </button>
            <span className="text-sm text-zinc-600">
              선택: {selected.size}개 / 정답 {targets.length}개
            </span>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">결과</h2>
          <p className="mt-1 text-zinc-700">
            정답 {targets.length}개 중 <b>{score}</b>개 맞춤
          </p>

          <details className="mt-3">
            <summary className="cursor-pointer select-none text-sm text-zinc-600 hover:text-zinc-800">
              정답 보기
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {targets.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </details>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setPhase('idle')}
              className="rounded-2xl bg-zinc-200 px-4 py-2 text-zinc-900 hover:bg-zinc-300"
            >
              처음으로
            </button>
            <button
              onClick={startTest}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              다시 테스트
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownBadge({ ms }: { ms: number }) {
  const seconds = Math.ceil(ms / 1000);
  return (
    <div
      aria-live="polite"
      className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-sm tabular-nums"
    >
      남은 시간: <b className="ml-1">{Math.max(0, seconds)}초</b>
    </div>
  );
}
