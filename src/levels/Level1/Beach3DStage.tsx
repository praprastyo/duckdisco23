import React, { useEffect, useRef, useState } from 'react';
import { BeatmapEvent } from '../../game/BeatmapRunner';
import { JudgementType } from '../../config/scoring';
import { AudioEngine } from '../../audio/AudioEngine';
import { InputAction } from '../../game/InputManager';
import { Beach3DScene } from './Beach3DScene';

interface Beach3DStageProps {
  currentBeat: number;
  currentCue: BeatmapEvent | null;
  lastJudgement?: JudgementType | null;
  combo: number;
  events?: BeatmapEvent[];
  actionEvent?: { id: number; action: InputAction };
  onLaneSwitch?: (lane: 'left' | 'right') => void;
}


export const Beach3DStage: React.FC<Beach3DStageProps> = ({
  lastJudgement,
  combo,
  events = [],
  actionEvent,
  onLaneSwitch,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<Beach3DScene | null>(null);
  const [duckLaneIndex, setDuckLaneIndex] = useState(1);
  const [feedback, setFeedback] = useState<string>('');

  const laneLabels = ['JALUR 1 (KIRI)', 'JALUR 2 (TENGAH)', 'JALUR 3 (KANAN)'];

  const handleMoveLeft = () => {
    if (!sceneRef.current) return;
    const next = sceneRef.current.moveLeft();
    setDuckLaneIndex(next);
    onLaneSwitch?.('left');
  };

  const handleMoveRight = () => {
    if (!sceneRef.current) return;
    const next = sceneRef.current.moveRight();
    setDuckLaneIndex(next);
    onLaneSwitch?.('right');
  };

  // Re-trigger movement on every actionEvent ID change!
  useEffect(() => {
    if (!actionEvent) return;
    if (actionEvent.action === 'left') {
      handleMoveLeft();
    } else if (actionEvent.action === 'right') {
      handleMoveRight();
    }
  }, [actionEvent?.id]);


  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleMoveLeft();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleMoveRight();
      } else if (e.code === 'Space') {
        if (duckLaneIndex === 0) handleMoveRight();
        else if (duckLaneIndex === 2) handleMoveLeft();
        else handleMoveLeft();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [duckLaneIndex]);


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

      {/* Screen Left Half Touch Area */}
      <div
        data-interactive="true"
        onPointerDown={handleMoveLeft}
        onClick={handleMoveLeft}
        className="absolute inset-y-0 left-0 w-1/2 pointer-events-auto cursor-pointer z-30 opacity-0"
        title="Tap to move Left"
      />

      {/* Screen Right Half Touch Area */}
      <div
        data-interactive="true"
        onPointerDown={handleMoveRight}
        onClick={handleMoveRight}
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-auto cursor-pointer z-30 opacity-0"
        title="Tap to move Right"
      />

      {/* Minimalist Top Lane Indicator */}
      <div className="absolute top-16 inset-x-0 flex justify-center z-20 pointer-events-none">
        <div className="flex items-center gap-3 bg-black/55 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/20 text-xs font-mono-rhythm text-white shadow-xl">
          <span>POSISI: <strong className="text-yellow-300 font-black">{laneLabels[duckLaneIndex]}</strong></span>
          {feedback && (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              feedback.includes('NABRAK') ? 'bg-rose-500 text-white animate-bounce' : 'bg-emerald-500 text-white animate-pulse'
            }`}>
              {feedback}
            </span>
          )}
        </div>
      </div>

      {/* 2 Big Clear Bottom Controls: MOVE LEFT & MOVE RIGHT */}
      <div className="absolute bottom-6 inset-x-4 max-w-sm mx-auto z-40 flex gap-3 h-14 pointer-events-auto">
        <button
          type="button"
          data-interactive="true"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onPointerDown={handleMoveLeft}
          onClick={handleMoveLeft}
          className="flex-1 rounded-2xl font-disco font-black text-sm uppercase shadow-2xl active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-2 border-yellow-200 hover:brightness-105 transition-all cursor-pointer"
        >
          ⬅️ MOVE LEFT (A / ←)
        </button>

        <button
          type="button"
          data-interactive="true"
          tabIndex={-1}
          onFocus={(e) => e.currentTarget.blur()}
          onPointerDown={handleMoveRight}
          onClick={handleMoveRight}
          className="flex-1 rounded-2xl font-disco font-black text-sm uppercase shadow-2xl active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-2 border-yellow-200 hover:brightness-105 transition-all cursor-pointer"
        >
          MOVE RIGHT ➡️ (D / →)
        </button>
      </div>
    </div>
  );
};




