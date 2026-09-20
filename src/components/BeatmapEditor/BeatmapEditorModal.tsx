import React from 'react';
import { BeatmapData } from '../../game/BeatmapRunner';
import { AudioEngine } from '../../audio/AudioEngine';
import { EditorControls } from './EditorControls';
import { EditorPads } from './EditorPads';
import { EditorNoteList } from './EditorNoteList';
import { EditorActions } from './EditorActions';
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
      <div className="w-full max-w-xl bg-[#100a26] border-2 border-yellow-400/60 rounded-3xl p-4 sm:p-5 shadow-2xl text-white select-none">

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <div>
              <h2 className="font-disco text-base sm:text-lg text-yellow-300">BEATMAP EDITOR</h2>
              <span className="text-[9px] font-mono-rhythm text-white/50 block">REKAM KETUKAN DANCE BEBEK</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
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

        <EditorPads
          onStamp={editor.stampNote}
          bpm={editor.bpm}
          offset={editor.offset}
          tappedBpm={editor.tappedBpm}
          onBpmChange={editor.setBpm}
          onOffsetChange={editor.setOffset}
          onTapTempo={editor.handleTapTempo}
        />

        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono-rhythm mb-1 px-1">
            <span className="text-white/60 font-bold">DAFTAR KETUKAN</span>
            <button
              type="button"
              onClick={() => editor.setEvents([])}
              className="text-[9px] text-rose-400 hover:text-rose-300"
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
