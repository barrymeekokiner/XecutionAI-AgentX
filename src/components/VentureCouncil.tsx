import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Shield,
  Cpu,
  BarChart3,
  DollarSign,
  TrendingUp,
  Scale,
  FileJson
} from 'lucide-react';
import { CouncilOpinion } from '../types';

interface VentureCouncilProps {
  debate: CouncilOpinion[];
}

export const VentureCouncil: React.FC<VentureCouncilProps> = ({ debate }) => {
  const downloadConsensus = () => {
    const data = {
      timestamp: new Date().toISOString(),
      consensus: debate.map(o => ({
        agent: o.role,
        decision: o.decision,
        rationale: o.opinion
      })),
      summary: "Neural Venture Council Decision Report"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `council-consensus-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CEO': return <Users className="w-4 h-4" />;
      case 'CTO': return <Cpu className="w-4 h-4" />;
      case 'Growth': return <TrendingUp className="w-4 h-4" />;
      case 'Finance': return <DollarSign className="w-4 h-4" />;
      case 'Security': return <Shield className="w-4 h-4" />;
      case 'Investor': return <Scale className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getDecisionStyles = (decision: string) => {
    switch (decision) {
      case 'PROCEED': return { text: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20', icon: <CheckCircle2 className="w-3 h-3" /> };
      case 'REVISE': return { text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <AlertTriangle className="w-3 h-3" /> };
      case 'REJECT': return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle className="w-3 h-3" /> };
      default: return { text: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', icon: null };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-secondary/10 rounded-lg">
            <Users className="w-5 h-5 text-brand-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Venture Council</h3>
            <p className="text-[10px] text-white/40 uppercase font-mono">Agentic Peer Review Protocol</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['CEO', 'CTO', 'Growth', 'Finance', 'Security', 'Investor'].map((role) => (
            <div key={role} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-help" title={role}>
               {getRoleIcon(role)}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {debate.map((opinion, idx) => {
          const styles = getDecisionStyles(opinion.decision);
          return (
            <motion.div
              key={opinion.role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-4 flex flex-col h-full hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-white/60 group-hover:text-white transition-colors">
                    {getRoleIcon(opinion.role)}
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{opinion.role} Agent</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text}`}>
                  {styles.icon}
                  <span className="text-[8px] font-bold uppercase tracking-widest">{opinion.decision}</span>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <MessageSquare className="absolute -top-1 -left-1 w-8 h-8 text-white/5 -z-10" />
                <div className="text-xs text-white/70 leading-relaxed font-mono pl-2 border-l border-white/5 italic space-y-2">
                  {(() => {
                    try {
                      const data = JSON.parse(opinion.opinion);
                      return Object.entries(data).map(([key, val]) => {
                        if (key === 'decision') return null;
                        return (
                          <div key={key}>
                            <span className="text-[8px] text-white/30 uppercase block mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-white/80">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                          </div>
                        );
                      });
                    } catch (e) {
                      return <p>"{opinion.opinion}"</p>;
                    }
                  })()}
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                   <div className="w-1 h-1 rounded-full bg-brand-primary" />
                   <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
                   <div className="w-1 h-1 rounded-full bg-brand-primary/10" />
                </div>
                <span className="text-[8px] text-white/20 font-mono tracking-widest">VERIFIED_SIGNATURE</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-xl">
             <CheckCircle2 className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Council Consensus</h4>
            <p className="text-xs text-white/60 font-mono">The council has voted to <span className="text-brand-primary font-bold">PROCEED</span> with the current architectural blueprint.</p>
          </div>
        </div>
        <button 
          onClick={downloadConsensus}
          className="px-6 py-2 bg-brand-primary text-black text-[10px] font-bold uppercase rounded-lg hover:bg-white transition-colors flex items-center gap-2"
        >
          <FileJson className="w-3.5 h-3.5" />
          Download Report
        </button>
      </div>
    </div>
  );
};
