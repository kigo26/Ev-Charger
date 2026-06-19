import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-sm border ${
              toast.type === 'success' 
                ? 'bg-[#1F2833] border-emerald-500 text-emerald-400' 
                : toast.type === 'error'
                ? 'bg-[#1F2833] border-red-500 text-red-400'
                : 'bg-[#1F2833] border-[#66FCF1] text-[#66FCF1]'
            } shadow-lg shadow-black/50`}
          >
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span className="text-xs font-mono">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
