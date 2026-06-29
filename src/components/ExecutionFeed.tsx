import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Zap, Database, TrendingUp } from 'lucide-react';
import { AgentLog } from '../types';

interface ExecutionFeedProps {
  logs: AgentLog[];
}

export const ExecutionFeed: React.FC<ExecutionFeedProps> = ({ logs }) => {
  const getIcon = (agent: string) => {
    const lower = agent.toLowerCase();
    if (lower.includes('master')) return <Terminal className="w-4 h-4 text-brand-secondary" />;
    if (lower.includes('liquidity')) return <TrendingUp className="w-4 h-4 text-brand-primary" />;
    if (lower.includes('saas')) return <Database className="w-4 h-4 text-brand-alert" />;
    if (lower.includes('risk')) return <Shield className="w-4 h-4 text-[#ff3e3e]" />;
    if (lower.includes('execution')) return <Zap className="w-4 h-4 text-yellow-400" />;
    return <Terminal className="w-4 h-4 text-white/40" />;
  };

  return (
    <div className="bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-[10px] h-[300px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-white/40">
          <Terminal className="w-3 h-3" />
          <span className="uppercase tracking-[0.2em]">Active Logic Stream</span>
        </div>
        <span className="text-[8px] px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/30 rounded uppercase">Live</span>
      </div>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3 leading-relaxed"
          >
            <div className="mt-0.5 shrink-0">{getIcon(log.agent)}</div>
            <div>
              <span className={`uppercase font-bold ${
                log.agent.toLowerCase().includes('master') ? 'text-brand-secondary' : 
                log.agent.toLowerCase().includes('liquidity') ? 'text-brand-primary' : 
                log.agent.toLowerCase().includes('saas') ? 'text-brand-alert' : 
                'text-white/40'
              }`}>[{log.agent}]</span>
              <span className="text-white/80 ml-2">{log.message}</span>
            </div>
          </motion.div>
        ))}
        {logs.length === 0 && (
          <div className="text-white/20 italic animate-pulse tracking-widest uppercase">Awaiting autonomous signals...</div>
        )}
      </div>
    </div>
  );
};
