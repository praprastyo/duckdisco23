import React from 'react';
import { BeatmapData } from '../../game/BeatmapRunner';
import { AudioEngine } from '../../audio/AudioEngine';
import { EditorControls } from './EditorControls';
import { EditorPads } from './EditorPads';
import { EditorNoteList } from './EditorNoteList';
import { EditorActions } from './EditorActions';
import { EditorOsuPlayfield } from './EditorOsuPlayfield';
import { useBeatmapEditor } from './useBeatmapEditor';

interface BeatmapEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBeatmap?: (data: BeatmapData) => void;
}

export const BeatmapEditorModal: React.FC<BeatmapEditorModalProps> = ({
  isOpen,
  onClose,
  onApplyBeatmap,
}) => {
  const editor = useBeatmapEditor(isOpen, onApplyBeatmap);

  if (!isOpen) return null;

  return (
    <div data-modal="editor" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#100a26] border-2 border-yellow-400/60 rounded-3xl p-4 sm:p-5 shadow-2xl text-white select-none">

        {/* Header & Mode Switch */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <div>
              <h2 className="font-disco text-base sm:text-lg text-yellow-300">DEV BEATMAP EDITOR</h2>
              <span className="text-[9px] font-mono-rhythm text-white/50 block">
                {editor.levelMode === 'level2' ? 'LEVEL 2 (OSU TARGETS)' : 'LEVEL 1 (DANCE ARROWS)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-white/5 p-0.5 border border-white/10 text-[10px] font-mono-rhythm font-bold">
              <button
                type="button"
                onClick={() => editor.setLevelMode('level2')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  editor.levelMode === 'level2' ? 'bg-cyan-500 text-black shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                🎯 LEVEL 2 (OSU)
              </button>
              <button
                type="button"
                onClick={() => editor.setLevelMode('level1')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  editor.levelMode === 'level1' ? 'bg-yellow-400 text-black shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                ←↑→↓ LEVEL 1
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <EditorControls
          currentTime={editor.currentTime}
          duration={AudioEngine.getInstance().getDuration() || 120}
          isPlaying={editor.isPlaying}
          isRecording={editor.isRecording}
          totalNotes={editor.events.length}
          onSeek={editor.handleSeek}
          onTogglePlay={editor.handleTogglePlay}
          onToggleRecord={() => editor.setIsRecording(!editor.isRecording)}
        />

        {/* Level 2: OSU Interactive 2D Playfield */}
        {editor.levelMode === 'level2' ? (
          <>
            <EditorOsuPlayfield
              events={editor.events}
              currentTime={editor.currentTime}
              onStampTarget={editor.stampTarget}
              onDeleteTarget={editor.handleDelete}
            />

            {/* Quick BPM / Offset row */}
            <div className="grid grid-cols-2 gap-2 font-mono-rhythm text-xs mb-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center justify-between">
                <span className="text-[10px] text-white/50">TEMPO (BPM)</span>
                <input
                  type="number"
                  value={editor.bpm}
                  onChange={(e) => editor.setBpm(parseInt(e.target.value, 10) || 146)}
                  className="w-20 text-right bg-transparent font-bold text-yellow-300 text-sm outline-none"
                />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center justify-between">
                <span className="text-[10px] text-white/50">OFFSET (SEC)</span>
                <input
                  type="number"
                  step="0.01"
                  value={editor.offset}
                  onChange={(e) => editor.setOffset(parseFloat(e.target.value) || 0.08)}
                  className="w-20 text-right bg-transparent font-bold text-cyan-300 text-sm outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          <EditorPads
            onStamp={editor.stampNote}
            bpm={editor.bpm}
            offset={editor.offset}
            tappedBpm={editor.tappedBpm}
            onBpmChange={editor.setBpm}
            onOffsetChange={editor.setOffset}
            onTapTempo={editor.handleTapTempo}
          />
        )}

        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono-rhythm mb-1 px-1">
            <span className="text-white/60 font-bold">DAFTAR KETUKAN ({editor.events.length})</span>
            <button
              type="button"
              onClick={() => editor.setEvents([])}
              className="text-[9px] text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              Hapus Semua
            </button>
          </div>
          <EditorNoteList
            events={editor.events}
            currentTime={editor.currentTime}
            onDelete={editor.handleDelete}
            onNudge={editor.handleNudge}
            onSeek={editor.handleSeek}
          />
        </div>

        {editor.toast && (
          <div className="mb-2 py-1 px-3 rounded-xl bg-emerald-500 text-black font-bold text-xs text-center font-mono-rhythm animate-bounce">
            {editor.toast}
          </div>
        )}

        <EditorActions
          onApply={editor.handleApply}
          onCopyJson={editor.handleCopyJson}
          onDownloadJson={editor.handleDownloadJson}
        />
      </div>
    </div>
  );
};
