import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { ResourceMetric } from '../types';

interface ResourceBenchmarkingProps {
  metrics: ResourceMetric[];
}

export const ResourceBenchmarking: React.FC<ResourceBenchmarkingProps> = ({ metrics }) => {
  // Mock historical averages for comparison
  const historicalAverages = {
    cpu: 45,
    memory: 60,
    efficiency: 82
  };

  const currentLatest = metrics.length > 0 ? metrics[metrics.length - 1] : {
    cpu: 0,
    memory: 0,
    efficiency: 0
  };

  const chartData = [
    {
      name: 'CPU Usage',
      current: currentLatest.cpu,
      historical: historicalAverages.cpu,
      unit: '%',
      color: '#00ff9d'
    },
    {
      name: 'Memory Usage',
      current: currentLatest.memory,
      historical: historicalAverages.memory,
      unit: '%',
      color: '#00d1ff'
    },
    {
      name: 'Efficiency',
      current: currentLatest.efficiency,
      historical: historicalAverages.efficiency,
      unit: '%',
      color: '#bd00ff'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 p-4 rounded-xl backdrop-blur-xl shadow-2xl">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-2 font-mono">{label}</p>
          <div className="space-y-1">
            {payload.map((p: any, i: number) => (
              <div key={i} className="flex justify-between items-center gap-8">
                <span className="text-[8px] uppercase font-bold" style={{ color: p.color }}>{p.name}</span>
                <span className="text-[10px] font-mono text-white font-bold">{p.value}{p.payload.unit}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
              <span className="text-[8px] uppercase font-bold text-white/40">Variance</span>
              <span className={`text-[10px] font-mono font-bold ${(payload[0].value - payload[1].value) > 0 ? 'text-brand-alert' : 'text-brand-primary'}`}>
                {((payload[0].value - payload[1].value) > 0 ? '+' : '') + (payload[0].value - payload[1].value).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barGap={12}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Legend 
            verticalAlign="top" 
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}
          />
          <Bar 
            name="Current Build" 
            dataKey="current" 
            fill="url(#currentGradient)" 
            radius={[4, 4, 0, 0]}
            barSize={32}
          >
             {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
          <Bar 
            name="Historical Avg" 
            dataKey="historical" 
            fill="rgba(255,255,255,0.1)" 
            radius={[4, 4, 0, 0]}
            barSize={32}
          />
          
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="5%" stopColor="currentColor" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="currentColor" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
