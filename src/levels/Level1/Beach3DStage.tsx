import React, { useEffect, useRef, useState } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { Beach3DScene } from './Beach3DScene';

interface Beach3DStageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  externalAction?: 'left' | 'right' | 'tap';
  onLaneSwitch?: (lane: 'left' | 'right') => void;
}

export const Beach3DStage: React.FC<Beach3DStageProps> = ({
  lastJudgement,
  combo,
  externalAction,
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

  // React to external input action from RhythmEngine
  useEffect(() => {
    if (externalAction === 'left') switchLane('left');
    else if (externalAction === 'right') switchLane('right');
  }, [externalAction]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        switchLane('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        switchLane('right');
      } else if (e.code === 'Space') {
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
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
      {/* Full-Screen 3D Beach WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Screen Left Half Touch Zone */}
      <div
        onClick={() => switchLane('left')}
        className="absolute inset-y-0 left-0 w-1/2 pointer-events-auto cursor-pointer z-10 opacity-0"
        title="Tap to switch Left Lane"
      />

      {/* Screen Right Half Touch Zone */}
      <div
        onClick={() => switchLane('right')}
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-auto cursor-pointer z-10 opacity-0"
        title="Tap to switch Right Lane"
      />

      {/* Top Floating Beach Info Banner */}
      <div className="absolute top-20 inset-x-4 max-w-lg mx-auto z-20 flex justify-between items-center bg-white/85 backdrop-blur-md px-5 py-2 rounded-2xl border-2 border-yellow-300 shadow-xl pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏖️</span>
          <div>
            <span className="text-xs font-mono-rhythm font-black text-sky-950 uppercase block">
              TROPICAL BEACH RUNNER 3D
            </span>
            <span className="text-[10px] font-mono-rhythm text-slate-600">
              JALUR: <strong className="text-amber-800 uppercase font-black">{duckLane}</strong>
            </span>
          </div>
        </div>

        {feedback && (
          <span className="font-disco text-sm text-emerald-600 font-black animate-bounce bg-emerald-100 px-3.5 py-0.5 rounded-full border border-emerald-400">
            {feedback}
          </span>
        )}

        <span className="text-xs font-mono-rhythm font-bold text-amber-800">
          {combo > 2 ? `🔥 ${combo}× COMBO` : '108 BPM'}
        </span>
      </div>

      {/* Large Floating Touch Buttons at Bottom */}
      <div className="absolute bottom-6 inset-x-4 max-w-md mx-auto z-30 flex gap-4 h-14 pointer-events-auto">
        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('left')}
          className={`flex-1 rounded-2xl font-disco font-black text-sm uppercase shadow-2xl active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer ${
            duckLane === 'left'
              ? 'bg-amber-400 text-black border-4 border-amber-500 shadow-amber-300/90 scale-105 ring-2 ring-yellow-200'
              : 'bg-white/95 text-sky-950 hover:bg-white border-2 border-slate-300'
          }`}
        >
          ⬅️ JALUR KIRI (A / ←)
        </button>

        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('right')}
          className={`flex-1 rounded-2xl font-disco font-black text-sm uppercase shadow-2xl active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer ${
            duckLane === 'right'
              ? 'bg-amber-400 text-black border-4 border-amber-500 shadow-amber-300/90 scale-105 ring-2 ring-yellow-200'
              : 'bg-white/95 text-sky-950 hover:bg-white border-2 border-slate-300'
          }`}
        >
          JALUR KANAN ➡️ (D / →)
        </button>
      </div>
    </div>
  );
};

