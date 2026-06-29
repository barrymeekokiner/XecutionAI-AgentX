import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, TrendingUp, Shield, ArrowRight, Activity, Terminal, Globe } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const LiquidityFunnel: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,157,0.05),transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent" />
      
      {/* Floating Particles Simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-1 h-1 bg-brand-primary rounded-full absolute"
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl w-full text-center relative z-10"
      >
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-black border-2 border-brand-primary/30 rounded-[2rem] flex items-center justify-center relative z-10"
            >
              <Cpu className="w-10 h-10 text-brand-primary" />
            </motion.div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 border border-brand-primary/20 rounded-[2rem] animate-ping [animation-duration:3s]" />
            <div className="absolute -inset-4 bg-brand-primary/10 rounded-full blur-2xl animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
             <span className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em] mb-4">
               Autonomous Intelligence // v3.1 Enterprise
             </span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
            Agent<span className="text-brand-primary">X</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.5em] text-xs md:text-sm font-light">
            High-Velocity Asset Liquidity & SaaS Factory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <TrendingUp className="w-4 h-4"/>, label: "Flash Liquidity", desc: "Instant Exit Optimization" },
            { icon: <Zap className="w-4 h-4"/>, label: "Vibe Coding", desc: "AI Chaining Architecture" },
            { icon: <Shield className="w-4 h-4"/>, label: "Risk Guard", desc: "Real-time Threat Detection" },
            { icon: <Globe className="w-4 h-4"/>, label: "Global Grounding", desc: "Live Market Intelligence" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl text-left hover:bg-white/[0.08] hover:border-brand-primary/40 transition-all group"
            >
              <div className="w-8 h-8 bg-black border border-white/10 rounded-lg flex items-center justify-center text-brand-primary mb-4 group-hover:shadow-[0_0_15px_#00ff9d] transition-all">
                {item.icon}
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-1">{item.label}</h3>
              <p className="text-white/30 text-[9px] leading-tight uppercase font-mono">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 px-16 py-5 bg-brand-primary text-black font-black uppercase tracking-[0.3em] text-xs rounded-full overflow-hidden transition-all shadow-[0_0_40px_rgba(0,255,157,0.3)] hover:shadow-[0_0_60px_rgba(0,255,157,0.5)]"
          >
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-30" />
            Initialize neural sequence
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
          
          <div className="flex items-center gap-8 text-[9px] text-white/20 font-mono uppercase tracking-[0.3em]">
             <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-brand-primary" />
                <span>Neural Sync: Online</span>
             </div>
             <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-brand-secondary" />
                <span>Secure_Tunnel_V4_7</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Sidebar Info */}
      <div className="absolute top-1/2 -translate-y-1/2 left-8 hidden lg:block space-y-12 opacity-20">
         {['LOGISTICS', 'MARKET', 'RISK', 'BUILD'].map(s => (
           <div key={s} className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold tracking-[1em] text-white uppercase">{s}</div>
         ))}
      </div>

      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-white/10 uppercase text-right leading-loose">
        <div>[SYSTEM_KERNEL]: OK</div>
        <div>[AI_SYNC]: CALIBRATED</div>
        <div>[GATEWAY]: PRIORITY_STATUS</div>
      </div>
    </div>
  );
};
