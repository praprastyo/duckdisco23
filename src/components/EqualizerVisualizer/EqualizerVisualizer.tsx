import React from 'react';
import { EnergyData } from '../../audio/AudioAnalyser';

interface EqualizerVisualizerProps {
  energy?: EnergyData;
}

export const EqualizerVisualizer: React.FC<EqualizerVisualizerProps> = ({
  energy = { bass: 0.2, lowMid: 0.2, mid: 0.2, high: 0.2, overall: 0.2 },
}) => {
  const bands = [
    { label: 'SUB', val: energy.bass * 1.3 },
    { label: 'BASS', val: energy.bass },
    { label: 'LOW', val: energy.lowMid },
    { label: 'MID', val: energy.mid },
    { label: 'HIGH', val: energy.high },
    { label: 'AIR', val: energy.high * 1.2 },
  ];

  const totalSegments = 10;

  return (
    <div className="hidden md:flex items-end gap-2 bg-black/40 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm pointer-events-none select-none">
      {bands.map((band, idx) => {
        const activeCount = Math.min(totalSegments, Math.max(1, Math.round(band.val * totalSegments * 1.2)));

        return (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div className="flex flex-col-reverse gap-0.5 h-16 w-3 justify-start">
              {Array.from({ length: totalSegments }).map((_, segIdx) => {
                const isActive = segIdx < activeCount;
                let colorClass = 'bg-emerald-500 shadow-[0_0_6px_#10b981]';
                if (segIdx >= 8) colorClass = 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
                else if (segIdx >= 6) colorClass = 'bg-yellow-400 shadow-[0_0_6px_#facc15]';

                return (
                  <div
                    key={segIdx}
                    className={`w-full h-1 rounded-[1px] transition-all duration-75 ${
                      isActive ? colorClass : 'bg-white/5'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[7px] font-mono-rhythm text-white/40">{band.label}</span>
          </div>
        );
      })}
    </div>
  );
};
