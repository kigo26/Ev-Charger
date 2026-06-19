export default function BatteryReceipt({ 
  numberOfBatteries, 
  amountPaid,
  totalReceived,
  ownerName,
  collectionTime,
  issueTime,
  onClose 
}: { 
  numberOfBatteries: number, 
  amountPaid: string,
  totalReceived: string,
  ownerName: string,
  collectionTime: string,
  issueTime: string,
  onClose: () => void 
}) {
  return (
    <div className="bg-[#1F2833] p-6 rounded-lg border border-[#66FCF1]/30 my-8 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white">✕</button>
      <h2 className="text-[#66FCF1] font-bold text-lg mb-4">Battery Received</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <p className="text-gray-400">Number of Batteries: <span className="text-white">{numberOfBatteries}</span></p>
        <p className="text-gray-400">Amount Paid: <span className="text-white">{amountPaid}</span></p>
        <p className="text-gray-400">Total Received: <span className="text-white">{totalReceived}</span></p>
        <p className="text-gray-400">Owner: <span className="text-white">{ownerName}</span></p>
        <p className="text-gray-400">Collection Time: <span className="text-white">{collectionTime}</span></p>
        <p className="text-gray-400">Issue Time: <span className="text-white">{issueTime}</span></p>
      </div>
    </div>
  );
}
