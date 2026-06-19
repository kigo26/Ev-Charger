import { SystemStats } from '../types';
import { AlertTriangle } from 'lucide-react';

export default function SystemStatsComponent({ stats }: { stats: SystemStats }) {
    const isLowVoltage = stats.incomerVoltage < 220;
    const isLowCurrent = stats.incomerCurrent < 10;

    return (
        <div className={`bg-[#1F2833] p-6 rounded-lg border ${isLowVoltage || isLowCurrent ? 'border-amber-500/50' : 'border-[#66FCF1]/30'} transition-colors duration-500`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className={`font-bold text-lg ${isLowVoltage || isLowCurrent ? 'text-amber-400' : 'text-[#66FCF1]'}`}>Incomer Station</h2>
                {(isLowVoltage || isLowCurrent) && <AlertTriangle className="text-amber-500 w-5 h-5 animate-pulse" />}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="text-gray-400">Voltage: <span className={`font-medium ${isLowVoltage ? 'text-amber-400 animate-pulse' : 'text-white'}`}>{stats.incomerVoltage}V {isLowVoltage && '(LOW)'}</span></p>
                <p className="text-gray-400">Current: <span className={`font-medium ${isLowCurrent ? 'text-amber-400 animate-pulse' : 'text-white'}`}>{stats.incomerCurrent}A {isLowCurrent && '(LOW)'}</span></p>
            </div>
            <div className="mt-4">
                <h3 className="text-gray-500 text-xs uppercase mb-2">Phase Balance</h3>
                <div className="flex gap-4">
                     <p className="text-gray-400">L1: <span className="text-white">{stats.phaseBalance.L1}</span></p>
                     <p className="text-gray-400">L2: <span className="text-white">{stats.phaseBalance.L2}</span></p>
                     <p className="text-gray-400">L3: <span className="text-white">{stats.phaseBalance.L3}</span></p>
                </div>
            </div>
        </div>
    )
}
