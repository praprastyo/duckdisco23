import React, { useEffect, useRef, useState } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { AudioEngine } from '../../audio/AudioEngine';
import { Beach3DScene } from './Beach3DScene';

interface Beach3DStageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  events?: BeatmapEvent[];
  externalAction?: 'left' | 'right' | 'tap';
  onLaneSwitch?: (lane: 'left' | 'right') => void;
}

export const Beach3DStage: React.FC<Beach3DStageProps> = ({
  lastJudgement,
  combo,
  events = [],
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
    if (lastJudgement === 'miss') {
      setFeedback('💥 NABRAK!');
    } else {
      setFeedback('💨 LEWAT!');
    }
    const t = setTimeout(() => setFeedback(''), 450);
    return () => clearTimeout(t);
  }, [lastJudgement]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new Beach3DScene();
    scene.init(container, events);
    sceneRef.current = scene;

    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      const audioTime = AudioEngine.getInstance().getCurrentTime();
      scene.update(audioTime);
    };
    animId = requestAnimationFrame(loop);

    const handleResize = () => {
      scene.resize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, [events]);


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

      {/* Minimalist Top Floating Lane & Feedback Badge */}
      <div className="absolute top-16 inset-x-0 flex justify-center z-20 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-mono-rhythm text-white shadow-lg">
          <span>JALUR: <strong className="text-yellow-300 uppercase">{duckLane}</strong></span>
          {feedback && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              feedback.includes('NABRAK') ? 'bg-rose-500 text-white animate-bounce' : 'bg-emerald-500 text-white animate-pulse'
            }`}>
              {feedback}
            </span>
          )}
        </div>
      </div>

      {/* Clean Bottom Floating Lane Buttons */}
      <div className="absolute bottom-6 inset-x-4 max-w-sm mx-auto z-30 flex gap-3 h-12 pointer-events-auto">
        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('left')}
          className={`flex-1 rounded-xl font-disco font-black text-xs uppercase shadow-lg active:scale-95 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            duckLane === 'left'
              ? 'bg-amber-400 text-black border-2 border-amber-500 shadow-amber-300/80 scale-105'
              : 'bg-black/60 text-white hover:bg-black/80 border border-white/20'
          }`}
        >
          ⬅️ KIRI (A / ←)
        </button>

        <button
          type="button"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onClick={() => switchLane('right')}
          className={`flex-1 rounded-xl font-disco font-black text-xs uppercase shadow-lg active:scale-95 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            duckLane === 'right'
              ? 'bg-amber-400 text-black border-2 border-amber-500 shadow-amber-300/80 scale-105'
              : 'bg-black/60 text-white hover:bg-black/80 border border-white/20'
          }`}
        >
          KANAN ➡️ (D / →)
        </button>
      </div>
    </div>
  );
};


