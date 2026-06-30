import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Search, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { AgentRole } from '../server/agents';
import { AgentStatus } from '../types';

interface AgentNodeProps {
  role: AgentRole;
  name: string;
  status: AgentStatus;
  isOrchestrator: boolean;
  lastActive: number;
}

const AgentNode: React.FC<AgentNodeProps> = ({ role, name, status, isOrchestrator, lastActive }) => {
  const isStalled = Date.now() - lastActive > 10000;
  const getIcon = () => {
    switch (role) {
      case 'CEO': return <Users className="w-5 h-5" />;
      case 'CTO': return <Cpu className="w-5 h-5" />;
      case 'Growth': return <TrendingUp className="w-5 h-5" />;
      case 'Finance': return <DollarSign className="w-5 h-5" />;
      case 'Security': return <Shield className="w-5 h-5" />;
      case 'MarketResearch': return <Search className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'working': return 'bg-brand-primary shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)]';
      case 'thinking': return 'bg-brand-secondary animate-pulse';
      case 'paused': return 'bg-brand-alert';
      default: return 'bg-white/20';
    }
  };

  return (
    <motion.div 
      layout
      className={`relative p-4 rounded-2xl border transition-all duration-500 ${
        isOrchestrator ? 'bg-brand-primary/10 border-brand-primary/40' : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isOrchestrator ? 'bg-brand-primary text-black' : 'bg-white/10 text-white'}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{name}</span>
            <span className="text-[8px] text-white/40 font-mono">{status.load}%</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()} ${isStalled && status.status !== 'idle' ? 'animate-ping bg-red-500' : status.status !== 'idle' ? 'animate-pulse' : ''}`} />
            <span className="text-[8px] text-white/20 font-mono uppercase">{status.status}</span>
            {isStalled && status.status !== 'idle' && (
              <span className="text-[7px] text-red-400 font-bold ml-1">STALLED</span>
            )}
            {!isStalled && status.status !== 'idle' && (
              <div className="w-1 h-1 bg-brand-primary rounded-full animate-ping ml-1" />
            )}
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${status.load}%` }}
              className={`h-full ${status.load > 80 ? 'bg-brand-alert' : status.load > 50 ? 'bg-brand-secondary' : 'bg-brand-primary'}`}
            />
          </div>
        </div>
      </div>
      {isOrchestrator && (
        <div className="absolute -top-2 -right-2 bg-brand-primary text-black text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
          Master
        </div>
      )}
    </motion.div>
  );
};

interface AgentOrchestratorTreeProps {
  activeRole?: AgentRole;
  statuses: Record<AgentRole, AgentStatus>;
}

export const AgentOrchestratorTree: React.FC<AgentOrchestratorTreeProps> = ({ activeRole, statuses }) => {
  const agents: { role: AgentRole; name: string }[] = [
    { role: 'CEO', name: 'Visionary' },
    { role: 'CTO', name: 'Architect' },
    { role: 'MarketResearch', name: 'Scanner' },
    { role: 'Growth', name: 'Engine' },
    { role: 'Finance', name: 'Protector' },
    { role: 'Security', name: 'Shield' }
  ];

  return (
    <div className="p-8 bg-black/40 border border-white/10 rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
          <span className="text-[8px] text-brand-primary font-mono uppercase tracking-widest">Active Neural Link</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12">
        {/* CEO (Orchestrator Level) */}
        <div className="flex justify-center">
          <AgentNode 
            role="CEO" 
            name="CEO Agent" 
            status={statuses.CEO} 
            isOrchestrator={activeRole === 'CEO'} 
            lastActive={statuses.CEO.lastActive}
          />
        </div>

        <div className="w-px h-8 bg-gradient-to-b from-brand-primary/40 to-transparent" />

        {/* Secondary Level */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {agents.filter(a => a.role !== 'CEO').map((agent) => (
            <AgentNode 
              key={agent.role}
              role={agent.role}
              name={agent.name}
              status={statuses[agent.role]}
              isOrchestrator={activeRole === agent.role}
              lastActive={statuses[agent.role].lastActive}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] text-white/20 font-mono uppercase tracking-[0.2em]">
        <span>Cluster: X1-NEURAL-GATEWAY</span>
        <span>Latency: 24ms</span>
        <span>Sync: 100%</span>
      </div>
    </div>
  );
};
