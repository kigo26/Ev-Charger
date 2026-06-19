import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsData {
  date: string;
  numberOfBatteries: number;
  amountPaid: number;
  totalReceived: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="rounded-sm border border-[#45A29E]/30 bg-[#1F2833] p-6 h-80">
      <h3 className="text-sm font-bold text-[#66FCF1] uppercase mb-4 tracking-widest">Swap Statistics</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0B0C10', borderColor: '#45A29E' }}
            itemStyle={{ color: '#C5C6C7' }}
          />
          <Legend />
          <Line yAxisId="left" name="Number of Batteries" type="monotone" dataKey="numberOfBatteries" stroke="#F59E0B" strokeWidth={2} />
          <Line yAxisId="right" name="Amount Paid" type="monotone" dataKey="amountPaid" stroke="#66FCF1" strokeWidth={2} />
          <Line yAxisId="right" name="Total Received" type="monotone" dataKey="totalReceived" stroke="#45A29E" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
