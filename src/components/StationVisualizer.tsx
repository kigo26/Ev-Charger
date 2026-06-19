import { Battery } from 'lucide-react';
import type { Charger } from '../types';

interface StationVisualizerProps {
  chargers: Charger[];
}

export default function StationVisualizer({ chargers }: StationVisualizerProps) {
  // Sort chargers to ensure they appear in A-F slots based on id or name
  const slots = [...chargers].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 6);

  return (
    <div className="rounded-sm border border-[#45A29E]/30 bg-[#1F2833] p-6 mb-8">
      <h3 className="text-sm font-bold text-[#66FCF1] uppercase mb-6 tracking-widest text-center">Swap Station Physical Layout</h3>
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {['A', 'B', 'C', 'D', 'E', 'F'].map((slotId, index) => {
          const charger = slots[index];
          const isCharging = charger?.status === 'CHARGING';
          const isFull = charger?.status === 'SWAP_STATION';
          const isFault = charger?.status === 'FAULT';
          
          return (
            <div 
              key={slotId}
              className={`border-2 p-4 rounded-sm flex items-center justify-between ${
                isFault ? 'border-red-500 bg-red-900/20' : 
                isCharging ? 'border-[#66FCF1] bg-[#66FCF1]/10' : 
                isFull ? 'border-[#66FCF1] bg-[#66FCF1]/20' : 'border-gray-600 bg-[#0B0C10]'
              }`}
            >
              <span className="text-2xl font-bold text-gray-500">{slotId}</span>
              <Battery className={`size-8 ${isFault ? 'text-red-500' : 'text-[#66FCF1]'}`} />
              <div className="text-right">
                <p className="text-[10px] text-gray-400">{charger?.name || 'Empty'}</p>
                {charger && <p className="text-xs font-bold text-white">{charger.percentage || 0}%</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
