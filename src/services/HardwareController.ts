export const HardwareController = {
  receiveBattery: async (chargerId: string) => {
    return fetch('/api/charger/status', {
      method: 'POST',
      body: JSON.stringify({ chargerId, status: 'RECEIVING' }),
      headers: { 'Content-Type': 'application/json' }
    });
  },

  startCharging: async (chargerId: string) => {
    return fetch('/api/charger/status', {
      method: 'POST',
      body: JSON.stringify({ chargerId, status: 'CHARGING' }),
      headers: { 'Content-Type': 'application/json' }
    });
  },

  releaseBattery: async (chargerId: string) => {
    return fetch('/api/charger/status', {
      method: 'POST',
      body: JSON.stringify({ chargerId, status: 'IDLE' }),
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
