import React, { useEffect, useState } from 'react';
import { LevelConfig } from '../../config/levels';
import { UnlockService } from '../../services/UnlockService';
import { LevelScoreRecord, Collectibles } from '../../services/SaveService';

interface LevelCardProps {
  level: LevelConfig;
  record?: LevelScoreRecord;
  collectibles: Collectibles;
  onSelect: (levelId: string) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  record,
  collectibles,
  onSelect,
}) => {
  const [unlocked, setUnlocked] = useState(() => UnlockService.isLevelUnlocked(level.id));
  const [countdown, setCountdown] = useState(() => UnlockService.getCountdown(level.id));

  useEffect(() => {
    const check = () => {
      const isUn = UnlockService.isLevelUnlocked(level.id);
      setUnlocked(isUn);
      if (!isUn) {
        setCountdown(UnlockService.getCountdown(level.id));
      }
    };
    check();
    const timer = setInterval(check, 1000);
    return () => clearInterval(timer);
  }, [level.id]);

  const hasCollectible = level.collectibleKey ? collectibles[level.collectibleKey] : false;

  return (
    <div
      onClick={() => unlocked && onSelect(level.id)}
      className={`relative group rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
        unlocked
          ? 'bg-gradient-to-b from-[#180e30]/90 to-[#0e071f]/90 border-fuchsia-500/50 hover:border-yellow-400 hover:scale-[1.02] cursor-pointer shadow-[0_0_30px_rgba(236,72,153,0.25)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]'
          : 'bg-[#0b0814]/80 border-white/5 opacity-70 grayscale-[60%] cursor-not-allowed'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono-rhythm mb-3">
          <span className="text-white/60 tracking-wider">{level.dateDisplay}</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
              unlocked
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {unlocked ? 'AVAILABLE' : 'LOCKED'}
          </span>
        </div>

        <div className="text-[11px] font-mono-rhythm tracking-widest text-fuchsia-400 font-bold mb-1">
          NIGHT 0{level.levelNumber}
        </div>

        <h3 className="font-disco text-2xl sm:text-3xl text-white group-hover:text-yellow-300 transition-colors tracking-wide">
          {level.title}
        </h3>

        <p className="text-xs text-white/50 font-body mt-2 leading-relaxed">
          {level.subtitle}
        </p>
      </div>

      {/* Center Status / Countdown or Best Score */}
      <div className="my-6">
        {!unlocked ? (
          <div className="rounded-xl bg-black/50 border border-white/10 p-3 text-center">
            <span className="block text-[9px] uppercase font-mono-rhythm text-white/40 tracking-widest mb-1">
              OPENS IN
            </span>
            <div className="font-mono-rhythm text-xl font-bold text-rose-400 tracking-widest">
              {countdown.hours} : {countdown.minutes} : {countdown.seconds}
            </div>
          </div>
        ) : record?.cleared ? (
          <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 flex justify-between items-center text-xs font-mono-rhythm">
            <div>
              <span className="text-[9px] text-white/40 block">BEST SCORE</span>
              <span className="font-bold text-yellow-300 text-sm">{record.bestScore.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-white/40 block">ACCURACY</span>
              <span className="font-bold text-cyan-300 text-sm">{record.bestAccuracy.toFixed(1)}%</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-fuchsia-950/20 border border-fuchsia-500/20 p-3 text-center">
            <span className="text-xs font-mono-rhythm text-fuchsia-300 tracking-wider">
              READY TO GROOVE
            </span>
          </div>
        )}
      </div>

      {/* Collectible Badge */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {level.id === 'level1' ? '🪶' : level.id === 'level2' ? '💿' : level.id === 'level3' ? '🪞' : '🦆'}
          </span>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono-rhythm text-white/40">REWARD</span>
            <span className={`text-xs font-mono-rhythm font-bold ${hasCollectible ? 'text-yellow-400' : 'text-white/40'}`}>
              {level.collectibleName}
            </span>
          </div>
        </div>

        {hasCollectible && (
          <span className="px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-[10px] font-mono-rhythm font-bold">
            COLLECTED
          </span>
        )}
      </div>
    </div>
  );
};
