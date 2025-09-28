import ResultView from '@/components/eventadhd/ResultView';
import { useEffect, useMemo, useState } from 'react';
import MeonjiSvg from '@/assets/svg/meonjiTest.svg?react';

// 설정값들
const CONFIG = {
  TARGET_COUNT: 8,
  DISTRACTOR_COUNT: 17,
  WORD_SHOW_TIME: 500, // 0.5초
  RECALL_TIME: 20000, // 20초
};

const WORDS = [
  '빌런',
  '떡상',
  '짱구',
  '철컹',
  '흑역',
  '댕댕',
  '킹받',
  '몰루',
  '현타',
  '웃참',
  '핫걸',
  '쩝쩝',
  '만렙',
  '노답',
  '폭망',
  '개추',
  '찐텐',
  '꿀잼',
  '노잼',
  '급식',
  '아싸',
  '띵꼭',
  '인싸',
  '꼬북',
  '본새',
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type Phase = 'ready' | 'showing' | 'selecting' | 'finished';

export default function AdhdTestPage() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0); // 게임 재시작할 때 단어 다시 섞기용

  // 게임할 때마다 새로운 단어들 생성
  const { targetWords, allOptions } = useMemo(() => {
    const shuffled = shuffle(WORDS);
    const targets = shuffled.slice(0, CONFIG.TARGET_COUNT);
    const distractors = shuffled.slice(
      CONFIG.TARGET_COUNT,
      CONFIG.TARGET_COUNT + CONFIG.DISTRACTOR_COUNT,
    );
    const options = shuffle([...targets, ...distractors]);
    return { targetWords: targets, allOptions: options };
  }, [gameKey]);

  // 게임 시작
  const startGame = () => {
    setGameKey((k) => k + 1); // ← 새 라운드마다 셔플 트리거
    setSelectedWords(new Set());
    setCurrentWordIndex(0);
    setPhase('showing');
  };

  // 단어 보여주기 단계
  useEffect(() => {
    if (phase !== 'showing') return;

    const timer = setTimeout(() => {
      const nextIndex = currentWordIndex + 1;
      if (nextIndex >= targetWords.length) {
        // 모든 단어를 다 보여줬으면 선택 단계로
        setPhase('selecting');
        setTimeLeft(CONFIG.RECALL_TIME);
      } else {
        setCurrentWordIndex(nextIndex);
      }
    }, CONFIG.WORD_SHOW_TIME);

    return () => clearTimeout(timer);
  }, [phase, currentWordIndex, targetWords.length]);

  // 선택 단계 타이머
  useEffect(() => {
    if (phase !== 'selecting' || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 100);
    }, 100);

    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  // 시간 종료시 자동 제출
  useEffect(() => {
    if (phase === 'selecting' && timeLeft <= 0) {
      finishGame();
    }
  }, [phase, timeLeft]);

  // 단어 선택/해제
  const toggleWord = (word: string) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      newSelected.add(word);
    }
    setSelectedWords(newSelected);
  };

  // 게임 완료
  const finishGame = () => {
    const correctCount = targetWords.filter((word) => selectedWords.has(word)).length;
    setScore(correctCount);
    setPhase('finished');
  };

  // 새 게임 시작
  const restartGame = () => {
    setGameKey((prev) => prev + 1);
    setPhase('ready');
  };

  const formatTime = (ms: number) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="mx-auto max-w-sm px-6 min-h-screen flex flex-col">
      {/* 헤더: 가운데 정렬 */}
      {phase === 'ready' && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center gap-8 px-6">
          {/* 헤더 */}
          <div>
            <h1 className="text-h2 tracking-tight">ADHD 단어 기억 테스트!</h1>
            <p className="mt-2 text-base text-muted-foreground">
              총 {CONFIG.TARGET_COUNT}개의 단어를 기억해보세요
            </p>
          </div>

          {/* 마스코트 */}
          <MeonjiSvg className="w-60 h-60" />

          {/* 버튼 */}
          <button
            onClick={startGame}
            className="w-full max-w-md bg-yellow-100 text-gray-900 py-4 rounded-xl text-lg font-medium shadow-sm hover:bg-yellow-200 transition"
          >
            시작하기
          </button>
        </div>
      )}

      {phase === 'showing' && (
        <section className="flex-1 flex flex-col items-center justify-center text-center ">
          {/* 제목 */}
          {/* <h1 className="text-3xl font-extrabold tracking-tight">ADHD 단어 기억 테스트!</h1> */}

          {/* 고정 크기 카드 */}
          <div
            className="
        w-[314px] h-[130px] 
        bg-white 
        shadow-sm 
        flex flex-col items-center justify-center
        pt-[13px] pb-[20px] gap-[13px]
      "
          >
            <div className="text-3xl font-extrabold">{targetWords[currentWordIndex]}</div>
            <div className="text-sm text-gray-400 font-medium">
              {currentWordIndex + 1}/{targetWords.length}
            </div>
          </div>
        </section>
      )}
      {/* 단어 선택하기 - 중앙 정렬 + 하단 버튼 */}
      {phase === 'selecting' && (
        <div className="min-h-screen flex flex-col px-6" key={gameKey}>
          {/* 가운데 콘텐츠 */}
          <section className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            {/* 안내문 */}
            <p className="text-base font-medium">기억한 단어를 선택하세요!</p>

            {/* 큰 타이머 */}
            <div className="text-5xl font-extrabold tracking-tight text-slate-800 font-mono">
              {formatTime(timeLeft)}
            </div>

            {/* 5열 카드 그리드 */}
            <div className="grid grid-cols-[repeat(5,51px)] gap-y-[15px] gap-x-[15px] justify-center">
              {allOptions.map((word) => {
                const active = selectedWords.has(word);
                return (
                  <button
                    key={word}
                    onClick={() => toggleWord(word)}
                    aria-pressed={active}
                    className={[
                      'w-[51px] h-[71px] rounded-[3px] border-[1.5px]',
                      'flex items-center justify-center',
                      'transition',
                      active
                        ? 'bg-yellow100 border-yellowBorder shadow'
                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm',
                    ].join(' ')}
                  >
                    <span className="text-[16px] font-semibold leading-none">{word}</span>
                  </button>
                );
              })}
            </div>

            {/* 선택 개수 */}
            <p className="mt-2 text-sm text-gray-700">선택한 단어 : {selectedWords.size}개</p>
          </section>

          {/* 하단(footer) 영역의 제출 버튼 */}
          <div className="mt-6 mb-10 flex justify-center">
            <button
              onClick={finishGame}
              className="h-[50px] w-full rounded-[7px] bg-yellow100 font-medium shadow-sm hover:bg-yellowBorder transition"
            >
              제출하기
            </button>
          </div>
        </div>
      )}

      {/* 결과 화면 */}
      {phase === 'finished' && (
        <div className="flex-1 min-h-screen flex items-center justify-center">
          <ResultView
            score={score}
            max={targetWords.length}
            targets={targetWords}
            onRestart={restartGame}
            onBackToHome={restartGame}
          />
        </div>
      )}
    </div>
  );
}
