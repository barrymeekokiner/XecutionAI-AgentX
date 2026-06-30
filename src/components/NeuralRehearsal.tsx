import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Loader2, Target, AlertTriangle, TrendingUp, Compass, Clock, Zap } from 'lucide-react';
import { NeuralSimulationResult, AppSettings } from '../types';

interface NeuralRehearsalProps {
  plan: any;
  input: string;
  settings: AppSettings;
}

export const NeuralRehearsal: React.FC<NeuralRehearsalProps> = ({ plan, input, settings }) => {
  const [result, setResult] = useState<NeuralSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');

  const runRehearsal = async () => {
    setLoading(true);
    setStep('Initializing Monte Carlo Simulation...');
    
    try {
      await new Promise(r => setTimeout(r, 1000));
      setStep('Analyzing Market Permutations...');
      await new Promise(r => setTimeout(r, 1200));
      setStep('Running Critical Path Analysis...');

      const response = await fetch('/api/neural/rehearse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': settings.apiKey,
          'x-gemini-model': settings.model,
          'x-user-tier': settings.tier
        },
        body: JSON.stringify({ plan, input })
      });

      if (!response.ok) throw new Error('Simulation failed');
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <Target className="w-32 h-32" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5" />
            Neural Outcome Rehearsal
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Predictive Monte Carlo Simulation Engine</p>
        </div>
        
        <button
          onClick={runRehearsal}
          disabled={loading}
          className={`px-6 py-3 rounded-xl border text-xs uppercase font-black tracking-widest transition-all flex items-center gap-3 ${
            loading 
              ? 'bg-brand-secondary/10 border-brand-secondary text-brand-secondary cursor-wait' 
              : 'bg-brand-secondary text-black hover:shadow-[0_0_25px_rgba(var(--brand-secondary-rgb),0.4)] hover:-translate-y-0.5'
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {loading ? 'Simulating...' : 'Run Rehearsal'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-2 border-brand-secondary/20 rounded-full animate-ping" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-mono text-brand-secondary font-bold uppercase tracking-widest animate-pulse">{step}</p>
              <p className="text-[9px] text-white/20 uppercase tracking-tighter italic">Calculating 10,000+ potential execution branches...</p>
            </div>
          </motion.div>
        ) : result ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {/* Probability Score */}
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <Target className="w-5 h-5 text-brand-secondary" />
                <span className="text-[10px] font-mono text-white/40 uppercase">Success Rate</span>
              </div>
              <div className="flex flex-col items-center py-4">
                <div className="text-5xl font-black font-mono text-white tracking-tighter">
                  {result.probabilityOfSuccess}%
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.probabilityOfSuccess}%` }}
                    className="h-full bg-brand-secondary shadow-[0_0_10px_#00d4ff]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/40 text-center leading-relaxed">
                Calculated market-fit and technical feasibility based on provided architecture.
              </p>
            </div>

            {/* Critical Failure & Pivot */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-brand-alert/5 border border-brand-alert/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-brand-alert" />
                  <h4 className="text-[10px] font-bold text-brand-alert uppercase tracking-widest">Critical Failure Path</h4>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-mono">
                  {result.criticalFailurePath}
                </p>
              </div>

              <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-primary" />
                  <h4 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Neural Pivot Point</h4>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-mono">
                  {result.recommendedPivot}
                </p>
              </div>
            </div>

            {/* Projections */}
            <div className="md:col-span-2 lg:col-span-3 bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-secondary" />
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Simulated Revenue Projection (12mo)</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/20" />
                  <span className="text-[9px] text-white/40 uppercase font-mono">Timeframe: {result.simulatedTimeframe}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {[
                  { label: 'Low Outcome', val: result.revenueProjection.low, color: 'text-white/40' },
                  { label: 'Median Baseline', val: result.revenueProjection.median, color: 'text-brand-secondary' },
                  { label: 'High Potential', val: result.revenueProjection.high, color: 'text-brand-primary' },
                ].map((p, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-bold">{p.label}</p>
                    <div className={`text-2xl font-black font-mono tracking-tighter ${p.color}`}>
                      ${p.val.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="p-2 bg-brand-secondary/10 rounded">
                  <Target className="w-4 h-4 text-brand-secondary" />
                </div>
                <div>
                  <p className="text-[10px] text-white font-bold uppercase tracking-tight">Market Alignment Score: {result.marketAlignmentScore}/100</p>
                  <p className="text-[8px] text-white/40">Correlation between current market trends and execution blueprint.</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/10 rounded-2xl">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white/20 ml-1" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Rehearsal Engine Ready</h4>
              <p className="text-[9px] text-white/20 uppercase tracking-tighter">Initiate simulation to stress-test your execution plan.</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
