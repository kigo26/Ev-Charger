/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import type { Charger, SystemStats } from './types';
import { QrCode, LayoutDashboard, History, Settings, Zap, PlusCircle, MinusCircle, Activity, Menu, X } from 'lucide-react';
import StationVisualizer from './components/StationVisualizer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import QRScanner from './components/QRScanner';
import ChargerCard from './components/ChargerCard';
import BatteryReceipt from './components/BatteryReceipt';
import ReportIssueModal from './components/ReportIssueModal';
import SwapHistory from './components/SwapHistory';
import SystemStatsComponent from './components/SystemStats';

export default function App() {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBattery, setScannedBattery] = useState<{ numberOfBatteries: number, amountPaid: string, totalReceived: string, ownerName: string, collectionTime: string, issueTime: string } | null>(null);
  const [reportingChargerId, setReportingChargerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Swaps'>('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/chargers')
        .then(res => res.json())
        .then(data => setChargers(data));
      fetch('/api/system-stats')
        .then(res => res.json())
        .then(data => setSystemStats(data));
    };

    fetchData();

    if (isPolling) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isPolling]);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#C5C6C7] font-mono flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#1F2833] border-b border-[#45A29E]/30 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Zap className="text-[#66FCF1]" size={24} />
          <h1 className="text-[#66FCF1] font-bold text-lg tracking-tighter">EV System</h1>
        </div>
        <button className="text-[#66FCF1]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`w-full lg:w-64 lg:h-screen lg:sticky lg:top-0 border-r-0 lg:border-r border-[#45A29E]/30 bg-[#1F2833] flex flex-col justify-between z-10 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[1000px] p-6 border-b lg:border-b-0' : 'max-h-0 lg:max-h-none overflow-hidden lg:p-6 lg:overflow-y-auto'}`}>
        <div>
          <div className="hidden lg:flex items-center gap-2 mb-10">
            <Zap className="text-[#66FCF1]" size={24} />
            <h1 className="text-[#66FCF1] font-bold text-lg tracking-tighter">EV System</h1>
          </div>
          <nav className="flex flex-col gap-6">
            <button onClick={() => { setActiveTab('Dashboard'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 text-sm font-bold uppercase tracking-widest ${activeTab === 'Dashboard' ? 'text-[#66FCF1]' : 'text-gray-500'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setActiveTab('Swaps'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 text-sm font-bold uppercase tracking-widest ${activeTab === 'Swaps' ? 'text-[#66FCF1]' : 'text-gray-500'}`}>
                <History size={18} /> Swap History
              </button>
              <div className="flex flex-col gap-2 pl-9">
                <button onClick={() => console.log('Add Battery')} className="flex items-center gap-2 text-gray-500 text-xs hover:text-[#66FCF1] text-left"><PlusCircle size={14} /> Add Battery</button>
                <button onClick={() => console.log('Remove Battery')} className="flex items-center gap-2 text-gray-500 text-xs hover:text-[#66FCF1] text-left"><MinusCircle size={14} /> Remove Battery</button>
                <button onClick={() => console.log('System Diagnosis')} className="flex items-center gap-2 text-gray-500 text-xs hover:text-[#66FCF1] text-left"><Activity size={14} /> System Diagnosis</button>
              </div>
            </div>
          </nav>
        </div>
        <div className="flex flex-col gap-4 mt-8 lg:mt-0">
          <button 
            onClick={() => { setShowScanner(!showScanner); setIsMobileMenuOpen(false); }}
            className={`flex items-center justify-center lg:justify-start gap-3 text-xs border border-gray-500 p-3 w-full transition-colors ${showScanner ? 'border-[#66FCF1] text-[#66FCF1]' : 'text-gray-500 hover:text-[#66FCF1] hover:border-[#66FCF1]'}`}
          >
            <QrCode size={16} /> Scan Battery
          </button>
          <button 
            onClick={() => setIsPolling(!isPolling)}
            className={`flex items-center justify-center lg:justify-start gap-3 text-xs border border-gray-500 p-3 w-full transition-colors ${isPolling ? 'border-[#66FCF1] text-[#66FCF1]' : 'text-gray-500 hover:text-[#66FCF1] hover:border-[#66FCF1]'}`}
          >
            <Settings size={16} /> {isPolling ? 'Polling: ON' : 'Polling: OFF'}
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-h-screen min-w-0">
        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto">
          {showScanner && (
            <div className="mb-8">
              <QRScanner onScan={(data) => { 
                  const issueTime = new Date().toLocaleTimeString();
                  const collectionTime = new Date(Date.now() + 30 * 60000).toLocaleTimeString();
                  setScannedBattery({ numberOfBatteries: 2, amountPaid: 'KES 250', totalReceived: 'KES 250', ownerName: 'User_' + Math.floor(Math.random() * 1000), collectionTime, issueTime }); 
                  setShowScanner(false); 
              }} />
            </div>
          )}

          {scannedBattery && (
            <div className="mb-8 relative z-10 w-full max-w-lg mx-auto">
              <BatteryReceipt 
                numberOfBatteries={scannedBattery.numberOfBatteries}
                amountPaid={scannedBattery.amountPaid}
                totalReceived={scannedBattery.totalReceived}
                ownerName={scannedBattery.ownerName}
                collectionTime={scannedBattery.collectionTime}
                issueTime={scannedBattery.issueTime}
                onClose={() => setScannedBattery(null)}
              />
            </div>
          )}
          
          {activeTab === 'Dashboard' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
                  <AnalyticsDashboard />
                </div>
                <div className="w-full">
                  <StationVisualizer chargers={chargers} />
                </div>
                <div className="w-full">
                  {systemStats && <SystemStatsComponent stats={systemStats} />}
                </div>
              </div>
              <div className="grid gap-4 md:gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {chargers.map(charger => (
                  <ChargerCard 
                    key={charger.id} 
                    charger={charger} 
                    onReportIssue={setReportingChargerId}
                  />
                ))}
              </div>
            </>
          ) : (
            <SwapHistory />
          )}
        </main>

        {reportingChargerId && (
          <ReportIssueModal 
            chargerId={reportingChargerId} 
            onClose={() => setReportingChargerId(null)} 
          />
        )}

        <footer className="py-6 border-t border-[#45A29E]/20 text-center text-sm text-gray-500 bg-[#0B0C10] mt-auto">
          <p>
            Kepler Camp Codes • <a href="mailto:jamenya1988@gmail.com" className="text-[#66FCF1] hover:underline">jamenya1988@gmail.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
