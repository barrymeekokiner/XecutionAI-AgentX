import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  User,
  Zap
} from 'lucide-react';
import { AgentMessage } from '../types';

interface AgentDialoguePanelProps {
  messages: AgentMessage[];
}

export const AgentDialoguePanel: React.FC<AgentDialoguePanelProps> = ({ messages }) => {
  return (
    <div className="flex flex-col h-full bg-black/40 border-l border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Neural Dialogue Stream</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
          <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[8px] text-brand-primary font-mono uppercase">Sync Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`group flex flex-col gap-2 ${msg.sender === 'ORCHESTRATOR' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 px-2">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{msg.sender}</span>
                <ChevronRight className="w-2.5 h-2.5 text-white/10" />
                <span className="text-[8px] font-bold text-brand-primary uppercase tracking-widest">{msg.receiver}</span>
              </div>

              <div className={`max-w-[85%] p-3 rounded-2xl border transition-all ${
                msg.marker === 'consensus' ? 'bg-green-500/5 border-green-500/20' :
                msg.marker === 'conflict' ? 'bg-red-500/5 border-red-500/20' :
                'bg-white/5 border-white/10 group-hover:border-white/20'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5">
                    {msg.marker === 'consensus' && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                    {msg.marker === 'conflict' && <ShieldAlert className="w-3 h-3 text-red-400" />}
                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${
                      msg.marker === 'consensus' ? 'text-green-400' :
                      msg.marker === 'conflict' ? 'text-red-400' :
                      'text-white/40'
                    }`}>
                      {msg.marker || 'neutral'} exchange
                    </span>
                  </div>
                  <span className="text-[8px] text-white/20 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-[10px] text-white/80 leading-relaxed font-mono mb-2">{msg.content}</p>
                
                {msg.reasoning && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-2.5 h-2.5 text-brand-secondary" />
                      <span className="text-[7px] text-white/30 uppercase font-bold tracking-widest">Reasoning Matrix</span>
                    </div>
                    <p className="text-[8px] text-white/40 italic leading-tight">{msg.reasoning}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between text-[8px] text-white/20 font-mono uppercase tracking-[0.2em]">
          <span>Total Exchanges: {messages.length}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
              <span>Consensus</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
              <span>Conflict</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
