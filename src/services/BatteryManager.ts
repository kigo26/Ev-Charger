export const BatteryManager = {
  receiveBattery: async (chargerId: string) => {
    return fetch('/api/charger/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chargerId, status: 'RECEIVING' }),
    }).then(res => res.json());
  },
  startCharging: async (chargerId: string, hasPaid: boolean) => {
    if (!hasPaid) {
      throw new Error("Payment required to start charging.");
    }
    return fetch('/api/charger/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chargerId, status: 'CHARGING' }),
    }).then(res => res.json());
  },
  releaseBattery: async (chargerId: string) => {
    return fetch('/api/charger/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chargerId, status: 'IDLE' }),
    }).then(res => res.json());
  },
};
