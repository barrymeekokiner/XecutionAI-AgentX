import React from 'react';
import { motion } from 'motion/react';
import { History, X, Clock, Trash2, FileText, Users } from 'lucide-react';
import { ExecutionResult } from '../types';

interface Props {
  history: ExecutionResult[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: ExecutionResult) => void;
  onDelete: (id: string) => void;
}

export const HistorySidebar: React.FC<Props> = ({ history, isOpen, onClose, onSelect, onDelete }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-80 bg-[#0D1117] border-l border-white/10 z-[100] shadow-2xl flex flex-col"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2 text-white uppercase tracking-widest text-xs font-bold">
          <History className="w-4 h-4 text-brand-primary" />
          Execution History
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 && (
          <div className="text-center py-12 text-white/20 uppercase text-[10px] tracking-[0.2em]">
            No archived executions
          </div>
        )}
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-brand-primary/30 transition-all group cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-brand-primary/60">
                {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {item.teamId && (
                <div className="flex items-center gap-1 text-[8px] font-bold text-brand-secondary uppercase bg-brand-secondary/10 px-1.5 py-0.5 rounded border border-brand-secondary/20">
                  <Users className="w-2.5 h-2.5" />
                  Team
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-white/80 line-clamp-2 font-mono mb-2 uppercase tracking-tighter">
              {item.input}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[8px] px-1.5 py-0.5 bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 rounded uppercase">
                {item.mode}
              </span >
              {item.liquidityPlan && <FileText className="w-3 h-3 text-brand-primary/40" />}
              {item.saasBuildPlan && <Clock className="w-3 h-3 text-brand-alert/40" />}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
