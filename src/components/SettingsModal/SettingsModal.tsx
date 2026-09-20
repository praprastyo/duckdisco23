import React, { useState } from 'react';
import { SaveService, GameSettings } from '../../services/SaveService';
import { AudioEngine } from '../../audio/AudioEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<GameSettings>(() => SaveService.load().settings);

  if (!isOpen) return null;

  const update = (patch: Partial<GameSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    SaveService.updateSettings(patch);

    const audioEngine = AudioEngine.getInstance();
    if (patch.musicVolume !== undefined) audioEngine.setMusicVolume(patch.musicVolume);
    if (patch.sfxVolume !== undefined) audioEngine.setSfxVolume(patch.sfxVolume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0e0a1f] border border-fuchsia-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(236,72,153,0.3)] select-none">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 className="font-disco text-2xl text-yellow-400 tracking-wider">PENGATURAN SUARA & GAME</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-lg px-2 py-0.5 rounded bg-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-sm font-mono-rhythm">
          {/* Music Volume */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1.5">
              <span>VOLUME MUSIK</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => update({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-fuchsia-500 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1.5">
              <span>VOLUME EFEK SUARA</span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                update({ sfxVolume: val });
                AudioEngine.getInstance().playSfx('quack');
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Timing Latency Calibration */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1.5">
              <span>OFFSET LATENSI KETUKAN</span>
              <span className="text-yellow-400">{settings.timingOffset} ms</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="5"
              value={settings.timingOffset}
              onChange={(e) => update({ timingOffset: parseInt(e.target.value, 10) })}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <p className="text-[10px] text-white/40 mt-1">Sesuaikan jika ketukan terasa terlalu cepat atau lambat di layarmu.</p>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="block text-xs text-white/90">PENGURANGAN GERAKAN</span>
              <span className="text-[10px] text-white/40">Meminimalisir getaran laser dan denyut kamera</span>
            </div>
            <button
              onClick={() => update({ reducedMotion: !settings.reducedMotion })}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                settings.reducedMotion ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white/60'
              }`}
            >
              {settings.reducedMotion ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 font-disco tracking-widest text-sm text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all cursor-pointer"
        >
          SIMPAN & TUTUP
        </button>
      </div>
    </div>
  );
};
