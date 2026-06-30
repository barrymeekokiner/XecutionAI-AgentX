import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowUpRight,
  Target,
  Clock,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { RevenueProjection as RevenueProjectionType } from '../types';

interface RevenueProjectionProps {
  projection: RevenueProjectionType;
}

export const RevenueProjection: React.FC<RevenueProjectionProps> = ({ projection }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-secondary/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-brand-secondary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Revenue Simulation</h3>
          <p className="text-[10px] text-white/40 uppercase font-mono">24-Month Neural Growth Forecast</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Metrics */}
        <div className="space-y-4">
          <MetricCard 
            label="CAC (Customer Acquisition Cost)" 
            value={projection.metrics.cac} 
            icon={<Target className="w-4 h-4" />}
            color="text-brand-primary"
            description="The average expense to acquire a single user. Lowering this via organic loops is critical for scale."
          />
          <MetricCard 
            label="LTV (Life-Time Value)" 
            value={projection.metrics.ltv} 
            icon={<DollarSign className="w-4 h-4" />}
            color="text-brand-secondary"
            description="Total net profit expected from a single customer over the duration of their subscription."
          />
          <MetricCard 
            label="Payback Period" 
            value={projection.metrics.paybackPeriod} 
            icon={<Clock className="w-4 h-4" />}
            color="text-purple-500"
            description="Number of months required to recover the initial CAC through customer subscription revenue."
          />
          
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Profitability Path</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-brand-primary/20 border-t-brand-primary flex items-center justify-center">
                 <span className="text-xs font-bold text-white">82%</span>
              </div>
              <div>
                <p className="text-[10px] text-white font-bold uppercase">Breakeven Confidence</p>
                <p className="text-[9px] text-white/40 font-mono italic">Predicted by month 8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-[300px]">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center justify-between">
              MRR Growth Projection
              <span className="text-brand-secondary font-mono tracking-normal lowercase italic opacity-50">Estimated in USD</span>
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection.months}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', fontSize: '10px' }}
                  itemStyle={{ color: '#00e5ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mrr" 
                  stroke="#00e5ff" 
                  fillOpacity={1} 
                  fill="url(#colorMrr)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-[200px]">
             <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">User Acquisition Velocity</h4>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={projection.months}>
                 <XAxis dataKey="month" hide />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', fontSize: '10px' }}
                 />
                 <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                   {projection.months.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={`rgba(0, 255, 157, ${0.3 + (index / projection.months.length) * 0.7})`} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, color, description }: { label: string, value: string, icon: any, color: string, description: string }) => (
  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/90 backdrop-blur-md p-4 flex flex-col justify-center items-center text-center z-10 pointer-events-none">
      <h4 className={`text-[10px] ${color} font-bold uppercase tracking-widest mb-1`}>{label.split(' (')[0]}</h4>
      <p className="text-[9px] text-white/60 font-mono leading-tight">{description}</p>
    </div>
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-white/5 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <ArrowUpRight className="w-3 h-3 text-white/20" />
    </div>
    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black font-mono text-white tracking-tighter">{value}</p>
  </div>
);
