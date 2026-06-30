import React from 'react';
import { motion } from 'motion/react';
import { 
  Dna, 
  RefreshCcw, 
  Target, 
  ArrowRight,
  TrendingUp,
  Zap,
  Activity,
  BarChart3,
  Flame,
  UserPlus,
  Repeat,
  DollarSign
} from 'lucide-react';
import { SaaSGenome as SaaSGenomeType } from '../types';

interface SaaSGenomeProps {
  genome: SaaSGenomeType;
}

export const SaaSGenome: React.FC<SaaSGenomeProps> = ({ genome }) => {
  const dnaMetrics = [
    { label: 'Pain Level', value: genome.dna.painLevel, icon: <Flame className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Virality', value: genome.dna.virality, icon: <UserPlus className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Retention', value: genome.dna.retention, icon: <Repeat className="w-4 h-4" />, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { label: 'Monetization', value: genome.dna.monetization, icon: <DollarSign className="w-4 h-4" />, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <Dna className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">SaaS DNA Profile</h3>
          <p className="text-[10px] text-white/40 uppercase font-mono">Neural Architectural Blueprint</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dnaMetrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${metric.bg} ${metric.color}`}>
                {metric.icon}
              </div>
              <span className="text-2xl font-black font-mono text-white">{metric.value}</span>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{metric.label}</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  className={`h-full ${metric.bg.replace('/10', '')}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Loop */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-secondary/10 rounded-lg">
              <RefreshCcw className="w-4 h-4 text-brand-secondary" />
            </div>
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Core Product Loop</h4>
          </div>
          
          <div className="space-y-4 relative">
            <div className="absolute left-[17px] top-4 bottom-4 w-px bg-white/5" />
            {genome.coreLoop.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-center relative">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white z-10 shrink-0">
                  {idx + 1}
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex-1">
                  <p className="text-xs text-white/70 font-mono">{step}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-white/30 leading-relaxed italic border-t border-white/5 pt-4">
            {genome.coreLoop.description}
          </p>
        </div>

        {/* Growth Pattern */}
        <div className="space-y-6">
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-brand-primary" />
              </div>
              <h4 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Growth Pattern</h4>
            </div>
            <p className="text-xl font-bold text-white tracking-tight leading-tight">
              {genome.growthPattern}
            </p>
            <div className="pt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white/5 rounded text-[8px] text-white/40 uppercase font-bold tracking-widest">PLG Optimized</span>
              <span className="px-2 py-1 bg-white/5 rounded text-[8px] text-white/40 uppercase font-bold tracking-widest">Viral Coefficient &gt; 1.0</span>
              <span className="px-2 py-1 bg-white/5 rounded text-[8px] text-white/40 uppercase font-bold tracking-widest">Low Friction Entry</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Activity className="w-20 h-20" />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Neural Recommendation</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                The high {genome.dna.painLevel > 80 ? 'Pain Level' : 'Monetization'} score suggests a direct-to-enterprise motion while leveraging {genome.growthPattern.toLowerCase()} for initial velocity.
              </p>
              <button className="flex items-center gap-2 text-[10px] font-bold text-brand-secondary uppercase tracking-widest group">
                Optimize Engine
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
