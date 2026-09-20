import React, { useEffect, useState } from 'react';
import { JudgementType } from '../../config/scoring';

interface RhythmFeedbackProps {
  judgement: JudgementType | null;
  deltaMs?: number;
  triggerId?: number;
}

export const RhythmFeedback: React.FC<RhythmFeedbackProps> = ({
  judgement,
  deltaMs = 0,
  triggerId,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!judgement) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [triggerId, judgement]);

  if (!visible || !judgement) return <div className="h-14" />;

  const styles: Record<JudgementType, { text: string; color: string; glow: string }> = {
    perfect: {
      text: 'PERFECT!',
      color: 'text-yellow-400',
      glow: 'neon-glow-gold scale-110',
    },
    great: {
      text: 'GREAT!',
      color: 'text-cyan-400',
      glow: 'neon-glow-cyan scale-105',
    },
    good: {
      text: 'GOOD',
      color: 'text-emerald-400',
      glow: 'text-shadow-none scale-100',
    },
    miss: {
      text: 'MISS...',
      color: 'text-rose-500',
      glow: 'text-shadow-none scale-95 opacity-80',
    },
  };

  const current = styles[judgement];
  const deltaText = judgement !== 'miss' && deltaMs !== 0 ? `${deltaMs > 0 ? '+' : ''}${deltaMs}ms` : '';

  return (
    <div className="flex flex-col items-center justify-center h-14 select-none pointer-events-none transition-transform duration-100 ease-out">
      <div className={`font-disco text-3xl sm:text-4xl tracking-wider font-extrabold transition-all duration-150 ${current.color} ${current.glow}`}>
        {current.text}
      </div>
      {deltaText && (
        <span className="text-[11px] font-mono-rhythm text-white/70 tracking-widest mt-0.5">
          {deltaText}
        </span>
      )}
    </div>
  );
};
