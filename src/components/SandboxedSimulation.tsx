import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Loader2, 
  Target, 
  Layers, 
  ChevronRight, 
  Layout, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Users,
  AlertCircle
} from 'lucide-react';
import { PersonaPreset, SimulationResult, AppSettings } from '../types';

const DEFAULT_PERSONAS: PersonaPreset[] = [
  {
    id: 'lean',
    name: 'Lean Disruptor',
    description: 'Minimal MVP focus, low-cost overhead, and lightning-fast market entry.',
    systemInstruction: 'You are the Lean Disruptor. Optimize for the smallest possible feature set that solves the core problem. Use serverless and low-cost tools.'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Grade',
    description: 'High compliance, maximum security, and infinite scalability patterns.',
    systemInstruction: 'You are the Enterprise Architect. Optimize for SOC2 compliance, multi-region redundancy, and deep RBAC systems.'
  },
  {
    id: 'growth',
    name: 'Growth Hacker',
    description: 'Aggressive virality, referral optimization, and automated traffic acquisition.',
    systemInstruction: 'You are the Growth Specialist. Optimize for viral loops, high conversion funnels, and automated SEO landing pages.'
  },
  {
    id: 'bootstrapper',
    name: 'Profit First',
    description: 'Sustainable margins, immediate monetization, and zero venture dependency.',
    systemInstruction: 'You are the Bootstrapper. Optimize for high LTV/CAC ratio and immediate cash flow generation.'
  }
];

interface SandboxedSimulationProps {
  input: string;
  settings: AppSettings;
}

export const SandboxedSimulation: React.FC<SandboxedSimulationProps> = ({ input, settings }) => {
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(['lean', 'growth']);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const togglePersona = (id: string) => {
    setSelectedPersonas(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const runSimulation = async () => {
    if (!input) return;
    setLoading(true);
    setResults([]);
    setActiveTab(null);

    const personasToSimulate = DEFAULT_PERSONAS.filter(p => selectedPersonas.includes(p.id));

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': settings.apiKey,
          'x-gemini-model': settings.model,
          'x-user-tier': settings.tier
        },
        body: JSON.stringify({ input, personas: personasToSimulate })
      });

      if (!response.ok) throw new Error('Simulation cluster failure');
      const data = await response.json();
      setResults(data);
      if (data.length > 0) setActiveTab(data[0].personaId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px]">
      {/* Sidebar - Persona Selection */}
      <div className="flex border-b border-white/5 bg-white/5">
        <div className="p-4 border-r border-white/5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-brand-secondary" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Persona Presets</span>
          </div>
          <p className="text-[8px] text-white/20 uppercase font-mono italic">Select Simulation Models</p>
        </div>
        <div className="flex-1 flex items-center gap-4 px-6 overflow-x-auto no-scrollbar">
          {DEFAULT_PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => togglePersona(p.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shrink-0 ${
                selectedPersonas.includes(p.id)
                  ? 'bg-brand-secondary/20 border-brand-secondary text-brand-secondary shadow-[0_0_10px_rgba(var(--brand-secondary-rgb),0.2)]'
                  : 'bg-black/40 border-white/5 text-white/40 hover:border-white/10'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${selectedPersonas.includes(p.id) ? 'bg-brand-secondary animate-pulse' : 'bg-white/10'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{p.name}</span>
            </button>
          ))}
        </div>
        <div className="p-4">
          <button
            onClick={runSimulation}
            disabled={loading || selectedPersonas.length === 0 || !input}
            className={`px-6 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              loading 
                ? 'bg-brand-secondary/10 border-brand-secondary text-brand-secondary cursor-wait' 
                : 'bg-brand-secondary text-black hover:shadow-[0_0_20px_rgba(var(--brand-secondary-rgb),0.3)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
            {loading ? 'Processing...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-brand-secondary/10 rounded-full animate-ping" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-mono text-brand-secondary font-bold uppercase animate-pulse">Running Parallel Execution Branches</p>
              <p className="text-[8px] text-white/20 uppercase mt-1">Cross-referencing {selectedPersonas.length} strategies</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Sidebar Tabs */}
            <div className="w-48 border-r border-white/5 bg-black/20 flex flex-col overflow-y-auto">
              {results.map(res => (
                <button
                  key={res.personaId}
                  onClick={() => setActiveTab(res.personaId)}
                  className={`p-4 text-left border-b border-white/5 transition-all relative ${
                    activeTab === res.personaId ? 'bg-white/5 text-white' : 'text-white/40 hover:bg-white/[0.02]'
                  }`}
                >
                  {activeTab === res.personaId && <motion.div layoutId="simTab" className="absolute left-0 top-0 bottom-0 w-1 bg-brand-secondary" />}
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">{res.personaName}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-secondary/50" style={{ width: '80%' }} />
                    </div>
                    <span className="text-[8px] font-mono opacity-50">v1.0</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Simulation Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-brand-secondary" />
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {results.find(r => r.personaId === activeTab)?.personaName} Strategy
                          </h3>
                        </div>
                        <p className="text-xs text-white/40 italic">
                          {DEFAULT_PERSONAS.find(p => p.id === activeTab)?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-brand-secondary font-bold">LATENCY: {results.find(r => r.personaId === activeTab)?.result?.metrics?.latencyMs}ms</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1">
                        <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Build Difficulty</span>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-white font-mono">3.2 / 10</span>
                           <TrendingUp className="w-3 h-3 text-brand-primary" />
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1">
                        <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Market Entry</span>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-white font-mono">Fast</span>
                           <Zap className="w-3 h-3 text-yellow-400" />
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1">
                        <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Compliance Level</span>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-white font-mono">Standard</span>
                           <ShieldCheck className="w-3 h-3 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Architecture Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Layout className="w-4 h-4 text-white/20" />
                        <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Core Architecture</h4>
                      </div>
                      <div className="bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
                        {results.find(r => r.personaId === activeTab)?.result.saasBuildPlan?.architecture || "Architecture synchronization failed."}
                      </div>
                    </div>

                    {/* Risk & Opportunity */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-brand-alert/5 border border-brand-alert/20 rounded-xl p-4 space-y-3">
                         <div className="flex items-center gap-2">
                           <AlertCircle className="w-3.5 h-3.5 text-brand-alert" />
                           <span className="text-[9px] font-bold text-brand-alert uppercase tracking-widest">Critical Risks</span>
                         </div>
                         <ul className="space-y-1">
                           {results.find(r => r.personaId === activeTab)?.result?.riskReport?.vulnerabilities?.slice(0, 3).map((v, i) => (
                             <li key={i} className="text-[10px] text-white/60 flex items-start gap-2">
                               <div className="w-1 h-1 bg-brand-alert rounded-full mt-1.5" />
                               {v}
                             </li>
                           ))}
                         </ul>
                      </div>
                      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 space-y-3">
                         <div className="flex items-center gap-2">
                           <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                           <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Alpha Opportunities</span>
                         </div>
                         <ul className="space-y-1">
                           {results.find(r => r.personaId === activeTab)?.result?.fastActionChecklist?.slice(0, 3).map((v, i) => (
                             <li key={i} className="text-[10px] text-white/60 flex items-start gap-2">
                               <div className="w-1 h-1 bg-brand-primary rounded-full mt-1.5" />
                               {v}
                             </li>
                           ))}
                         </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 group-hover:border-brand-secondary/30 transition-all">
              <Users className="w-8 h-8 text-white/10" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">Sandboxed Persona Simulation</h4>
              <p className="text-xs text-white/40 leading-relaxed">
                Compare multiple execution strategies side-by-side. Our parallel neural clusters will simulate {input ? `"${input}"` : "your SaaS idea"} through different business mentalities simultaneously.
              </p>
            </div>
            {!input && (
              <div className="flex items-center gap-2 text-brand-alert px-4 py-2 bg-brand-alert/10 border border-brand-alert/20 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Input blueprint required for simulation</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] text-white/40 font-mono uppercase">Simulation Clusters: READY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-secondary" />
            <span className="text-[10px] text-white/40 font-mono uppercase">Persona Pool: {DEFAULT_PERSONAS.length}</span>
          </div>
        </div>
        <div className="text-[9px] text-white/20 font-mono uppercase italic tracking-tighter">
          Powered by XecutionAI Neural Engine v3.0.1
        </div>
      </div>
    </div>
  );
};
