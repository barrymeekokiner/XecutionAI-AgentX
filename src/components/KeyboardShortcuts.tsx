import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, X } from 'lucide-react';

export const KeyboardShortcuts = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const shortcuts = [
    { keys: ['⌘', 'Enter'], desc: 'Execute Neural Stream' },
    { keys: ['⌘', 'K'], desc: 'Focus Orchestrator' },
    { keys: ['⌘', 'S'], desc: 'System Configuration' },
    { keys: ['⌘', 'L'], desc: 'Toggle Telemetry Feed' },
    { keys: ['⌘', 'Shift', 'C'], desc: 'Clear Active Logs' },
    { keys: ['⌘', 'H'], desc: 'Execution History' },
    { keys: ['Esc'], desc: 'Close Overlay' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xs bg-app-bg border border-white/10 rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-secondary/10 rounded-lg">
                <Command className="w-4 h-4 text-brand-secondary" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Fast-Track Commands</h3>
            </div>

            <div className="space-y-4">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="text-[10px] text-white/40 uppercase font-mono group-hover:text-white/60 transition-colors">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k, ki) => (
                      <kbd key={ki} className="px-1.5 py-0.5 min-w-[20px] text-center bg-white/5 border border-white/10 rounded text-[9px] text-white/60 font-mono">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
