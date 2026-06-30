import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, HardDrive, Zap, Activity, Server, BarChart3, RefreshCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ResourceMonitor = () => {
  const [metrics, setMetrics] = useState({
    gpu: 0,
    compute: 0,
    storage: 0,
    load: 0,
    history: [] as any[]
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationSteps, setOptimizationSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [showOptimizedMessage, setShowOptimizedMessage] = useState(false);
  const optimizationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOptimizing) return;

      setMetrics(prev => {
        // More sophisticated fluctuation
        const time = Date.now() / 1000;
        const baseGpu = 40 + Math.sin(time / 5) * 10;
        const newGpu = Math.floor(baseGpu + Math.random() * 20);
        
        const baseCompute = 30 + Math.cos(time / 7) * 15;
        const newCompute = Math.floor(baseCompute + Math.random() * 25);
        
        const newStorage = Math.floor(62 + Math.random() * 5);
        const newLoad = ((newGpu + newCompute) / 2).toFixed(1);
        
        const newHistory = [...prev.history, {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          gpu: newGpu,
          compute: newCompute
        }].slice(-30);

        return {
          gpu: newGpu,
          compute: newCompute,
          storage: newStorage,
          load: Number(newLoad),
          history: newHistory
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOptimizing]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationSteps([]);
    setCurrentStepIndex(-1);
    setShowOptimizedMessage(false);

    try {
      const res = await fetch('/api/system/optimize', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setOptimizationSteps(data.steps);
        
        // Staggered step visualization
        for (let i = 0; i < data.steps.length; i++) {
          setCurrentStepIndex(i);
          await new Promise(r => setTimeout(r, 800));
        }

        // Simulate immediate drop in load
        setMetrics(prev => ({
          ...prev,
          gpu: Math.floor(prev.gpu * 0.7),
          compute: Math.floor(prev.compute * 0.7),
          load: Number((prev.load * 0.7).toFixed(1))
        }));

        setShowOptimizedMessage(true);
        setTimeout(() => {
          setIsOptimizing(false);
          setShowOptimizedMessage(false);
        }, 3000);
      }
    } catch (e) {
      console.error("Optimization failed", e);
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GPU Usage */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 blur-2xl rounded-full group-hover:bg-brand-primary/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Zap className="w-5 h-5 text-brand-primary" />
            </div>
            <span className="text-[10px] font-mono text-brand-primary font-bold uppercase tracking-widest">Live</span>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Neural GPU Cluster</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{metrics.gpu}%</span>
            <span className="text-[10px] text-brand-primary font-mono">H100_V4</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${metrics.gpu}%` }}
              className="h-full bg-brand-primary shadow-[0_0_10px_#00ff9d]"
            />
          </div>
        </div>

        {/* Compute Power */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-secondary/5 blur-2xl rounded-full group-hover:bg-brand-secondary/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-secondary/10 rounded-lg">
              <Cpu className="w-5 h-5 text-brand-secondary" />
            </div>
            <span className="text-[10px] font-mono text-brand-secondary font-bold uppercase tracking-widest">Active</span>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">L40S Compute Pool</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{metrics.compute}%</span>
            <span className="text-[10px] text-brand-secondary font-mono">NODE_72</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${metrics.compute}%` }}
              className="h-full bg-brand-secondary shadow-[0_0_10px_#00d4ff]"
            />
          </div>
        </div>

        {/* Distributed Storage */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-alert/5 blur-2xl rounded-full group-hover:bg-brand-alert/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-alert/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-brand-alert" />
            </div>
            <span className="text-[10px] font-mono text-brand-alert font-bold uppercase tracking-widest">Stable</span>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Global KV Store</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{metrics.storage}%</span>
            <span className="text-[10px] text-brand-alert font-mono">SSD_EXT</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${metrics.storage}%` }}
              className="h-full bg-brand-alert shadow-[0_0_10px_#f06292]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Load History Chart */}
        <div className="lg:col-span-2 bg-black border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Neural Load History</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-[9px] text-white/40 uppercase font-bold">GPU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                <span className="text-[9px] text-white/40 uppercase font-bold">Compute</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.history}>
                <defs>
                  <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  hide={true}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickFormatter={(val) => `${val}%`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gpu" 
                  stroke="#00ff9d" 
                  fillOpacity={1} 
                  fill="url(#colorGpu)" 
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="compute" 
                  stroke="#00d4ff" 
                  fillOpacity={1} 
                  fill="url(#colorCompute)" 
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <Server className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">System Health</h3>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-mono">Kernel Stability</span>
                <span className="text-[10px] text-brand-primary font-mono">99.99%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[99.99%] bg-brand-primary shadow-[0_0_8px_#00ff9d]" />
              </div>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-mono">Network Latency</span>
                <span className="text-[10px] text-brand-secondary font-mono">14ms</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-brand-secondary shadow-[0_0_8px_#00d4ff]" />
              </div>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-mono">Threat Defense</span>
                <span className="text-[10px] text-brand-primary font-mono">ACTIVE</span>
              </div>
              <div className="flex gap-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < 10 ? 'bg-brand-primary shadow-[0_0_5px_#00ff9d]' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-all ${
                isOptimizing 
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Optimizing Neural Weights...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-3 h-3" />
                  Run Neural Optimization
                </>
              )}
            </button>

            <AnimatePresence>
              {isOptimizing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {optimizationSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: i <= currentStepIndex ? 1 : 0.3, 
                        x: i <= currentStepIndex ? 0 : -10 
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-1 h-1 rounded-full ${i <= currentStepIndex ? 'bg-brand-primary' : 'bg-white/20'}`} />
                      <span className="text-[8px] text-white/40 uppercase font-mono">{step}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {showOptimizedMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                  <div>
                    <p className="text-[10px] text-white font-bold uppercase tracking-tight">Optimization Complete</p>
                    <p className="text-[8px] text-brand-primary/80 font-mono tracking-tighter">+14.2% Neural Fidelity // -8ms Latency</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isOptimizing && !showOptimizedMessage && (
              <div className="flex items-center gap-3 p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                <BarChart3 className="w-4 h-4 text-brand-primary animate-pulse" />
                <div>
                  <p className="text-[10px] text-white font-bold uppercase tracking-tight">System Optimization</p>
                  <p className="text-[9px] text-white/40 leading-tight">Neural weights redistributed across local clusters for 12% gain.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
