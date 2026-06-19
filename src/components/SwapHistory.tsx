import { useEffect, useState } from 'react';
import type { SwapLog } from '../types';

export default function SwapHistory() {
  const [logs, setLogs] = useState<SwapLog[]>([]);

  useEffect(() => {
    fetch('/api/swaps')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div className="rounded-sm border border-[#45A29E]/30 bg-[#1F2833] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#66FCF1] uppercase tracking-widest">Battery Swap History</h3>
        <button onClick={() => window.print()} className="text-xs bg-[#45A29E] text-white px-3 py-1 rounded">Print Audit Log</button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-xs text-[#66FCF1] border-b border-gray-600 pb-2 font-bold">
            <span>Battery</span>
            <span>Date/Time</span>
            <span>Trigger</span>
            <span>Operator</span>
            <span>Energy</span>
        </div>
        {logs.map(log => (
          <div key={log.id} className="flex justify-between text-xs text-white border-b border-gray-600 pb-2">
            <span>{log.batteryId}</span>
            <span>{new Date(log.timestamp).toLocaleString()}</span>
            <span>{log.triggeredBy}</span>
            <span>{log.operatorId || 'N/A'}</span>
            <span>{log.energyTransferred} kWh</span>
          </div>
        ))}
      </div>
    </div>
  );
}
