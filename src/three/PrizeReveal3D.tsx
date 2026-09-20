import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PrizeReveal3DProps {
  onClose?: () => void;
}

export const PrizeReveal3D: React.FC<PrizeReveal3DProps> = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070312);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir1 = new THREE.DirectionalLight(0xfacc15, 3.0);
    dir1.position.set(4, 6, 4);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xec4899, 2.5);
    dir2.position.set(-4, -2, -3);
    scene.add(dir2);

    // 1. Golden Egg
    const eggGroup = new THREE.Group();
    const eggGeo = new THREE.SphereGeometry(1.2, 32, 24);
    eggGeo.scale(1, 1.35, 1);
    const eggMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.15,
    });
    const eggMesh = new THREE.Mesh(eggGeo, eggMat);
    eggGroup.add(eggMesh);

    // 2. Orbiting 3 Artifacts
    const artifactColors = [0x06b6d4, 0xfacc15, 0xec4899];
    const artifacts: THREE.Mesh[] = [];

    artifactColors.forEach((col) => {
      const artGeo = new THREE.TorusGeometry(0.2, 0.08, 16, 32);
      const artMat = new THREE.MeshStandardMaterial({
        color: col,
        metalness: 0.8,
        emissive: col,
        emissiveIntensity: 0.5,
      });
      const artMesh = new THREE.Mesh(artGeo, artMat);
      scene.add(artMesh);
      artifacts.push(artMesh);
    });

    // 3. Golden Duck Figurine
    const duckGroup = new THREE.Group();
    const duckBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.1 })
    );
    duckBody.position.y = 1.6;
    duckGroup.add(duckBody);

    const glasses = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.15, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.9 })
    );
    glasses.position.set(0, 1.7, 0.5);
    duckGroup.add(glasses);

    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0xff6600 })
    );
    beak.rotateX(Math.PI / 2);
    beak.position.set(0, 1.55, 0.65);
    duckGroup.add(beak);

    scene.add(eggGroup);
    scene.add(duckGroup);

    // Interactive Drag
    let isDragging = false;
    let prevX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      eggGroup.rotation.y += deltaX * 0.01;
      duckGroup.rotation.y += deltaX * 0.01;
      prevX = e.clientX;
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (!isDragging) {
        eggGroup.rotation.y += 0.01;
        duckGroup.rotation.y += 0.015;
      }

      artifacts.forEach((art, i) => {
        const angle = time * 2 + (i * Math.PI * 2) / 3;
        art.position.x = Math.cos(angle) * 1.8;
        art.position.z = Math.sin(angle) * 1.8;
        art.position.y = Math.sin(time * 3 + i) * 0.4;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[340px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-yellow-400/50 shadow-[0_0_50px_rgba(234,179,8,0.4)]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-black/60 border border-yellow-400/60 text-xs font-mono-rhythm text-yellow-300 font-bold uppercase">
          ✨ 3D GOLDEN DISCO DUCK PRIZE
        </span>
      </div>
      <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
        <span className="text-[10px] font-mono-rhythm text-white/70 uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
          DRAG MOUSE TO INSPECT 3D PRIZE
        </span>
      </div>
    </div>
  );
};
