import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
}

export const WelcomeTour = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = React.useState(0);
  
  const steps: TourStep[] = [
    {
      target: 'orchestrator',
      title: 'Master Orchestrator',
      content: 'Enter your raw assets or SaaS ideas here. Our core intelligence will parse and route them to specialized subsystems for immediate execution.'
    },
    {
      target: 'telemetry',
      title: 'Neural Telemetry',
      content: 'Monitor autonomous thought patterns in real-time. This feed displays every step our agents take to compress your execution timeline.'
    },
    {
      target: 'blueprints',
      title: 'High-Alpha Blueprints',
      content: 'Not sure where to start? Explore emerging 2026 trends curated by our Liquidity Intelligence agent to find high-yield opportunities.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-app-bg border border-brand-primary/20 rounded-2xl shadow-[0_0_50px_rgba(var(--brand-primary-rgb),0.1)] p-8 overflow-hidden"
        >
          {/* Animated Background Element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 blur-[80px] rounded-full animate-pulse" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight italic uppercase">System Induction</h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest">{steps[step].title}</h3>
              <p className="text-xs text-white/60 leading-relaxed font-mono uppercase">{steps[step].content}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-brand-primary shadow-[0_0_8px_#00ff9d]' : 'bg-white/10'}`} />
                ))}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={onComplete}
                  className="px-4 py-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Skip
                </button>
                <button 
                  onClick={() => {
                    if (step < steps.length - 1) setStep(step + 1);
                    else onComplete();
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-black text-[10px] font-extrabold uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)]"
                >
                  {step === steps.length - 1 ? 'Execute' : 'Next'} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={onComplete}
            className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
