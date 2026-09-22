import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AudioManager } from '../audio/AudioManager';
import { DEFAULT_GIFT_DIMENSIONS, DEFAULT_GIFT_TEXTURES } from '../config/level4Config';
import { createGiftBoxMesh, GiftBoxModel } from './GiftBox';

interface GiftReveal3DProps {
  onOpenLetter: () => void;
  onExit: () => void;
}

export const GiftReveal3D: React.FC<GiftReveal3DProps> = ({ onOpenLetter, onExit }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const audio = AudioManager.getInstance();

  const isOpeningRef = useRef(false);
  const modelRef = useRef<GiftBoxModel | null>(null);

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
    const onMouseDown = (e: MouseEvent) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || isOpeningRef.current) return;
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
    let openProgress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      if (!isDragging && !isOpeningRef.current) {
        giftBox.rootGroup.rotation.y += 0.006;
        giftBox.rootGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
      }
      if (isOpeningRef.current && openProgress < 1) {
        openProgress += delta / 2.2;
        giftBox.setOpenProgress(openProgress);
        if (openProgress >= 1) setHasOpened(true);
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

  const handleOpenBox = () => {
    if (isOpening || hasOpened) return;
    setIsOpening(true);
    isOpeningRef.current = true;
    audio.playBoxOpen();
    setTimeout(() => setHasOpened(true), 2400);
  };

  return (
    <div className="relative w-full h-screen bg-[#06030e] text-white flex flex-col justify-between select-none overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

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
            DRAG TO ROTATE • CLICK TO OPEN
          </span>
        </div>

        <button
          onClick={onOpenLetter}
          className="px-3.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/40 text-xs font-mono-rhythm text-yellow-300 font-bold cursor-pointer"
        >
          SKIP TO LETTER ✉️
        </button>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-30 pb-8 flex flex-col items-center gap-3 pointer-events-auto">
        {!isOpening && !hasOpened && (
          <button
            onClick={handleOpenBox}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-disco text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(250,204,21,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            ✨ UNWRAP & OPEN THE BOX ✨
          </button>
        )}

        {isOpening && !hasOpened && (
          <div className="text-sm font-mono-rhythm text-yellow-300 font-bold uppercase tracking-widest animate-pulse">
            OPENING THE GIFT BOX...
          </div>
        )}

        {hasOpened && (
          <button
            onClick={onOpenLetter}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-disco text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(34,211,238,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-bounce"
          >
            ✉️ READ THE LETTER ✉️
          </button>
        )}

        <span className="text-[11px] font-mono-rhythm text-white/50">
          Click and drag in any direction to inspect the custom gift wrap.
        </span>
      </div>
    </div>
  );
};
