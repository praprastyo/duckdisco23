import React, { useEffect, useRef, useState } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { Beach3DScene } from './Beach3DScene';

interface Beach3DStageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  onLaneSwitch?: (lane: 'left' | 'right') => void;
}

export const Beach3DStage: React.FC<Beach3DStageProps> = ({
  lastJudgement,
  combo,
  onLaneSwitch,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<Beach3DScene | null>(null);
  const [duckLane, setDuckLane] = useState<'left' | 'right'>('left');
  const [feedback, setFeedback] = useState<string>('');

  const switchLane = (lane: 'left' | 'right') => {
    setDuckLane(lane);
    sceneRef.current?.setLane(lane);
    onLaneSwitch?.(lane);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        switchLane('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        switchLane('right');
      } else if (e.code === 'Space') {
        e.preventDefault();
        switchLane(duckLane === 'left' ? 'right' : 'left');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [duckLane]);

  useEffect(() => {
    if (!lastJudgement) return;
    setFeedback(lastJudgement !== 'miss' ? '💨 DODGED!' : '💥 BUMPED!');
    const t = setTimeout(() => setFeedback(''), 450);
    return () => clearTimeout(t);
  }, [lastJudgement]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new Beach3DScene();
    scene.init(container);
    sceneRef.current = scene;

    const handleResize = () => {
      scene.resize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl h-80 sm:h-96 rounded-3xl overflow-hidden border-4 border-yellow-300 shadow-2xl flex flex-col justify-between p-3 select-none">
      {/* 3D Beach WebGL Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Banner */}
      <div className="relative z-20 flex justify-between items-center bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏖️</span>
          <div>
            <span className="text-[11px] font-mono-rhythm font-black text-sky-950 uppercase block">
              TROPICAL BEACH RUNNER 3D
            </span>
            <span className="text-[9px] font-mono-rhythm text-slate-500">
              JALUR: <strong className="text-amber-800 uppercase">{duckLane}</strong>
            </span>
          </div>
        </div>

        {feedback && (
          <span className="font-disco text-sm text-emerald-600 font-black animate-bounce bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-400">
            {feedback}
          </span>
        )}

        <span className="text-xs font-mono-rhythm font-bold text-amber-800">
          {combo > 2 ? `🔥 ${combo}× COMBO` : '108 BPM'}
        </span>
      </div>

      {/* Large Touch Controls at Bottom */}
      <div className="relative z-20 flex gap-3 pt-2 h-14 pointer-events-auto">
        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('left')}
          className={`flex-1 rounded-2xl font-disco font-black text-sm uppercase shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all ${
            duckLane === 'left'
              ? 'bg-amber-400 text-black border-4 border-amber-500 shadow-amber-300/80 scale-[1.02]'
              : 'bg-white/90 text-sky-950 hover:bg-white border-2 border-slate-300'
          }`}
        >
          ⬅️ JALUR KIRI (A / ←)
        </button>

        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('right')}
          className={`flex-1 rounded-2xl font-disco font-black text-sm uppercase shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all ${
            duckLane === 'right'
              ? 'bg-amber-400 text-black border-4 border-amber-500 shadow-amber-300/80 scale-[1.02]'
              : 'bg-white/90 text-sky-950 hover:bg-white border-2 border-slate-300'
          }`}
        >
          JALUR KANAN ➡️ (D / →)
        </button>
      </div>
    </div>
  );
};
