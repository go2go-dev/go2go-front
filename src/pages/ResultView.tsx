import React from 'react';
import Meonji02 from '@/assets/svg/meonji02.svg?react';
import Meonji35 from '@/assets/svg/meonji35.svg?react';
import Meonji68 from '@/assets/svg/meonji68.svg?react';
import { useNavigate } from 'react-router-dom';

export type ResultMeta = {
  title: string;
  subtitle: string;
  image: React.ReactNode;
};

export const RESULT_BY_SCORE: Record<number, ResultMeta> = {
  0: {
    title: '기억력 블랙아웃!',
    subtitle:
      '지금 머릿속이 백지장 같죠? 하지만 걱정 마세요. ‘먼지치우기’ 타이머로 할 일들을 쪼개다 보면 기억력도, 집중력도 살아납니다.',
    image: <Meonji02 className="h-44 w-44" />,
  },
  3: {
    title: '기억력, 아직 예열 중',
    subtitle:
      '살짝 아쉬운 점수! 할 일도 미루면 결국 날아가버려요. 먼지치우기로 집중력을 다시 켜보세요.',
    image: <Meonji35 className="h-44 w-44" />,
  },
  6: {
    title: '집중력 모드 ON',
    subtitle: '꽤 잘했어요! 이제 할 일도 타이머로 정리해보세요. 먼지치우기가 도와드릴게요.',
    image: <Meonji68 className="h-44 w-44" />,
  },
  8: {
    title: '기억력 만렙 인증',
    subtitle: '천재 같아요. 이제 현실까지 천재로 만들어볼까요? 먼지치우기로 할 일까지 정리!',
    image: <Meonji68 className="h-44 w-44" />,
  },
};

function getResultMeta(score: number): ResultMeta {
  if (score >= 8) return RESULT_BY_SCORE[8];
  if (score >= 6) return RESULT_BY_SCORE[6];
  if (score >= 3) return RESULT_BY_SCORE[3];
  return RESULT_BY_SCORE[0];
}

export interface ResultViewProps {
  score: number;
  max: number;
  targets: string[];
  onRestart: () => void;
  onBackToHome?: () => void;
}

export default function ResultView({ score, max, onRestart }: ResultViewProps) {
  const meta = getResultMeta(score);
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm text-center flex flex-col items-center gap-6">
        <div>
          <h1 className="text-[28px] font-extrabold">{meta.title}</h1>
          <p className="mt-4 text-sm text-gray-500">{meta.subtitle}</p>
        </div>

        {meta.image}

        <p className="text-gray-500 mt-2">
          정답 {max}개 중 <b className="text-black text-xl">{score}개</b> 맞춤!
        </p>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 w-full items-center">
          <button
            onClick={onRestart}
            className="h-[50px] w-full rounded-[12px] bg-white font-semibold hover:bg-gray-200 transition"
          >
            다시 풀기
          </button>
          <button
            className="h-[50px] w-[64px] rounded-[12px] bg-yellow-100 hover:bg-yellow-200 font-semibold"
            onClick={() => navigate('/')}
          >
            홈
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">타이머를 생성해 집중력을 높여보세요!</p>
      </div>
    </section>
  );
}
