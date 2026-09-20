import React, { useState, useEffect } from 'react';
import { LevelConfig } from '../../config/levels';
import { AudioEngine } from '../../audio/AudioEngine';

interface LevelSplashIntroProps {
  level: LevelConfig;
  onStart: () => void;
}

export const LevelSplashIntro: React.FC<LevelSplashIntroProps> = ({ level, onStart }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGroove, setIsGroove] = useState(false);

  const startCountdown = () => {
    AudioEngine.getInstance().playSfx('cowbell');
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        AudioEngine.getInstance().playSfx('cowbell');
        setCountdown(countdown - 1);
      }, 700);
      return () => clearTimeout(timer);
    } else if (countdown === 1) {
      const timer = setTimeout(() => {
        AudioEngine.getInstance().playSfx('quack');
        setIsGroove(true);
        setTimeout(() => {
          onStart();
        }, 500);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [countdown, onStart]);

  const levelBadges: Record<string, { icon: string; tag: string; controls: string; desc: string }> = {
    level1: {
      icon: '🏖️',
      tag: 'DISCO BEACH WALK',
      controls: 'SPACEBAR / CLICK / TAP',
      desc: 'Bebek berjalan di pantai disko. Tekan SPACE / TAP tepat saat obstacle kepiting atau bola pantai menyentuh lingkaran target!',
    },
    level2: {
      icon: '🦖',
      tag: 'CHROME DINO DISCO RUNNER',
      controls: 'SPACEBAR / TAP TO JUMP',
      desc: 'Bebek berlari hindari obstacle. Dapatkan combo tinggi untuk aksi freestyle 360 spin di udara!',
    },
    level3: {
      icon: '🪽',
      tag: 'FLAPPY DISCO DUCK',
      controls: 'SPACEBAR / TAP TO FLAP',
      desc: 'Terbang melewati neon laser gates sesuai ketukan musik. Waspada saat lampu blackout!',
    },
    level4: {
      icon: '👑',
      tag: 'GRAND DISCO FEVER & 3D REVEAL',
      controls: 'ALL CONTROLS • SCORE ≥ 70,000 TO CRACK EGG',
      desc: 'Tarian akbar formasi bebek disco! Kumpulkan skor tinggi untuk membuka 3D Golden Disco Egg!',
    },
  };

  const badge = levelBadges[level.id] || levelBadges.level1;

  return (
    <div className="absolute inset-0 z-50 bg-[#070312]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden animate-fadeIn">
      {/* Laser beam sweep in background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-600 via-cyan-600 to-transparent animate-pulse" />

      {/* Countdown overlay if active */}
      {countdown !== null ? (
        <div className="flex flex-col items-center justify-center animate-scaleIn">
          <div className="font-disco text-8xl sm:text-9xl font-black tracking-widest text-yellow-300 neon-glow-gold">
            {isGroove ? 'GROOVE!' : countdown}
          </div>
          <span className="text-xs font-mono-rhythm text-cyan-300 tracking-widest uppercase mt-4">
            GET READY TO HIT THE BEAT
          </span>
        </div>
      ) : (
        <div className="relative z-10 max-w-lg flex flex-col items-center">
          {/* Night Badge */}
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-fuchsia-950/80 border border-fuchsia-500/50 mb-3 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            <span className="text-lg">{badge.icon}</span>
            <span className="text-xs font-mono-rhythm text-yellow-300 font-bold tracking-widest uppercase">
              NIGHT 0{level.levelNumber} • {badge.tag}
            </span>
          </div>

          <h2 className="font-disco text-4xl sm:text-6xl text-white neon-glow-magenta mb-3 tracking-wide">
            {level.title}
          </h2>

          <p className="text-sm font-body text-white/80 mb-6 leading-relaxed">
            {badge.desc}
          </p>

          {/* Control instruction card */}
          <div className="w-full bg-black/60 border border-white/15 rounded-2xl p-4 mb-8 text-left space-y-2">
            <div className="text-[10px] uppercase font-mono-rhythm text-cyan-400 font-bold tracking-wider">
              🎮 KONTROL PERMAINAN:
            </div>
            <div className="text-xs font-mono-rhythm text-white font-bold tracking-wide">
              {badge.controls}
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono-rhythm text-white/60">
              Target: {level.difficulty}
            </div>
          </div>

          {/* Start Button */}
          <button
            tabIndex={-1}
            onFocus={(e) => e.currentTarget.blur()}
            onClick={startCountdown}
            className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-fuchsia-600 text-black font-disco text-lg font-black tracking-widest uppercase hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(236,72,153,0.6)] transition-all cursor-pointer"
          >
            START NIGHT 0{level.levelNumber}
          </button>
        </div>
      )}
    </div>
  );
};
