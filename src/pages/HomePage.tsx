import React, { useState } from 'react';
import { SettingsModal } from '../components/SettingsModal/SettingsModal';

interface HomePageProps {
  onEnterClub: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterClub }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);

  const handleEnter = () => {
    setIsOpeningDoor(true);
    setTimeout(() => {
      onEnterClub();
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Settings trigger */}
      <div className="w-full flex justify-between items-center max-w-6xl z-20">
        <div className="text-xs font-mono-rhythm text-white/50 tracking-widest uppercase">
          JAKARTA TIMEZONE • RETRO DISCO 2026
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono-rhythm text-white tracking-wider transition-all"
        >
          ⚙️ SETTINGS
        </button>
      </div>

      {/* Main Club Exterior Entrance & Neon Logo */}
      <div className={`relative z-10 flex flex-col items-center text-center my-auto transition-all duration-700 ${
        isOpeningDoor ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}>
        {/* Neon Duck Signboard */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-yellow-400 bg-gradient-to-b from-yellow-500/20 to-fuchsia-600/30 flex items-center justify-center shadow-[0_0_60px_rgba(234,179,8,0.5)] animate-pulse">
            <span className="text-5xl sm:text-6xl select-none">🦆</span>
          </div>
          {/* Neon Halo Ring */}
          <div className="absolute -inset-2 rounded-full border border-fuchsia-500/50 animate-ping opacity-30 pointer-events-none" />
        </div>

        <h1 className="font-disco text-6xl sm:text-8xl md:text-9xl tracking-tight text-white neon-glow-magenta mb-3">
          DISCO DUCK
        </h1>

        <div className="px-5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/50 text-cyan-300 font-mono-rhythm text-xs sm:text-sm tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          4 NIGHTS. 4 BEATS. ONE FINAL REVEAL.
        </div>

        <p className="max-w-md text-white/70 text-sm sm:text-base font-body mb-10 leading-relaxed">
          Step into the underground retro disco. Master the timing, groove through four daily rhythm nights, and uncover the legendary Golden Disco Duck.
        </p>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="group relative px-10 py-4 sm:px-14 sm:py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-fuchsia-600 text-black font-disco text-lg sm:text-xl font-black tracking-widest uppercase hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all cursor-pointer"
        >
          <span className="relative z-10 text-black group-hover:text-white transition-colors">
            ENTER THE CLUB
          </span>
          <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-xs font-mono-rhythm text-white/40 tracking-wider">
        SEPTEMBER 20–23, 2026 • ASIA/JAKARTA (UTC+7)
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
