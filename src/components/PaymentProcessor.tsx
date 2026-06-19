import { useState } from 'react';
import { useToast } from './ToastProvider';

interface PaymentProcessorProps {
  chargerId: string;
  onSuccess: () => void;
}

export default function PaymentProcessor({ chargerId, onSuccess }: PaymentProcessorProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, amount: parseFloat(amount), chargerId }),
      });
      const data = await response.json();
      if (data.success) {
        addToast('STK push initiated! Check your phone.', 'success');
        onSuccess();
      } else {
        addToast('Failed to initiate payment.', 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      addToast('Network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[#45A29E]/30">
      <div>
        <label className="block text-[9px] uppercase text-gray-400 mb-1">M-PESA Phone Number</label>
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="2547XXXXXXXX"
          className="w-full bg-[#0B0C10] border border-[#45A29E] p-2 text-xs text-white"
        />
      </div>
      <div>
        <label className="block text-[9px] uppercase text-gray-400 mb-1">Amount (KES)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-[#0B0C10] border border-[#45A29E] p-2 text-xs text-white"
        />
      </div>
      <button 
        onClick={initiatePayment}
        disabled={loading}
        className="w-full bg-[#66FCF1] text-[#0B0C10] py-2 text-xs font-bold uppercase tracking-tighter hover:bg-[#45A29E] transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Initiate STK Push'}
      </button>
    </div>
  );
}
