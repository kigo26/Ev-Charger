export interface Charger {
  id: string;
  name: string;
  status: 'IDLE' | 'CHARGING' | 'FAULT' | 'SWAP_STATION' | 'RECEIVING';
  voltage: 48 | 60 | 72 | 0;
  current: number;
  percentage?: number;
  batteryChemistry: 'Li-ion' | 'LiFePO4';
  temperature: number;
  reservedUntil?: number;
}

export interface SystemStats {
  incomerVoltage: number;
  incomerCurrent: number;
  phaseBalance: {
    L1: number;
    L2: number;
    L3: number;
  };
}

export interface SwapLog {
  id: string;
  batteryId: string;
  timestamp: number;
  energyTransferred: number;
  triggeredBy: 'OPERATOR' | 'AUTOMATED';
  operatorId?: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
