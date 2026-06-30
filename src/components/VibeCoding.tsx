import React from 'react';
import { VibePrompt } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Check, Loader2, Sparkles, Command } from 'lucide-react';

interface Props {
  blueprint?: {
    systemPrompt: string;
    vibePrompts: VibePrompt[];
  };
  vibePrompts: VibePrompt[];
  setVibePrompts: React.Dispatch<React.SetStateAction<VibePrompt[]>>;
  isAutoSequencing: boolean;
  onAutoSequence: () => void;
}

export const VibeCoding: React.FC<Props> = ({ 
  blueprint, 
  vibePrompts, 
  setVibePrompts, 
  isAutoSequencing, 
  onAutoSequence 
}) => {
  if (!blueprint) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-primary/10 transition-all duration-700" />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <Command className="w-4 h-4 text-brand-primary" />
              Neural Scaffolding Pipeline
            </h3>
            <p className="text-[10px] text-white/40 uppercase font-mono mt-1">Autonomous generation across {vibePrompts.length} phases</p>
          </div>
          <button 
            onClick={onAutoSequence}
            disabled={isAutoSequencing || vibePrompts.every(p => p.isCompleted)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              isAutoSequencing ? 'bg-brand-primary/20 text-brand-primary animate-pulse cursor-wait' : 
              vibePrompts.every(p => p.isCompleted) ? 'bg-white/5 text-white/20 cursor-not-allowed' :
              'bg-brand-primary text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,255,157,0.3)]'
            }`}
          >
            {isAutoSequencing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {isAutoSequencing ? 'Sequencing...' : vibePrompts.every(p => p.isCompleted) ? 'Pipeline Complete' : 'Execute Auto-Scaffold'}
          </button>
        </div>

        <div className="space-y-3 relative z-10">
          {vibePrompts.map((prompt, idx) => (
            <motion.div 
              key={prompt.id}
              initial={false}
              animate={{ 
                opacity: prompt.isCompleted ? 0.6 : 1,
                x: prompt.isCompleted ? 4 : 0,
                borderColor: prompt.isCompleted ? 'rgba(0,255,157,0.2)' : 'rgba(255,255,255,0.1)'
              }}
              className={`p-4 border rounded-xl flex items-center justify-between group/item transition-all ${
                prompt.isCompleted ? 'bg-brand-primary/5' : 'bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  prompt.isCompleted ? 'bg-brand-primary border-brand-primary text-black shadow-[0_0_10px_#00ff9d]' : 'bg-black border-white/10 text-white/40 group-hover/item:border-brand-primary group-hover/item:text-brand-primary'
                }`}>
                  {prompt.isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${prompt.isCompleted ? 'text-brand-primary' : 'text-white/60'}`}>{prompt.phase}</span>
                    {idx === vibePrompts.findIndex(p => !p.isCompleted) && !isAutoSequencing && (
                      <span className="text-[8px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">Next Up</span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 font-mono italic mt-0.5 line-clamp-1">{prompt.content}</p>
                </div>
              </div>
              
              {!prompt.isCompleted && !isAutoSequencing && (
                <button 
                  onClick={() => {
                    const newPrompts = [...vibePrompts];
                    newPrompts[idx].isCompleted = true;
                    setVibePrompts(newPrompts);
                  }}
                  className="p-2 opacity-0 group-hover/item:opacity-100 text-white/20 hover:text-brand-primary transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-white/20 uppercase font-mono tracking-widest">Pipeline Saturation</span>
            <span className="text-[9px] text-brand-primary font-mono">
              {Math.round((vibePrompts.filter(p => p.isCompleted).length / vibePrompts.length) * 100)}%
            </span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(vibePrompts.filter(p => p.isCompleted).length / vibePrompts.length) * 100}%` }}
              className="h-full bg-brand-primary shadow-[0_0_10px_#00ff9d]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
