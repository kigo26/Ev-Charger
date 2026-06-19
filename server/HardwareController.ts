
export const HardwareController = {
  // Simulates talking to physical hardware.
  // In a real device, this would call specialized SDKs or driver interfaces.
  applyCommand: (chargerId: string, status: string, chargers: any[]) => {
    const charger = chargers.find(c => c.id === chargerId);
    if (!charger) throw new Error("Charger not found");
    charger.status = status;
    return charger;
  }
};
