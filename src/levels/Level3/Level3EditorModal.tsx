import React, { useState } from 'react';
import { AudioEngine } from '../../audio/AudioEngine';
import { Level3Config, Direction } from './level3Types';
import { saveLevel3Config, resetLevel3Config } from './level3Data';

interface Level3EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Level3Config;
  onUpdateConfig: (newConfig: Level3Config) => void;
  songTime: number;
  currentPhase: string;
  autoplay: boolean;
  onToggleAutoplay: () => void;
}

export const Level3EditorModal: React.FC<Level3EditorModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  songTime,
  currentPhase,
  autoplay,
  onToggleAutoplay,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'rounds' | 'sections' | 'export'>('timeline');
  const [seekInput, setSeekInput] = useState('0.000');
  const [selectedRoundId, setSelectedRoundId] = useState<string>(config.rounds[0]?.id || 'round-01');
  const [_selectedCmdIdx, setSelectedCmdIdx] = useState<number>(0);
  const [importJson, setImportJson] = useState('');
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const audio = AudioEngine.getInstance();
  const selectedRound = config.rounds.find((r) => r.id === selectedRoundId) || config.rounds[0];

  const handleSeek = (sec: number) => {
    audio.seek(Math.max(0, Math.min(sec, 257)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c051a] border border-yellow-400/60 rounded-2xl shadow-[0_0_50px_rgba(250,204,21,0.25)] flex flex-col overflow-hidden text-xs font-mono-rhythm text-white">
        <div className="px-4 py-3 bg-yellow-400/10 border-b border-yellow-400/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">🛠️ LEVEL 3 TIMING & LEVEL EDITOR</span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[10px] text-cyan-300">
              {songTime.toFixed(3)}s • {currentPhase.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold">
            ✕
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-black/40">
          {(['timeline', 'rounds', 'sections', 'export'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center font-bold tracking-wider uppercase ${
                activeTab === tab
                  ? 'border-b-2 border-yellow-400 text-yellow-300 bg-yellow-400/10'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button onClick={() => audio.play(audio.getCurrentTime())} className="py-2 bg-emerald-600 rounded font-bold">▶ PLAY</button>
                <button onClick={() => audio.pause()} className="py-2 bg-amber-600 rounded font-bold">❚❚ PAUSE</button>
                <button onClick={() => handleSeek(0)} className="py-2 bg-rose-700 rounded font-bold">⏮ RESTART</button>
                <button onClick={onToggleAutoplay} className={`py-2 rounded font-bold ${autoplay ? 'bg-cyan-600' : 'bg-white/10'}`}>
                  AUTOPLAY: {autoplay ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-white/50 text-[10px]">JUMP:</span>
                <button onClick={() => handleSeek(0)} className="px-3 py-1 bg-white/10 rounded">PART 1 (0s)</button>
                <button onClick={() => handleSeek(70)} className="px-3 py-1 bg-white/10 rounded">PART 2 (70s)</button>
                <button onClick={() => handleSeek(153)} className="px-3 py-1 bg-white/10 rounded">PART 3 (153s)</button>
                <button onClick={() => handleSeek(69.5)} className="px-2 py-1 bg-purple-900/60 rounded">TRANS 1</button>
                <button onClick={() => handleSeek(152)} className="px-2 py-1 bg-purple-900/60 rounded">TRANS 2</button>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center gap-3">
                <span className="text-white/70">PRECISE SEEK (SEC):</span>
                <input
                  type="number"
                  step="0.05"
                  value={seekInput}
                  onChange={(e) => setSeekInput(e.target.value)}
                  className="px-3 py-1 bg-black border border-white/20 rounded w-28 text-yellow-300 font-bold"
                />
                <button onClick={() => handleSeek(parseFloat(seekInput) || 0)} className="px-4 py-1 bg-yellow-400 text-black font-bold rounded">
                  GO
                </button>
                <button onClick={() => setSeekInput(songTime.toFixed(3))} className="px-2 py-1 bg-white/10 rounded text-[10px]">
                  USE CURRENT ({songTime.toFixed(3)}s)
                </button>
              </div>
            </div>
          )}
          {/* TAB 2: ROUNDS */}
          {activeTab === 'rounds' && selectedRound && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 p-2 bg-black/40 rounded border border-white/10">
                <span className="text-white/60">ROUND:</span>
                <select
                  value={selectedRoundId}
                  onChange={(e) => { setSelectedRoundId(e.target.value); setSelectedCmdIdx(0); }}
                  className="px-2 py-1 bg-black border border-white/30 rounded text-yellow-300 font-bold"
                >
                  {config.rounds.map((r) => (
                    <option key={r.id} value={r.id}>{r.id} ({r.sectionId} • {r.commands.length} cmds • {r.demoStart}s)</option>
                  ))}
                </select>
                <button onClick={() => handleSeek(selectedRound.demoStart)} className="px-2 py-1 bg-yellow-400 text-black font-bold rounded">
                  SEEK ({selectedRound.demoStart}s)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-black/40 rounded border border-white/10">
                <div>
                  <div className="flex justify-between text-[10px] text-white/70">
                    <span>DEMO START (s):</span>
                    <button onClick={() => {
                      const cur = Number(audio.getCurrentTime().toFixed(3));
                      const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, demoStart: cur } : r));
                      onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                    }} className="text-cyan-300 underline">USE ({songTime.toFixed(2)}s)</button>
                  </div>
                  <input type="number" step="0.05" value={selectedRound.demoStart} onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, demoStart: val } : r));
                    onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                  }} className="w-full px-2 py-1 bg-black border border-white/20 rounded font-bold text-yellow-300" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-white/70">
                    <span>RESPONSE START (s):</span>
                    <button onClick={() => {
                      const cur = Number(audio.getCurrentTime().toFixed(3));
                      const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, responseStart: cur } : r));
                      onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                    }} className="text-cyan-300 underline">USE ({songTime.toFixed(2)}s)</button>
                  </div>
                  <input type="number" step="0.05" value={selectedRound.responseStart} onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, responseStart: val } : r));
                    onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                  }} className="w-full px-2 py-1 bg-black border border-white/20 rounded font-bold text-yellow-300" />
                </div>
              </div>
              {/* Commands List */}
              <div className="p-2 bg-black/40 rounded border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white/80">COMMANDS ({selectedRound.commands.length})</span>
                  <button onClick={() => {
                    const newCmd = { direction: 'left' as Direction, offset: 0.5 };
                    const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, commands: [...r.commands, newCmd] } : r));
                    onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                  }} className="px-2 py-0.5 bg-emerald-600 rounded text-[10px] font-bold">+ ADD</button>
                </div>
                {selectedRound.commands.map((cmd, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 p-1 bg-black/50 border border-white/10 rounded">
                    <span className="text-white/40 text-[9px] w-4">#{idx + 1}</span>
                    <select value={cmd.direction} onChange={(e) => {
                      const dir = e.target.value as Direction;
                      const updCmds = selectedRound.commands.map((c, i) => (i === idx ? { ...c, direction: dir } : c));
                      const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, commands: updCmds } : r));
                      onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                    }} className="px-1.5 py-0.5 bg-black border border-white/20 rounded text-yellow-300 font-bold text-[10px]">
                      <option value="left">←</option><option value="up">↑</option><option value="right">→</option><option value="down">↓</option>
                    </select>
                    <span className="text-[9px] text-white/50">OFFSET:</span>
                    <input type="number" step="0.05" value={cmd.offset} onChange={(e) => {
                      const off = parseFloat(e.target.value) || 0;
                      const updCmds = selectedRound.commands.map((c, i) => (i === idx ? { ...c, offset: off } : c));
                      const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, commands: updCmds } : r));
                      onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                    }} className="w-16 px-1.5 py-0.5 bg-black border border-white/20 rounded text-cyan-300 font-bold text-[10px]" />
                    <button onClick={() => {
                      const updCmds = selectedRound.commands.map((c, i) => (i === idx ? { ...c, fake: !c.fake } : c));
                      const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, commands: updCmds } : r));
                      onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                    }} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${cmd.fake ? 'bg-purple-900 text-purple-200' : 'bg-white/10 text-white/50'}`}>
                      {cmd.fake ? '👻 FAKE' : 'REAL'}
                    </button>
                    <button onClick={() => {
                      const cmds = selectedRound.commands.filter((_, i) => i !== idx);
                      const upd = config.rounds.map((r) => (r.id === selectedRound.id ? { ...r, commands: cmds } : r));
                      onUpdateConfig({ ...config, rounds: upd }); saveLevel3Config({ ...config, rounds: upd });
                    }} className="ml-auto px-1.5 py-0.5 bg-rose-900 text-rose-300 rounded font-bold text-[9px]">✕</button>
                  </div>
                ))}
              </div>

            </div>
          )}
          {/* TAB 3: SECTIONS & TRANSITIONS */}
          {activeTab === 'sections' && (
            <div className="space-y-3">
              <div className="p-2 bg-black/40 rounded border border-white/10 space-y-2">
                <span className="font-bold text-white/80">MUSIC SECTIONS</span>
                {config.sections.map((sec, idx) => (
                  <div key={sec.id} className="grid grid-cols-4 gap-2 p-1.5 bg-black/50 border border-white/10 rounded">
                    <div>
                      <span className="text-[9px] text-white/50 block">ID: {sec.id}</span>
                      <input value={sec.label} onChange={(e) => {
                        const upd = config.sections.map((s, i) => i === idx ? { ...s, label: e.target.value } : s);
                        onUpdateConfig({ ...config, sections: upd }); saveLevel3Config({ ...config, sections: upd });
                      }} className="w-full px-1.5 py-0.5 bg-black border border-white/20 rounded text-yellow-300 font-bold text-[10px]" />
                    </div>
                    <div>
                      <span className="text-[9px] text-white/50 block">START (s):</span>
                      <input type="number" step="0.5" value={sec.startTime} onChange={(e) => {
                        const upd = config.sections.map((s, i) => i === idx ? { ...s, startTime: parseFloat(e.target.value) || 0 } : s);
                        onUpdateConfig({ ...config, sections: upd }); saveLevel3Config({ ...config, sections: upd });
                      }} className="w-full px-1.5 py-0.5 bg-black border border-white/20 rounded text-cyan-300 font-bold text-[10px]" />
                    </div>
                    <div>
                      <span className="text-[9px] text-white/50 block">END (s):</span>
                      <input type="number" step="0.5" value={sec.endTime} onChange={(e) => {
                        const upd = config.sections.map((s, i) => i === idx ? { ...s, endTime: parseFloat(e.target.value) || 0 } : s);
                        onUpdateConfig({ ...config, sections: upd }); saveLevel3Config({ ...config, sections: upd });
                      }} className="w-full px-1.5 py-0.5 bg-black border border-white/20 rounded text-cyan-300 font-bold text-[10px]" />
                    </div>
                    <div>
                      <span className="text-[9px] text-white/50 block">BPM:</span>
                      <input type="number" value={sec.bpm} onChange={(e) => {
                        const upd = config.sections.map((s, i) => i === idx ? { ...s, bpm: parseInt(e.target.value) || 120 } : s);
                        onUpdateConfig({ ...config, sections: upd }); saveLevel3Config({ ...config, sections: upd });
                      }} className="w-full px-1.5 py-0.5 bg-black border border-white/20 rounded text-yellow-400 font-bold text-[10px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* TAB 4: EXPORT & IMPORT */}
          {activeTab === 'export' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                    setImportMsg('Copied configuration JSON to clipboard!');
                    setTimeout(() => setImportMsg(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-yellow-400 text-black font-bold rounded"
                >
                  📋 EXPORT / COPY JSON
                </button>
                <button
                  onClick={() => {
                    const def = resetLevel3Config();
                    onUpdateConfig(def);
                    setImportMsg('Reset to original default configuration!');
                    setTimeout(() => setImportMsg(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-rose-900 text-rose-200 border border-rose-500/40 font-bold rounded"
                >
                  🔄 RESET DEFAULTS
                </button>
              </div>

              {importMsg && (
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 rounded text-emerald-300 text-[10px]">
                  {importMsg}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] text-white/60">IMPORT JSON CONFIG:</span>
                <textarea
                  rows={5}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste Level 3 JSON configuration here..."
                  className="w-full p-2 bg-black border border-white/20 rounded text-[10px] font-mono text-cyan-300"
                />
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(importJson);
                      if (!parsed.sections || !parsed.rounds) {
                        throw new Error('Invalid format: missing sections or rounds');
                      }
                      onUpdateConfig(parsed);
                      saveLevel3Config(parsed);
                      setImportMsg('Successfully imported and applied configuration!');
                      setTimeout(() => setImportMsg(null), 3000);
                    } catch (err: unknown) {
                      setImportMsg(`Import error: ${(err as Error).message}`);
                    }
                  }}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded"
                >
                  APPLY IMPORTED JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
