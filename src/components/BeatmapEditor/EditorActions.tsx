import React from 'react';

interface EditorActionsProps {
  onApply: () => void;
  onCopyJson: () => void;
  onDownloadJson: () => void;
}

export const EditorActions: React.FC<EditorActionsProps> = ({
  onApply,
  onCopyJson,
  onDownloadJson,
}) => (
  <div className="grid grid-cols-3 gap-2 font-disco text-xs font-bold">
    <button
      type="button"
      onClick={onApply}
      className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow active:scale-95 transition-all"
    >
      🚀 TERAPKAN
    </button>
    <button
      type="button"
      onClick={onCopyJson}
      className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
    >
      📋 SALIN JSON
    </button>
    <button
      type="button"
      onClick={onDownloadJson}
      className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow active:scale-95 transition-all"
    >
      💾 DOWNLOAD
    </button>
  </div>
);
