import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AudioManager } from '../audio/AudioManager';
import { DEFAULT_GIFT_DIMENSIONS, DEFAULT_GIFT_TEXTURES } from '../config/level4Config';
import { createGiftBoxMesh, GiftBoxModel } from './GiftBox';
import { RevealSuspenseStage } from '../types/level4Types';

interface GiftReveal3DProps {
  onOpenLetter: () => void;
  onExit: () => void;
}

export const GiftReveal3D: React.FC<GiftReveal3DProps> = ({ onOpenLetter, onExit }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [suspenseStage, setSuspenseStage] = useState<RevealSuspenseStage>('inspect_closed');
  const stageRef = useRef<RevealSuspenseStage>('inspect_closed');
  const audio = AudioManager.getInstance();

  const modelRef = useRef<GiftBoxModel | null>(null);

  const updateStage = (next: RevealSuspenseStage) => {
    stageRef.current = next;
    setSuspenseStage(next);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06030e);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ACES Filmic Tone Mapping gives rich deep blacks and prevents faded/washed-out look
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // Balanced ambient lighting (prevents milky flat fogging)
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    // Crisp Key Light from front-top to illuminate textures cleanly
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(0, 5, 5);
    scene.add(keyLight);

    // Warm back-fill light
    const backLight = new THREE.DirectionalLight(0xfff7ed, 1.0);
    backLight.position.set(2, 6, -4);
    scene.add(backLight);

    // Colorful rim accent lights
    const p1 = new THREE.PointLight(0x06b6d4, 2.8, 12);
    p1.position.set(-4, 2, -2);
    scene.add(p1);

    const p2 = new THREE.PointLight(0xec4899, 2.8, 12);
    p2.position.set(4, 2, -2);
    scene.add(p2);

    const giftBox = createGiftBoxMesh(DEFAULT_GIFT_DIMENSIONS, DEFAULT_GIFT_TEXTURES);
    modelRef.current = giftBox;
    scene.add(giftBox.rootGroup);

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const onMouseDown = (e: MouseEvent) => {
      if (stageRef.current !== 'inspect_closed') return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || stageRef.current !== 'inspect_closed') return;
      giftBox.rootGroup.rotation.y += (e.clientX - prevX) * 0.008;
      giftBox.rootGroup.rotation.x += (e.clientY - prevY) * 0.005;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentStage = stageRef.current;

      if (!isDragging && currentStage === 'inspect_closed') {
        giftBox.rootGroup.rotation.y += 0.006;
        giftBox.rootGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
      }

      if (currentStage === 'box_tremors') {
        giftBox.setTremor(0.12);
      } else if (currentStage === 'light_leak') {
        giftBox.setTremor(0.04);
        giftBox.setOpenProgress(0.2);
      } else if (currentStage === 'mystery_silhouette' || currentStage === 'particle_buildup') {
        giftBox.setMode('silhouette');
        giftBox.setOpenProgress(0.85);
      } else if (currentStage === 'final_flash' || currentStage === 'envelope_closed') {
        giftBox.setMode('revealed');
        giftBox.setOpenProgress(0.9);
      } else if (currentStage === 'envelope_unfolding') {
        giftBox.setOpenProgress(1.0);
        camera.position.z = Math.max(3.8, camera.position.z - 0.03);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const triggerSuspenseSequence = () => {
    if (stageRef.current !== 'inspect_closed') return;
    updateStage('anticipation_rumble');
    audio.playHeartbeatPulse();

    // 1.5s: Box Tremors
    setTimeout(() => {
      updateStage('box_tremors');
      audio.playBoxTremor();
    }, 1500);

    setTimeout(() => {
      audio.playBoxTremor();
    }, 2300);

    setTimeout(() => {
      audio.playBoxTremor();
    }, 3000);

    // 3.5s: Light Leak from cracks
    setTimeout(() => {
      updateStage('light_leak');
      audio.playLightLeakChime();
    }, 3500);

    // 4.8s: Mystery Silhouette rotating in blinding light
    setTimeout(() => {
      updateStage('mystery_silhouette');
    }, 4800);

    // 6.2s: Particle Buildup
    setTimeout(() => {
      updateStage('particle_buildup');
    }, 6200);

    // 7.1s: Fake-out Blackout (0.5s dead silence)
    setTimeout(() => {
      updateStage('fakeout_blackout');
    }, 7100);

    // 7.6s: Comedic Duck Quack
    setTimeout(() => {
      updateStage('fakeout_quack');
      audio.playFakeoutQuack();
    }, 7600);

    // 7.9s: Final Flash & Reveal
    setTimeout(() => {
      updateStage('final_flash');
      audio.playFanfare();
    }, 7900);

    // 8.6s: Closed Envelope floating in spotlight
    setTimeout(() => {
      updateStage('envelope_closed');
    }, 8600);
  };

  const handleOpenEnvelope = () => {
    if (stageRef.current !== 'envelope_closed') return;
    updateStage('envelope_unfolding');
    audio.playWaxSealCrack();

    setTimeout(() => {
      onOpenLetter();
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen bg-[#06030e] text-white flex flex-col justify-between select-none overflow-hidden">
      <div
        ref={mountRef}
        onClick={triggerSuspenseSequence}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 1. Fullscreen Blackout Fakeout (0.5s dead silence) */}
      {suspenseStage === 'fakeout_blackout' && (
        <div className="absolute inset-0 z-50 bg-black pointer-events-none" />
      )}

      {/* 2. Fullscreen White-Gold Flash (at peak of reveal) */}
      {suspenseStage === 'final_flash' && (
        <div className="absolute inset-0 z-50 bg-gradient-to-r from-white via-yellow-100 to-white pointer-events-none animate-pulse" />
      )}

      {/* Top Bar */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-5xl mx-auto p-4 pointer-events-auto">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-xs font-mono-rhythm text-white/80 cursor-pointer"
        >
          ← BACK TO BALLROOM
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono-rhythm text-yellow-400 font-bold tracking-widest block uppercase">
            3D SPECIAL GIFT REVEAL
          </span>
          <span className="text-xs font-disco text-white/80">
            {suspenseStage === 'inspect_closed'
              ? 'DRAG TO ROTATE • CLICK TO OPEN'
              : 'REVEAL IN PROGRESS'}
          </span>
        </div>

        <button
          onClick={onOpenLetter}
          className="px-3.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/40 text-xs font-mono-rhythm text-yellow-300 font-bold cursor-pointer uppercase"
        >
          SKIP TO LETTER
        </button>
      </div>

      {/* Bottom Suspense & Interaction Controls */}
      <div className="relative z-30 pb-8 flex flex-col items-center gap-3 pointer-events-auto">
        {suspenseStage === 'inspect_closed' && (
          <button
            onClick={triggerSuspenseSequence}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-disco text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(250,204,21,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            START UNWRAPPING
          </button>
        )}

        {suspenseStage === 'anticipation_rumble' && (
          <div className="text-xs font-mono-rhythm text-yellow-300 font-bold uppercase tracking-widest animate-pulse">
            SOMETHING IS INSIDE...
          </div>
        )}

        {suspenseStage === 'box_tremors' && (
          <div className="text-xs font-mono-rhythm text-amber-400 font-bold uppercase tracking-widest animate-bounce">
            THE BOX IS SHAKING...
          </div>
        )}

        {suspenseStage === 'light_leak' && (
          <div className="text-xs font-mono-rhythm text-yellow-200 font-bold uppercase tracking-widest animate-pulse">
            LIGHT ESCAPING FROM THE EDGES...
          </div>
        )}

        {(suspenseStage === 'mystery_silhouette' || suspenseStage === 'particle_buildup') && (
          <div className="text-xs font-mono-rhythm text-cyan-300 font-bold uppercase tracking-widest animate-pulse">
            MYSTERY OBJECT EMERGING...
          </div>
        )}

        {suspenseStage === 'fakeout_quack' && (
          <div className="text-sm font-mono-rhythm text-yellow-400 font-bold uppercase tracking-widest">
            QUACK!
          </div>
        )}

        {suspenseStage === 'envelope_closed' && (
          <button
            onClick={handleOpenEnvelope}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-disco text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(250,204,21,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-bounce"
          >
            OPEN THE LETTER
          </button>
        )}

        {suspenseStage === 'envelope_unfolding' && (
          <div className="text-xs font-mono-rhythm text-yellow-300 font-bold uppercase tracking-widest animate-pulse">
            UNFOLDING THE LETTER...
          </div>
        )}

        <span className="text-[11px] font-mono-rhythm text-white/50">
          {suspenseStage === 'inspect_closed'
            ? 'Drag to inspect all six faces of the custom gift box.'
            : 'Watch the mystery unfold.'}
        </span>
      </div>
    </div>
  );
};
