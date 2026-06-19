import { Power, Zap, AlertTriangle, BatteryCharging, CheckCircle } from 'lucide-react';
import type { Charger } from '../types';

export default function SlotStatusIndicator({ status }: { status: Charger['status'] }) {
  const config: Record<Charger['status'], { icon: typeof Power, color: string, label: string }> = {
    IDLE: { icon: Power, color: 'text-gray-400', label: 'Idle' },
    CHARGING: { icon: BatteryCharging, color: 'text-[#66FCF1]', label: 'Charging' },
    SWAP_STATION: { icon: CheckCircle, color: 'text-green-500', label: 'Ready' },
    FAULT: { icon: AlertTriangle, color: 'text-red-500', label: 'Fault' },
    RECEIVING: { icon: Zap, color: 'text-amber-400', label: 'Receiving' }
  };
  
  const { icon: Icon, color, label } = config[status] || config.IDLE;
  return (
    <div className={`flex items-center gap-1.5 ${color}`}>
      <Icon className="size-4" />
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
  );
}
