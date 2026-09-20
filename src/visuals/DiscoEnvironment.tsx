import React, { useEffect, useRef } from 'react';
import { AudioAnalyser } from '../audio/AudioAnalyser';

interface DiscoEnvironmentProps {
  analyser?: AudioAnalyser;
  intensity?: number; // 0.25 to 1.0
  reducedMotion?: boolean;
}

export const DiscoEnvironment: React.FC<DiscoEnvironmentProps> = ({
  analyser,
  intensity = 0.5,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool for high frequency disco glitter
    const particleCount = reducedMotion ? 20 : Math.floor(60 * intensity);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 1.5 + 0.5),
      speedX: (Math.random() - 0.5) * 0.8,
      hue: Math.random() > 0.5 ? 310 : 190, // magenta or cyan
      alpha: Math.random() * 0.7 + 0.3,
    }));

    // Lasers (number scales with level intensity)
    const laserCount = Math.max(2, Math.floor(6 * intensity));
    let time = 0;

    const render = () => {
      time += 0.02;
      const energy = analyser?.getEnergy() ?? { bass: 0.1, mid: 0.1, high: 0.1, overall: 0.1 };

      const effectiveBass = energy.bass * intensity;
      const effectiveMid = energy.mid * intensity;
      const effectiveHigh = energy.high * intensity;

      // Dark nightclub background with bass glow
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        50,
        width / 2,
        height * 0.5,
        width * 0.8
      );
      const bassPulse = reducedMotion ? 0.1 : effectiveBass * 0.4;
      bgGrad.addColorStop(0, `rgba(${30 + bassPulse * 70}, 10, ${60 + bassPulse * 90}, 1)`);
      bgGrad.addColorStop(0.7, '#080512');
      bgGrad.addColorStop(1, '#040209');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Disco Lasers
      ctx.save();
      for (let i = 0; i < laserCount; i++) {
        const angle = Math.sin(time * 0.8 + i * 1.4) * 0.75 + (i / laserCount) * Math.PI - Math.PI / 2;
        const originX = (width / (laserCount + 1)) * (i + 1);
        const originY = 0;
        const endX = originX + Math.sin(angle) * height * 1.4;
        const endY = height;

        const laserGrad = ctx.createLinearGradient(originX, originY, endX, endY);
        const isCyan = i % 2 === 0;
        const alpha = (0.15 + effectiveHigh * 0.45);
        laserGrad.addColorStop(0, isCyan ? `rgba(6, 182, 212, ${alpha * 1.5})` : `rgba(236, 72, 153, ${alpha * 1.5})`);
        laserGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.strokeStyle = laserGrad;
        ctx.lineWidth = 3 + effectiveBass * 6;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      ctx.restore();

      // Disco Floor Grid Perspective
      const horizonY = height * 0.65;
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, 'rgba(236, 72, 153, 0.05)');
      floorGrad.addColorStop(1, 'rgba(6, 182, 212, 0.25)');

      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Floor grid lines
      ctx.save();
      ctx.strokeStyle = `rgba(236, 72, 153, ${0.2 + effectiveBass * 0.3})`;
      ctx.lineWidth = 1.5;
      const perspectiveLines = 16;
      for (let i = 0; i <= perspectiveLines; i++) {
        const xBottom = (width / perspectiveLines) * i;
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal lines
      const hLineCount = 8;
      for (let j = 1; j <= hLineCount; j++) {
        const t = Math.pow(j / hLineCount, 2);
        const y = horizonY + t * (height - horizonY);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 + effectiveMid * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Floating glitter particles
      ctx.save();
      for (const p of particles) {
        p.y += p.speedY * (1 + effectiveHigh * 2);
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha * (0.5 + effectiveHigh)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + effectiveHigh), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [analyser, intensity, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.95 }}
    />
  );
};
