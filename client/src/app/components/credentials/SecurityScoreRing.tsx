import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SecurityScoreRingProps {
  score: number;
  size?: 'small' | 'large';
}

export function SecurityScoreRing({ score, size = 'small' }: SecurityScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const dimensions = size === 'large' ? 140 : 80;
  const strokeWidth = 6;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#00FF88';
    if (score >= 60) return '#00C2FF';
    if (score >= 40) return '#F5A623';
    return '#FF4444';
  };

  const color = getScoreColor(score);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(easeOut * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dimensions} height={dimensions} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 194, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress */}
        <motion.circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-bold leading-none ${size === 'large' ? 'text-[28px]' : 'text-[22px]'}`}
          style={{ fontFamily: 'var(--font-heading)', color }}
        >
          {animatedScore}
        </span>
        <span className="text-[#7A8FA6] text-[11px] mt-0.5">
          {size === 'large' ? 'Security Score' : '/100'}
        </span>
      </div>
    </div>
  );
}
