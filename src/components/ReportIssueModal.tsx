import { X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface ReportIssueModalProps {
  chargerId: string;
  onClose: () => void;
}

export default function ReportIssueModal({ chargerId, onClose }: ReportIssueModalProps) {
  const [category, setCategory] = useState('Connector Damage');
  const { addToast } = useToast();

  const handleSubmit = () => {
    console.log(`Fault logged for charger ${chargerId}: ${category}`);
    addToast(`Issue reported for ${chargerId}: ${category}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1F2833] border border-[#45A29E] p-6 rounded-sm w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#66FCF1]">Report Issue</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-[#0B0C10] border border-gray-600 p-2 text-sm text-white mb-4"
        >
          <option>Connector Damage</option>
          <option>Connectivity Loss</option>
          <option>Cooling System Failure</option>
          <option>Other</option>
        </select>
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#66FCF1] text-[#0B0C10] font-bold p-2 text-xs uppercase tracking-wider"
        >
          Log Issue
        </button>
      </div>
    </div>
  );
}
