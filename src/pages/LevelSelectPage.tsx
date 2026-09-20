import React, { useEffect, useState } from 'react';
import { LEVELS } from '../config/levels';
import { LevelCard } from '../components/LevelCard/LevelCard';
import { SaveService, SaveData } from '../services/SaveService';
import { SettingsModal } from '../components/SettingsModal/SettingsModal';
import { BeatmapEditorModal } from '../components/BeatmapEditor/BeatmapEditorModal';
import { DevModeService } from '../services/DevModeService';

interface LevelSelectPageProps {
  onSelectLevel: (levelId: string) => void;
  onBackHome: () => void;
}

export const LevelSelectPage: React.FC<LevelSelectPageProps> = ({
  onSelectLevel,
  onBackHome,
}) => {
  const [saveData, setSaveData] = useState<SaveData>(() => SaveService.load());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDev, setIsDev] = useState(() => DevModeService.isEnabled());

  useEffect(() => {
    const unsubSave = SaveService.subscribe((data) => setSaveData(data));
    const unsubDev = DevModeService.subscribe((enabled) => setIsDev(enabled));

    return () => {
      unsubSave();
      unsubDev();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col p-6 max-w-7xl mx-auto z-10">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <button
          onClick={onBackHome}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 transition-colors cursor-pointer"
        >
          ← BACK
        </button>

        <div className="text-center">
          <span className="text-[10px] uppercase font-mono-rhythm text-yellow-400 font-bold tracking-widest block">
            🎂 BIRTHDAY QUEST
          </span>
          <span className="font-mono-rhythm text-xs text-white/70 tracking-wider">
            Collect All Birthday Clues
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isDev && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-xs font-mono-rhythm text-yellow-300 font-bold transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] cursor-pointer"
            >
              🛠️ BEATMAP EDITOR (DEV)
            </button>
          )}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-rhythm text-white/80 transition-colors cursor-pointer"
          >
            ⚙️ SETTINGS
          </button>
        </div>
      </div>

      {/* Page Title & Collectibles Showcase */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="font-disco text-4xl sm:text-5xl text-white neon-glow-magenta mb-2">
            4 QUESTS TO THE SURPRISE
          </h2>
          <p className="text-white/70 text-sm font-body max-w-lg">
            Complete each rhythm challenge to collect all secret clues and unlock your birthday surprise!
          </p>
        </div>

        {/* Artifact inventory strip */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
          <div className="text-right">
            <span className="text-[9px] uppercase font-mono-rhythm text-white/40 block">CLUES COLLECTED</span>
            <span className="text-xs font-mono-rhythm font-bold text-yellow-400">
              {Object.values(saveData.collectibles).filter(Boolean).length} / 3 CLUES
            </span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-2xl">
            <span
              title="Rainbow Feather (Quest 1)"
              className={`transition-all ${saveData.collectibles.rainbowFeather ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_#06b6d4]' : 'opacity-20 grayscale'}`}
            >
              🌈
            </span>
            <span
              title="Golden Vinyl (Quest 2)"
              className={`transition-all ${saveData.collectibles.goldenVinyl ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_#eab308]' : 'opacity-20 grayscale'}`}
            >
              💿
            </span>
            <span
              title="Mirror Feather (Quest 3)"
              className={`transition-all ${saveData.collectibles.mirrorFeather ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_#ec4899]' : 'opacity-20 grayscale'}`}
            >
              🪞
            </span>
          </div>
        </div>
      </div>

      {/* 4 Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
        {LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            record={saveData.levels[level.id]}
            collectibles={saveData.collectibles}
            saveData={saveData}
            onSelect={onSelectLevel}
          />
        ))}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {isDev && <BeatmapEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />}
    </div>
  );
};

