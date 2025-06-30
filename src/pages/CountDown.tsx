import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownPage() {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const { timerId } = useParams<{ timerId: string }>();
  const location = useLocation();
const { name, minutes } = location.state || {};

  useEffect(() => {
    if (count === 0) {
      setTimeout(() => {
        navigate(`/timer/${timerId}/detail`, { state: { name, minutes } });
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, navigate, timerId]);

  return (
    <div className="max-w-sm mx-auto bg-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-16">타이머를 시작합니다</h1>

        <div className="relative">
          <AnimatePresence mode="wait">
            {count > 0 ? (
              <motion.div
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="text-8xl font-bold text-gray-800"
              >
                {count}
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-6xl font-bold text-yellow-400"
              >
                시작!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
