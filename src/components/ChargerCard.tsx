import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Charger } from '../types';
import PaymentProcessor from './PaymentProcessor';
import SlotStatusIndicator from './SlotStatusIndicator';
import { BatteryManager } from '../services/BatteryManager';

interface ChargerCardProps {
  charger: Charger;
  onReportIssue: (id: string) => void;
  key?: string | number;
}

export default function ChargerCard({ charger, onReportIssue }: ChargerCardProps) {
  const [hasPaid, setHasPaid] = useState(false);
  
  const handleAction = async (action: () => Promise<Response>) => {
    try {
      await action();
      window.location.reload();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div className={`rounded-md border border-[#45A29E]/20 bg-[#1F2833] p-4 flex flex-col justify-between h-full shadow-inner ${['IDLE', 'FAULT'].includes(charger.status) ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#66FCF1]">{charger.name}</h2>
        <SlotStatusIndicator status={charger.status} />
      </div>
      
      <div className="space-y-1.5 text-xs text-gray-400">
        <p>Voltage: <span className="text-white font-mono">{charger.voltage}V</span></p>
        <p>Current: <span className="text-white font-mono">{charger.current}A</span></p>
        <p className="flex items-center justify-between">
          Temperature: 
          <span className={charger.temperature > 60 ? "text-amber-500 font-bold flex items-center gap-1" : "text-white"}>
            {charger.temperature}°C {charger.temperature > 60 && <AlertTriangle className="size-3" />}
          </span>
        </p>
        {(charger.status === 'CHARGING' || charger.status === 'SWAP_STATION') && charger.percentage !== undefined && (
          <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
            <div className="h-full bg-[#66FCF1] rounded-full transition-all duration-500" style={{ width: `${charger.percentage}%` }}></div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {charger.status === 'IDLE' && (
          <button 
            onClick={() => handleAction(() => BatteryManager.receiveBattery(charger.id))} 
            className="w-full bg-[#45A29E]/20 text-[#66FCF1] border border-[#45A29E] text-[10px] font-bold p-2 uppercase hover:bg-[#45A29E]/40 transition-colors"
          >
            Receive Battery
          </button>
        )}
        {charger.status === 'RECEIVING' && (
          <button 
            onClick={() => handleAction(() => BatteryManager.startCharging(charger.id, hasPaid))} 
            className="w-full bg-[#66FCF1] text-[#0B0C10] text-[10px] font-bold p-2 uppercase hover:bg-[#55d9d1] transition-colors"
          >
            Start Charging
          </button>
        )}
        {['CHARGING', 'SWAP_STATION'].includes(charger.status) && (
          <button 
            onClick={() => handleAction(() => BatteryManager.releaseBattery(charger.id))} 
            className="w-full border border-gray-600 text-gray-300 text-[10px] font-bold p-2 uppercase hover:bg-gray-700 transition-colors"
          >
            Release Battery
          </button>
        )}
        
        <div className="flex gap-2">
          {charger.status === 'IDLE' && (
            <div className="flex-grow">
              <PaymentProcessor chargerId={charger.id} onSuccess={() => setHasPaid(true)} />
            </div>
          )}
          <button 
            onClick={() => onReportIssue(charger.id)}
            className="flex-grow bg-[#111] text-gray-500 border border-gray-800 text-[10px] font-bold p-2 uppercase hover:text-gray-300 transition-colors"
          >
            Issue
          </button>
        </div>
      </div>
    </div>
  );
}
