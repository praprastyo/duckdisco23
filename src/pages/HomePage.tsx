import React, { useState, useRef } from 'react';
import { SettingsModal } from '../components/SettingsModal/SettingsModal';
import { DevModeService } from '../services/DevModeService';

interface HomePageProps {
  onEnterClub: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterClub }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);

  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDuckClick = () => {
    clickCountRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      const pwd = window.prompt('Masukkan kata sandi pengembang (Dev Password):');
      if (pwd !== null) {
        if (DevModeService.checkAndToggle(pwd)) {
          alert(DevModeService.isEnabled() ? '🛠️ Mode Pengembang Diaktifkan!' : '🔒 Mode Pengembang Dimatikan.');
        } else {
          alert('Kata sandi tidak cocok.');
        }
      }
    }
  };

  const handleEnter = () => {
    setIsOpeningDoor(true);
    setTimeout(() => {
      onEnterClub();
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Top bar info */}
      <div className="w-full flex justify-between items-center max-w-6xl z-20">
        <div className="text-xs font-mono-rhythm text-white/50 tracking-widest uppercase">
          SPECIAL BIRTHDAY GIFT QUEST
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono-rhythm text-white tracking-wider transition-all cursor-pointer"
        >
          ⚙️ PENGATURAN
        </button>
      </div>

      {/* Main Hero */}
      <div className={`relative z-10 flex flex-col items-center text-center my-auto transition-all duration-700 ${
        isOpeningDoor ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}>
        {/* Neon Duck Signboard (Secret click trigger) */}
        <div className="relative mb-6 cursor-pointer select-none" onClick={handleDuckClick}>
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-yellow-400 bg-gradient-to-b from-yellow-500/20 to-fuchsia-600/30 flex items-center justify-center shadow-[0_0_60px_rgba(234,179,8,0.5)] animate-pulse">
            <span className="text-5xl sm:text-6xl select-none">🦆</span>
          </div>
          <div className="absolute -inset-2 rounded-full border border-fuchsia-500/50 animate-ping opacity-30 pointer-events-none" />
        </div>

        <h1 className="font-disco text-6xl sm:text-8xl md:text-9xl tracking-tight text-white neon-glow-magenta mb-3">
          DISCO DUCK
        </h1>

        <div className="px-5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/50 text-cyan-300 font-mono-rhythm text-xs sm:text-sm tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          4 TANTANGAN • 4 KETUKAN • SATU KEJUTAN SPESIAL
        </div>

        <p className="max-w-md text-white/80 text-sm sm:text-base font-body mb-10 leading-relaxed">
          Selamat datang di pesta disko ulang tahunmu! Selesaikan setiap tantangan ritme, kumpulkan semua petunjuk, dan buka hadiah rahasia di babak penentuan.
        </p>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="group relative px-10 py-4 sm:px-14 sm:py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-fuchsia-600 text-black font-disco text-lg sm:text-xl font-black tracking-widest uppercase hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all cursor-pointer"
        >
          <span className="relative z-10 text-black group-hover:text-white transition-colors">
            MULAI PETUALANGAN
          </span>
          <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-xs font-mono-rhythm text-white/40 tracking-wider">
        DIBUAT SPESIAL UNTUK HARI ISTIMEWAMU 🎁
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

