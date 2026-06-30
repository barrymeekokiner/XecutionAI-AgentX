import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Users, TrendingUp, UserCheck } from 'lucide-react';

interface TeamCapacityOverviewProps {
  data: {
    role: string;
    count: number;
    color: string;
  }[];
  growth: {
    month: string;
    seats: number;
  }[];
}

export const TeamCapacityOverview: React.FC<TeamCapacityOverviewProps> = ({ data, growth }) => {
  const totalSeats = data.reduce((acc, curr) => acc + curr.count, 0);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Role Distribution */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">Seat Distribution</h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Role-based allocation</p>
            </div>
            <div className="flex items-center gap-2 text-brand-primary">
              <Users className="w-4 h-4" />
              <span className="text-sm font-bold font-mono">{totalSeats} Total</span>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {data.map((role, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full" style={{ backgroundColor: role.color }} />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{role.role}</span>
                <span className="text-xs font-bold text-white font-mono">{role.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Projection */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">Projected Growth</h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Workspace scaling velocity</p>
            </div>
            <div className="flex items-center gap-2 text-brand-secondary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Accelerating</span>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="seats" fill="#00ff9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-3 p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
             <UserCheck className="w-4 h-4 text-brand-primary" />
             <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-tight">
               Predicted requirement: <span className="text-white">12 seats</span> by Q4 2026 based on current orchestration load.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
