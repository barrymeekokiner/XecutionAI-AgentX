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
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { AgentPerformanceMetrics } from '../types';
import { motion } from 'motion/react';
import { Zap, Timer, CheckCircle2, AlertCircle } from 'lucide-react';

interface AgentPerformanceDashboardProps {
  metrics: AgentPerformanceMetrics[];
}

export const AgentPerformanceDashboard: React.FC<AgentPerformanceDashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Response Time Analysis */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-brand-primary" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Neural Response Latency (ms)</h3>
            </div>
            <span className="text-[8px] text-white/20 font-mono">Live telemetry</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="role" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="avgResponseTime" radius={[4, 4, 0, 0]}>
                  {metrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--brand-primary)" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success vs Error Rates */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-secondary" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Decision Reliability (%)</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="role" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="successRate" stroke="var(--brand-secondary)" fill="var(--brand-secondary)" fillOpacity={0.1} />
                <Area type="monotone" dataKey="errorRate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <motion.div 
            key={m.role}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{m.role}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${m.successRate > 90 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black font-mono text-white tracking-tighter">{m.decisionFrequency}</p>
              <p className="text-[8px] text-white/40 uppercase tracking-widest">Total Decisions</p>
            </div>
            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Users className="w-2.5 h-2.5 text-brand-primary" />
                <span className="text-[9px] font-mono text-white/60">{m.activeTasks}</span>
              </div>
              <span className="text-[8px] font-mono text-white/40 uppercase">Load: {((m.activeTasks / 5) * 100).toFixed(0)}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import { Users } from 'lucide-react';
