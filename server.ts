import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { HardwareController } from './server/HardwareController';
import { Charger } from './src/types';

let chargers: Charger[] = [
  { id: "1", name: "Battery A", status: "IDLE", voltage: 48, current: 0, percentage: 0, batteryChemistry: 'Li-ion', temperature: 35 },
  { id: "2", name: "Battery B", status: "CHARGING", voltage: 72, current: 20, percentage: 45, batteryChemistry: 'LiFePO4', temperature: 55 },
  { id: "3", name: "Battery C", status: "SWAP_STATION", voltage: 0, current: 0, percentage: 88, batteryChemistry: 'LiFePO4', temperature: 65 },
  { id: "4", name: "Battery D", status: "IDLE", voltage: 48, current: 0, percentage: 20, batteryChemistry: 'Li-ion', temperature: 30 },
  { id: "5", name: "Battery E", status: "CHARGING", voltage: 60, current: 15, percentage: 60, batteryChemistry: 'Li-ion', temperature: 40 },
  { id: "6", name: "Battery F", status: "FAULT", voltage: 0, current: 0, percentage: 10, batteryChemistry: 'LiFePO4', temperature: 80 },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/chargers", (req, res) => {
    res.json(chargers);
  });

  app.post("/api/reserve", (req, res) => {
    const { chargerId } = req.body;
    const charger = chargers.find(c => c.id === chargerId);
    if (!charger) return res.status(404).json({ error: "Charger not found" });

    charger.reservedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
    res.json(charger);
  });

  app.post("/api/charger/status", (req, res) => {
    const { chargerId, status } = req.body;
    try {
        const charger = HardwareController.applyCommand(chargerId, status, chargers);
        res.json(charger);
    } catch(e) {
        return res.status(404).json({ error: (e as Error).message });
    }
  });

  app.post("/api/payment/stk-push", (req, res) => {
    const { phoneNumber, amount, chargerId } = req.body;
    
    // Simulate real M-PESA API call here
    console.log(`Initiating STK Push for ${phoneNumber}, Amount: ${amount}, Charger: ${chargerId}`);
    
    res.json({ success: true, message: "STK push initiated successfully" });
  });

  app.get("/api/analytics", (req, res) => {
    res.json([
      { date: "Mon", numberOfBatteries: 24, amountPaid: 4000, totalReceived: 4500 },
      { date: "Tue", numberOfBatteries: 13, amountPaid: 3000, totalReceived: 3200 },
      { date: "Wed", numberOfBatteries: 50, amountPaid: 9800, totalReceived: 10000 },
      { date: "Thu", numberOfBatteries: 39, amountPaid: 2800, totalReceived: 2900 },
      { date: "Fri", numberOfBatteries: 48, amountPaid: 4800, totalReceived: 5000 },
      { date: "Sat", numberOfBatteries: 38, amountPaid: 3800, totalReceived: 4000 },
      { date: "Sun", numberOfBatteries: 43, amountPaid: 4300, totalReceived: 4500 },
    ]);
  });

  app.get("/api/swaps", (req, res) => {
    res.json([
      { id: "1", batteryId: "BAT-101", timestamp: Date.now() - 3600000, energyTransferred: 4.5 },
      { id: "2", batteryId: "BAT-202", timestamp: Date.now() - 7200000, energyTransferred: 3.2 },
      { id: "3", batteryId: "BAT-303", timestamp: Date.now() - 10800000, energyTransferred: 5.1 },
    ]);
  });

  app.get("/api/system-stats", (req, res) => {
    res.json({
        incomerVoltage: 195,
        incomerCurrent: 8,
        phaseBalance: {
            L1: 0.98,
            L2: 0.95,
            L3: 0.97
        }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
