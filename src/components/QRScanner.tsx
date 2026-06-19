import { Scanner } from '@yudiel/react-qr-scanner';
import { useToast } from './ToastProvider';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const { addToast } = useToast();

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-sm border border-[#45A29E]/30">
      <Scanner
        onResult={(text) => {
          if (text) {
            onScan(text);
            addToast('Battery Identified: ' + text, 'success');
          }
        }}
        onError={(error) => {
          console.error(error);
          addToast('QR Scan Error: Check camera permissions', 'error');
        }}
      />
    </div>
  );
}
