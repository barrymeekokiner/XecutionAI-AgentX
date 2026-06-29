import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  ArrowRight,
  Loader2,
  Box,
  Layers,
  Lightbulb,
  Command,
  Plus,
  History as HistoryIcon,
  Copy,
  Download,
  Check,
  RefreshCw,
  Activity,
  Info,
  Globe,
  Search,
  Code2,
  Play
} from 'lucide-react';
import { ExecutionFeed } from './components/ExecutionFeed';
import { LiquidityResult } from './components/LiquidityResult';
import { SaaSResult } from './components/SaaSResult';
import { RiskReport } from './components/RiskReport';
import { SuccessParticles } from './components/SuccessParticles';
import { HistorySidebar } from './components/HistorySidebar';
import { LiquidityFunnel } from './components/LiquidityFunnel';
import { HistorySummary } from './components/HistorySummary';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SettingsDialog, AppSettings } from './components/SettingsDialog';
import { ExecutionResult, ThemeType, AgentLog, VibePrompt, MarketingStrategy } from './types';
import { Settings as SettingsIcon, Palette, Zap as ZapIcon, Terminal as TerminalIcon } from 'lucide-react';

import { SAAS_CONCEPTS, SaaSConcept } from './data/saasConcepts';
import { StripeCheckout } from './components/StripeCheckout';

// Exponential backoff utility
async function fetchWithRetry(url: string, options: any, maxRetries = 3): Promise<Response> {
  let retries = 0;
  while (retries < maxRetries) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const waitTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      console.warn(`Rate limited. Retrying in ${Math.round(waitTime)}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      retries++;
      continue;
    }
    return response;
  }
  return fetch(url, options);
}

const LogPanel = ({ logs, isOpen, onClose, theme }: { logs: AgentLog[], isOpen: boolean, onClose: () => void, theme: ThemeType }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 w-96 max-h-[500px] bg-app-bg border border-white/10 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono">Neural Telemetry</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <Plus className="w-4 h-4 rotate-45" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px]">
          {logs.length === 0 && (
            <div className="text-white/20 italic text-center py-10">No active neural streams...</div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="border-l-2 border-brand-primary/20 pl-3 py-1 animate-in fade-in slide-in-from-left-2">
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold ${
                  log.status === 'success' ? 'text-green-400' : 
                  log.status === 'warning' ? 'text-yellow-400' : 
                  log.status === 'error' ? 'text-red-400' : 'text-brand-secondary'
                }`}>
                  [{log.agent}]
                </span>
                <span className="text-[8px] text-white/20">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="text-white/70 leading-relaxed">{log.message}</div>
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ThemeSwitcher = ({ current, onSelect }: { current: ThemeType, onSelect: (t: ThemeType) => void }) => {
  const themes: { id: ThemeType, color: string, label: string }[] = [
    { id: 'neon', color: '#00ff9d', label: 'Neon Cyber' },
    { id: 'solaris', color: '#ffb300', label: 'Solaris' },
    { id: 'arctic', color: '#80d8ff', label: 'Arctic' },
    { id: 'crimson', color: '#ff5252', label: 'Crimson' },
    { id: 'emerald', color: '#69f0ae', label: 'Emerald' },
    { id: 'monochrome', color: '#ffffff', label: 'Mono' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`w-4 h-4 rounded-full border border-white/20 transition-all hover:scale-110 ${current === t.id ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-black' : ''}`}
          style={{ backgroundColor: t.color }}
          title={t.label}
        />
      ))}
    </div>
  );
};

const MarketingResult = ({ strategy }: { strategy: MarketingStrategy }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 hover:border-brand-primary/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary/20 transition-colors">
              <Globe className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Marketplace Optimization</h3>
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed font-mono uppercase">
            {strategy.marketplaceOptimization}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6 hover:border-brand-secondary/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-secondary/10 rounded-lg group-hover:bg-brand-secondary/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-brand-secondary" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Growth Funnel</h3>
          </div>
          <ul className="space-y-3">
            {strategy.conversionFunnel.map((step, i) => (
              <li key={i} className="flex items-center gap-3 text-[10px] text-white/40 font-mono uppercase">
                <span className="w-4 h-4 rounded-full bg-brand-secondary/20 flex items-center justify-center text-[8px] text-brand-secondary border border-brand-secondary/30">{i+1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-brand-alert" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">SEO Intelligence Matrix</h3>
          </div>
          <span className="px-2 py-1 bg-brand-alert/10 text-brand-alert text-[8px] border border-brand-alert/30 rounded uppercase font-bold tracking-widest">High Intent</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {strategy.seoKeywords.map((kw, i) => (
            <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] text-white/60 font-mono hover:border-brand-alert/50 hover:text-brand-alert transition-all cursor-default">
              #{kw.replace(/\s+/g, '_').toLowerCase()}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/80 border border-brand-primary/20 rounded-xl p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Code2 className="w-12 h-12 text-brand-primary" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Neural Analytics Payload</h3>
        </div>
        <div className="bg-black p-4 rounded-lg border border-white/5 font-mono text-[9px] text-brand-primary/60 max-h-40 overflow-y-auto custom-scrollbar">
          {strategy.analyticsPayload}
        </div>
      </div>
    </div>
  );
};

const VibeCoding = ({ blueprint, vibePrompts, setVibePrompts, isAutoSequencing, onAutoSequence }: { 
  blueprint: any, 
  vibePrompts: VibePrompt[], 
  setVibePrompts: any,
  isAutoSequencing: boolean,
  onAutoSequence: () => void
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setVibePrompts((prev: VibePrompt[]) => 
      prev.map(p => p.id === id ? { ...p, isCompleted: true } : p)
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!blueprint) return null;

  const currentPhaseIndex = vibePrompts.findIndex(p => !p.isCompleted);

  return (
    <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <TerminalIcon className="w-24 h-24" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-brand-primary uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5" />
            Vibe Coding Workshop
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Sequential AI Prompt Chaining Engine</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={onAutoSequence}
              disabled={isAutoSequencing || vibePrompts.every(p => p.isCompleted)}
              className={`px-4 py-2 border rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-3 ${
                isAutoSequencing
                  ? 'bg-brand-alert border-brand-alert text-black animate-pulse'
                  : 'bg-brand-primary/10 border-brand-primary text-brand-primary hover:bg-brand-primary/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]'
              }`}
            >
              {isAutoSequencing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isAutoSequencing ? 'Sequencing...' : 'Automate Sequence'}
            </button>
            <button
              onClick={() => copyToClipboard(blueprint.systemPrompt, 'system-prompt')}
              className={`group px-4 py-2 border rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-3 ${
                copiedId === 'system-prompt' 
                  ? 'bg-brand-primary border-brand-primary text-black' 
                  : 'bg-white/5 border-white/10 text-white hover:border-brand-primary/50'
              }`}
            >
              {copiedId === 'system-prompt' ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />}
              {copiedId === 'system-prompt' ? 'Persona Sequenced' : 'Copy System Instructions'}
            </button>
          </div>
          <p className="text-[9px] text-white/20 italic">Paste instructions then automate or copy phases manually.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 relative z-10">
        {vibePrompts.map((prompt, idx) => {
          const isNext = idx === currentPhaseIndex;
          const isLocked = idx > currentPhaseIndex && currentPhaseIndex !== -1;
          
          return (
            <motion.div 
              key={prompt.id} 
              initial={false}
              animate={{
                scale: isNext ? 1.02 : 1,
                opacity: isLocked ? 0.3 : 1
              }}
              className={`border rounded-xl p-5 transition-all duration-500 relative overflow-hidden ${
                prompt.isCompleted 
                  ? 'bg-black/60 border-brand-primary/30' 
                  : isNext
                    ? 'bg-brand-primary/10 border-brand-primary shadow-[0_0_30px_rgba(0,255,157,0.1)]'
                    : 'bg-black/40 border-white/10'
              }`}
            >
              {prompt.isCompleted && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 px-2 py-1 bg-brand-primary/20 rounded border border-brand-primary/30">
                    <Check className="w-3 h-3 text-brand-primary" />
                    <span className="text-[8px] font-bold text-brand-primary uppercase tracking-widest">Sequenced</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-black italic tracking-tighter transition-all ${
                  prompt.isCompleted ? 'bg-brand-primary/20 text-brand-primary' : isNext ? 'bg-brand-primary text-black scale-110 shadow-[0_0_15px_#00ff9d]' : 'bg-white/10 text-white/40'
                }`}>
                  P{idx + 1}
                </div>
                <div>
                  <h4 className={`text-[11px] font-bold uppercase tracking-[0.2em] ${prompt.isCompleted ? 'text-white/40 line-through' : 'text-white'}`}>
                    {prompt.phase}
                  </h4>
                  {isNext && <span className="text-[8px] text-brand-primary uppercase font-bold tracking-widest animate-pulse">Ready for Injection</span>}
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-lg font-mono text-[11px] text-white/60 leading-relaxed mb-5 border border-white/5 group relative">
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <TerminalIcon className="w-3 h-3 text-brand-primary" />
                </div>
                {prompt.content}
              </div>

              <button
                onClick={() => copyToClipboard(prompt.content, prompt.id)}
                disabled={isLocked || prompt.isCompleted}
                className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                  prompt.isCompleted 
                    ? 'bg-white/5 text-white/20 cursor-not-allowed opacity-50' 
                    : isNext
                      ? 'bg-brand-primary text-black hover:shadow-[0_0_20px_#00ff9d] hover:-translate-y-0.5'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {copiedId === prompt.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    Prompt Captured
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {prompt.isCompleted ? 'Phase Executed' : isLocked ? 'Awaiting Phase Sequence' : `Copy Phase ${idx + 1} Prompt`}
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      <div className="bg-black/40 border border-white/5 p-4 rounded-lg flex items-center gap-4 relative z-10">
        <div className="p-2 bg-brand-secondary/10 rounded">
          <Info className="w-4 h-4 text-brand-secondary" />
        </div>
        <p className="text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
          Copy each prompt sequentially. Do not skip phases. Each prompt depends on the state established by the previous one. Mark as completed by copying.
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [showFunnel, setShowFunnel] = useState(true);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'liquidity' | 'saas' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [requestQueue, setRequestQueue] = useState<(() => Promise<void>)[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isAutoSequencing, setIsAutoSequencing] = useState(false);
  const [currentAutoStep, setCurrentAutoStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'marketing' | 'risks' | 'logs'>('plan');
  const [blueprints, setBlueprints] = useState<{ label: string; value: string; mode: string }[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{label: string, append: string}[]>([]);
  const [history, setHistory] = useState<ExecutionResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [eta, setEta] = useState(0);
  const [vibePrompts, setVibePrompts] = useState<VibePrompt[]>([]);
  const [lastMetrics, setLastMetrics] = useState<ExecutionResult['metrics']>();
  const [showStripe, setShowStripe] = useState<{tier: 'standard' | 'premium'} | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persistence for Session
  useEffect(() => {
    const savedInput = localStorage.getItem('session_input');
    const savedTab = localStorage.getItem('session_active_tab');
    if (savedInput) setInput(savedInput);
    if (savedTab) setActiveTab(savedTab as any);
  }, []);

  useEffect(() => {
    localStorage.setItem('session_input', input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem('session_active_tab', activeTab);
  }, [activeTab]);

  // Persistence for Vibe Coding
  useEffect(() => {
    if (result?.id && vibePrompts.length > 0) {
      localStorage.setItem(`vibe_progress_${result.id}`, JSON.stringify(vibePrompts));
    }
  }, [vibePrompts, result?.id]);

  useEffect(() => {
    if (result?.id) {
      const saved = localStorage.getItem(`vibe_progress_${result.id}`);
      if (saved) {
        try {
          setVibePrompts(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to restore vibe progress", e);
        }
      } else if (result.saasBlueprint) {
        setVibePrompts(result.saasBlueprint.vibePrompts || []);
      }
    }
  }, [result?.id]);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>(() => (localStorage.getItem('system_theme') as ThemeType) || 'neon');
  const [liveLogs, setLiveLogs] = useState<AgentLog[]>([]);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  
  const personaPresets = [
    { label: 'Standard AgentX', value: '' },
    { label: 'Minimalist Developer', value: 'You are an expert minimalist developer who prioritizes zero-dependency code, extreme performance, and readable architecture. Avoid bloated libraries and overly complex abstractions.' },
    { label: 'Growth Marketer', value: 'You are an aggressive growth-focused engineer. Your priority is time-to-market, viral loops, conversion optimization, and fast liquidity exits. Every technical choice must serve business growth.' },
    { label: 'Enterprise Architect', value: 'You are a Senior Enterprise Architect. Focus on scalability, multi-tenant security, robust API documentation, and long-term maintainability. Use industry-standard design patterns.' },
    { label: 'Security Auditor', value: 'You are a paranoid security auditor. Your primary focus is zero-trust architecture, encryption at rest/transit, and identifying every possible attack vector before writing a single line of feature code.' }
  ];

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('system_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      apiKey: '',
      model: 'gemini-3.1-flash-lite',
      autoRefine: true,
      persistenceMode: 'local',
      tier: 'free'
    };
  });

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('system_theme', theme);
  }, [theme]);

  const addLog = (agent: AgentLog['agent'], message: string, status: AgentLog['status'] = 'info') => {
    setLiveLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      agent,
      message,
      status
    }, ...prev].slice(0, 50));
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upgrade = params.get('upgrade');
    const newTier = params.get('tier');

    if (upgrade === 'success' && newTier) {
      setSettings(prev => ({ ...prev, tier: newTier as any }));
      setToast({ message: `Successfully upgraded to XecutionAI ${newTier.toUpperCase()}`, type: 'success' });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Helper for headers
  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-user-tier': settings.tier
    };
    if (settings.apiKey) headers['x-gemini-key'] = settings.apiKey;
    if (settings.model) headers['x-gemini-model'] = settings.model;
    if (settings.customSystemInstruction) headers['x-custom-instruction'] = settings.customSystemInstruction;
    return headers;
  };

  // Save Settings
  useEffect(() => {
    localStorage.setItem('system_settings', JSON.stringify(settings));
  }, [settings]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('execution_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save History
  useEffect(() => {
    localStorage.setItem('execution_history', JSON.stringify(history));
  }, [history]);

  const [modelStatus, setModelStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const verifyModelCompatibility = async () => {
    setModelStatus('checking');
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: getHeaders()
      });
      if (response.ok) {
        setModelStatus('online');
      } else {
        setModelStatus('offline');
      }
    } catch (e) {
      setModelStatus('offline');
    }
  };

  useEffect(() => {
    verifyModelCompatibility();
    const interval = setInterval(verifyModelCompatibility, 600000); // Check every 10 minutes to save quota
    return () => clearInterval(interval);
  }, [settings.apiKey, settings.model]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      
      // Cmd + Enter to Execute
      if (isCmd && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }
      // Cmd + K to Focus
      if (isCmd && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Cmd + L for Liquidity
      if (isCmd && e.key === 'l') {
        e.preventDefault();
        setMode('liquidity');
      }
      // Cmd + S for SaaS
      if (isCmd && e.key === 's') {
        e.preventDefault();
        setMode('saas');
      }
      // Cmd + , for Settings
      if (isCmd && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, mode]);

  // Fetch Trending Blueprints
  const fetchTrends = async (modelOverride?: string) => {
    setTrendsLoading(true);
    try {
      const headers = getHeaders();
      if (modelOverride) headers['x-gemini-model'] = modelOverride;

      const res = await fetchWithRetry('/api/trends', { 
        method: 'GET',
        headers
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 || res.status === 404) {
          const current = modelOverride || settings.model;
          const currentIndex = fallbackModels.indexOf(current);
          if (currentIndex !== -1 && currentIndex < fallbackModels.length - 1) {
            const next = fallbackModels[currentIndex + 1];
            console.warn(`Trends failed (${res.status}). Falling back to ${next}`);
            return fetchTrends(next);
          }
        }
        throw new Error(data.error || "Failed to fetch trends");
      }

      if (Array.isArray(data)) {
        setBlueprints(data.sort(() => Math.random() - 0.5));
      }
    } catch (e) {
      console.error("Trends Error:", e);
      // Expanded fallback library for maximum variety
      const fallbacks = [
        { label: "AI Domain Portfolio", value: "ASSETS: 52 premium .ai domains. GOAL: Rapid flip.", mode: "liquidity" },
        { label: "GPU Lease Exit", value: "ACCESS: Unused H100 cluster capacity. GOAL: OTC lease-swap.", mode: "liquidity" },
        { label: "Deepfake Guard SaaS", value: "IDEA: Real-time deepfake detection API.", mode: "saas" },
        { label: "SaaS Micro-Acquisition", value: "ASSET: Stagnant CRM SaaS (1.2k users). GOAL: Relaunch with AI core.", mode: "both" },
        { label: "Voice AI Agent Dev", value: "IDEA: Healthcare voice agent for appointments. STACK: Daily + Vapi.", mode: "saas" },
        { label: "Patent Portfolio", value: "ASSET: 12 utility patents (Quantum crypto). GOAL: Strategic sale.", mode: "liquidity" },
        { label: "Compute Arbitrage", value: "ASSET: Reserved spot instances. GOAL: Sublease to training startups.", mode: "liquidity" },
        { label: "Legacy Code Migration", value: "IDEA: AI tool to convert COBOL to Typescript.", mode: "saas" },
        { label: "Real Estate SaaS", value: "IDEA: Automated virtual staging for empty listings.", mode: "saas" },
        { label: "BioTech IP Sale", value: "ASSET: CRISPR delivery patents. GOAL: Pharma licensing.", mode: "liquidity" },
        { label: "Vertical SaaS CRM", value: "IDEA: CRM for boutique law firms with AI deposition summary.", mode: "saas" },
        { label: "Ad-Block Analytics", value: "IDEA: Privacy-first analytics for sites with 90%+ adblock rates.", mode: "saas" }
      ];
      setBlueprints(fallbacks.sort(() => Math.random() - 0.5).slice(0, 6));
    } finally {
      setTrendsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  // Intelligent Mode Switcher & Refinement Suggestions
  useEffect(() => {
    if (!input || input.length < 15) { // Minimum length to trigger refinement
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const callRefine = async (modelOverride?: string): Promise<void> => {
        try {
          const headers = getHeaders();
          if (modelOverride) headers['x-gemini-model'] = modelOverride;

          const res = await fetchWithRetry('/api/refine', {
            method: 'POST',
            headers,
            body: JSON.stringify({ input }),
          });
          
          if (!res.ok) {
            // Do NOT retry refinement on 429/404 to save quota for main execution
            return;
          }

          const data = await res.json();
          if (data.detectedMode && data.detectedMode !== mode && input.length > 30) {
            setMode(data.detectedMode as any);
          }
          if (data.suggestions) {
            setSuggestions(data.suggestions);
          }
        } catch (e) {
          // Fail silently for refinement to preserve UX
          console.error("Refine error", e);
        }
      };

      callRefine();
    }, 1500); // Increased debounce to 1.5s

    return () => clearTimeout(timeout);
  }, [input]);

  // Request Queue Processing
  useEffect(() => {
    if (requestQueue.length > 0 && !isProcessingQueue) {
      const processQueue = async () => {
        setIsProcessingQueue(true);
        const nextRequest = requestQueue[0];
        await nextRequest();
        setRequestQueue(prev => prev.slice(1));
        setIsProcessingQueue(false);
      };
      processQueue();
    }
  }, [requestQueue, isProcessingQueue]);

  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fallbackModels = ['gemini-3.1-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-preview'];

  const executeWithFallback = async (currentModel: string, retryCount = 0): Promise<{ data: any; response: Response }> => {
    const headers = getHeaders();
    if (retryCount > 0) {
      headers['x-gemini-model'] = currentModel;
    }

    setStreamingText('');
    const response = await fetch('/api/execute-stream', {
      method: 'POST',
      headers,
      body: JSON.stringify({ mode, input }),
    });

    if (!response.ok) {
      const data = await response.json();
      if (retryCount < fallbackModels.length) {
        const nextModel = fallbackModels[retryCount];
        if (nextModel !== currentModel) {
          setToast({ 
            message: `Neural pathway ${currentModel} saturated. Re-routing to: ${nextModel}`, 
            type: 'info' 
          });
          return executeWithFallback(nextModel, retryCount + 1);
        }
      }
      return { data, response };
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    let fullJson = "";
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.chunk) {
              fullJson += data.chunk;
              setStreamingText(fullJson);
              if (fullJson.length % 100 === 0) {
                addLog('SYSTEM', 'Neural stream active: Processing chunks...', 'info');
              }
            }
            if (data.done) {
              return { data: { ...JSON.parse(fullJson), metrics: data.metrics }, response: { ok: true } as any };
            }
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            // Ignore incomplete JSON chunks
          }
        }
      }
    }
    
    return { data: JSON.parse(fullJson), response: { ok: true } as any };
  };

  const handleAutoSequence = async () => {
    if (!vibePrompts.length || isAutoSequencing) return;
    
    setIsAutoSequencing(true);
    addLog('SYSTEM', 'Autonomous construction sequence initiated.', 'info');
    
    for (let i = 0; i < vibePrompts.length; i++) {
      if (vibePrompts[i].isCompleted) continue;
      
      setCurrentAutoStep(i);
      addLog('DEVELOPER', `Executing construction phase: ${vibePrompts[i].phase}`, 'info');
      
      // Simulate "work"
      await new Promise(r => setTimeout(r, 2000));
      
      setVibePrompts(prev => prev.map((p, idx) => 
        idx === i ? { ...p, isCompleted: true } : p
      ));
      
      addLog('SYSTEM', `Phase ${i + 1} finalized and integrated.`, 'success');
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsAutoSequencing(false);
    setCurrentAutoStep(-1);
    setShowParticles(true);
    addLog('ORCHESTRATOR', 'Full application sequence finalized. Marketplace readiness: 100%.', 'success');
    setToast({ message: 'Neural sequence complete. Application deployed.', type: 'success' });
  };

  const handleExecute = async () => {
    if (!input || loading) return;
    
    const executionTask = async () => {
      setLoading(true);
      setResult(null);
      setError(null);
      setLiveLogs([]); // Clear logs for new session
      setIsLogsOpen(true);
      setProgress(5);
      setElapsedTime(0);
      setEta(12);
      
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      addLog('ORCHESTRATOR', `Initializing sync for objective: "${input.substring(0, 50)}..."`, 'info');
      setLoadingStep('Initializing Logic Engine...');
      
      try {
        await new Promise(r => setTimeout(r, 600));
        setProgress(15);
        addLog('SYSTEM', 'Verifying neural gateway status...', 'info');
        
        setLoadingStep('Autonomous Planning Phase...');
        setProgress(30);
        addLog('ORCHESTRATOR', `Spawning Agent Clusters for ${mode.toUpperCase()} mode`, 'info');
        
        const { data, response } = await executeWithFallback(settings.model);
        
        setProgress(60);
        setLoadingStep('Drafting Execution Blueprints...');
        addLog('DEVELOPER', 'Architecting structural frameworks...', 'info');
        addLog('ORCHESTRATOR', 'Negotiating with Agent Clusters for optimal pathing...', 'info');
        
        if (!response.ok) {
          clearInterval(timer);
          addLog('SYSTEM', `Critical failure in neural stream: ${data.error}`, 'error');
          throw new Error(data.error || "Execution failed");
        }

        setProgress(85);
        addLog('LIQUIDITY', 'Mapping high-velocity exit channels...', 'success');
        addLog('SRE', 'Analyzing infrastructure bottlenecks...', 'info');
        addLog('ORCHESTRATOR', 'Strategic alignment confirmed.', 'success');

        setLoadingStep('Finalizing Strategic Alignment...');
        await new Promise(r => setTimeout(r, 600));
        setProgress(95);
        
        addLog('COMPRESSOR', 'Optimizing execution sequence for speed-to-liquidity', 'success');
        addLog('SYSTEM', 'Compiling execution manifest...', 'info');

        const enrichedResult: ExecutionResult = {
          ...data,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          input: input,
          mode: mode,
          actualizedCashout: mode === 'liquidity' ? (data.liquidityPlan?.assetTable?.reduce((sum: number, a: any) => sum + a.flashValue, 0) || 0) * 0.8 : 0
        };

        if (enrichedResult.saasBlueprint) {
          setVibePrompts(enrichedResult.saasBlueprint.vibePrompts || []);
        }

        if (enrichedResult.metrics) {
          setLastMetrics(enrichedResult.metrics);
        }

        setResult(enrichedResult);
        setHistory(prev => [enrichedResult, ...prev].slice(0, 50));
        setActiveTab('plan');
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 2000);
        
        clearInterval(timer);
        setProgress(100);
      } catch (err: any) {
        clearInterval(timer);
        console.error(err);
        setError(err.message || "Autonomous alignment failed. System quota might be exceeded.");
        setToast({ message: err.message || "Execution failed", type: 'error' });
      } finally {
        setLoading(false);
        setLoadingStep('');
      }
    };

    setRequestQueue(prev => [...prev, executionTask]);
  };

  const applySuggestion = (append?: string) => {
    if (!append) return;
    setInput(prev => prev + (prev.endsWith(' ') ? '' : ' ') + append);
  };

  const exportToMarkdown = () => {
    if (!result) return;
    
    let md = `# Execution Plan: ${result.input}\n`;
    md += `Mode: ${result.mode.toUpperCase()}\n`;
    md += `Date: ${new Date(result.timestamp).toLocaleString()}\n\n`;
    
    if (result.liquidityPlan) {
      md += `## Liquidity Plan\n\n`;
      md += `| Asset | Class | Platform | Strategy |\n|---|---|---|---|\n`;
      result.liquidityPlan.assetTable.forEach(a => {
        md += `| ${a.asset} | ${a.classification} | ${a.platform} | ${a.priceTiers} |\n`;
      });
      md += `\n### Market Map\n${result.liquidityPlan.marketMap}\n\n`;
      md += `### Execution Sequence\n`;
      result.liquidityPlan.executionSequence.forEach((s, i) => md += `${i+1}. ${s}\n`);
    }
    
    if (result.saasBuildPlan) {
      md += `\n## SaaS Build Plan\n\n`;
      md += `### Architecture\n${result.saasBuildPlan.architecture}\n\n`;
      md += `### Data Schema\n\`\`\`sql\n${result.saasBuildPlan.dbSchema}\n\`\`\`\n\n`;
      md += `### Stripe Flow\n${result.saasBuildPlan.stripeFlow}\n\n`;
    }
    
    md += `\n## Risk Assessment\n\n`;
    md += `### Vulnerabilities\n- ${result.riskReport.vulnerabilities.join('\n- ')}\n`;
    
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  if (showFunnel) {
    return <LiquidityFunnel onStart={() => setShowFunnel(false)} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-app-bg text-[#e0e0e0] font-sans selection:bg-brand-primary/30 p-6 flex flex-col">
        {/* Header */}
      <header className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-transform hover:rotate-12">
            <span className="text-black font-black text-xl italic tracking-tighter">X</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">XecutionAI // AgentX</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">One-Click Asset Liquidity & SaaS Studio</p>
          </div>
        </div>
        
          <div className="flex items-center gap-4">
            <ThemeSwitcher current={theme} onSelect={setTheme} />
            <div className="flex items-center gap-4 border-r border-white/10 pr-8">
              <button 
                onClick={() => setIsLogsOpen(!isLogsOpen)}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest border px-3 py-1.5 rounded transition-all ${
                  isLogsOpen ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'text-white/40 border-white/5 bg-white/[0.02] hover:text-white'
                }`}
              >
                <TerminalIcon className="w-3 h-3" />
                Telemetry
              </button>
              <div className={`px-3 py-1 rounded border flex items-center gap-2 ${
                settings.tier === 'premium' ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' :
                settings.tier === 'standard' ? 'bg-brand-secondary/10 border-brand-secondary/30 text-brand-secondary' :
                'bg-white/5 border-white/10 text-white/40'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  settings.tier === 'premium' ? 'bg-brand-primary animate-pulse' :
                  settings.tier === 'standard' ? 'bg-brand-secondary' :
                  'bg-white/20'
                }`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{settings.tier} Access</span>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest border border-white/5 bg-white/[0.02] px-3 py-1.5 rounded"
              >
                <HistoryIcon className="w-3 h-3 text-brand-secondary" />
                History
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest border border-white/5 bg-white/[0.02] px-3 py-1.5 rounded relative group"
              >
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-app-bg ${
                  modelStatus === 'online' ? 'bg-brand-primary' : 
                  modelStatus === 'offline' ? 'bg-brand-alert' : 
                  'bg-white/20 animate-pulse'
                }`} />
                <SettingsIcon className="w-3 h-3 text-brand-primary group-hover:rotate-90 transition-transform duration-500" />
                Settings
              </button>
              <div className="text-[9px] text-white/30 font-mono flex flex-col items-end">
              <span>⌘+↵ EXECUTE</span>
              <span>⌘+K FOCUS</span>
            </div>
          </div>
          <div className="text-right text-[11px] uppercase tracking-widest">
            <div className="text-white/40 mb-1">Status</div>
            <div className="text-brand-primary font-mono flex items-center gap-2 justify-end">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
              Active: Priority Flow
            </div>
          </div>
          <div className="text-right text-[11px] uppercase tracking-widest border-l border-white/10 pl-8">
            <div className="text-white/40 mb-1">Uptime</div>
            <div className="text-brand-secondary font-mono">142:12:08:55</div>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Controls */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <HistorySummary history={history} />
          <div className="bg-white/5 border border-white/10 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Command className="w-3 h-3 text-brand-primary" />
                Master Orchestrator
              </h2>
              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] border border-brand-primary/30 rounded uppercase">Live Grounding</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-white/40 uppercase font-bold mb-2 tracking-widest">Routing Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['liquidity', 'saas', 'both'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-2 px-1 text-[9px] uppercase font-bold rounded border transition-all flex flex-col items-center gap-1.5 ${
                        mode === m 
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(0,255,157,0.1)]' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {m === 'liquidity' ? <ZapIcon className="w-3 h-3" /> : 
                       m === 'saas' ? <Layers className="w-3 h-3" /> : 
                       <Cpu className="w-3 h-3" />}
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] text-white/40 uppercase font-bold tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-brand-secondary" />
                    Trending Blueprints
                  </label>
                  <button 
                    onClick={() => fetchTrends()}
                    disabled={trendsLoading}
                    className="p-1 hover:bg-white/5 rounded transition-colors text-white/20 hover:text-brand-primary"
                    title="Refresh Trends"
                  >
                    <RefreshCw className={`w-3 h-3 ${trendsLoading ? 'animate-spin text-brand-primary' : ''}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blueprints && blueprints.length > 0 ? blueprints.map((bp) => (
                    <button
                      key={bp.label}
                      onClick={() => {
                        setInput(bp.value);
                        setMode(bp.mode as any);
                      }}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white/60 hover:border-brand-primary/50 hover:text-white transition-all cursor-pointer uppercase tracking-tighter"
                    >
                      {bp.label}
                    </button>
                  )) : blueprints ? (
                    <div className="text-[9px] text-white/20 animate-pulse">Fetching grounded trends...</div>
                  ) : null}
                </div>
              </div>

              {/* SaaS Concept Library */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Lightbulb className="w-3 h-3 text-brand-primary" />
                  SaaS Factory Templates
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SAAS_CONCEPTS.map(concept => (
                    <button
                      key={concept.id}
                      onClick={() => {
                        setInput(concept.description);
                        setMode('saas');
                        // Auto-trigger execution for autonomous feel
                        setTimeout(() => handleExecute(), 100);
                      }}
                      className="text-left bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all group"
                    >
                      <h4 className="text-[10px] font-bold text-white group-hover:text-brand-primary transition-colors mb-1 uppercase">{concept.name}</h4>
                      <p className="text-[8px] text-white/30 leading-tight line-clamp-2 uppercase font-mono">{concept.category}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Neural Persona</label>
                  <select 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSettings({ ...settings, customSystemInstruction: val });
                    }}
                    value={settings.customSystemInstruction || ''}
                    className="bg-black/40 border border-white/5 rounded px-2 py-0.5 text-[9px] text-white/60 focus:outline-none focus:border-brand-primary transition-all cursor-pointer uppercase tracking-tighter"
                  >
                    {personaPresets.map(p => (
                      <option key={p.label} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded opacity-10 group-focus-within:opacity-30 transition-opacity blur" />
                <label className="block text-[10px] text-white/40 uppercase font-bold mb-2 tracking-widest relative">Asset/Idea Definition</label>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="DEPLOY: [ASSET_LIST] OR [SAAS_SPEC]..."
                  className={`relative w-full h-32 bg-black/80 backdrop-blur-md border ${error ? 'border-brand-alert/50' : 'border-white/10'} rounded p-4 text-xs focus:outline-none focus:border-brand-primary transition-all resize-none font-mono placeholder:text-white/5 text-white/80 shadow-inner`}
                />
                
                {/* Visual accents */}
                <div className="absolute top-0 right-0 p-2 pointer-events-none opacity-20">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                </div>
                
                {error && (
                  <div className="mt-2 text-[9px] text-brand-alert bg-brand-alert/10 border border-brand-alert/20 p-2 rounded uppercase font-bold flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" />
                    {error}
                  </div>
                )}
                
                {/* Prompt Assistant suggestions */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 left-0 right-0 bg-black/90 border border-brand-primary/20 p-2 rounded-lg backdrop-blur-xl shadow-2xl z-20"
                    >
                      <p className="text-[8px] text-brand-primary uppercase font-bold mb-2 tracking-widest flex items-center gap-1">
                        <Lightbulb className="w-2 h-2" />
                        Refine Plan
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => applySuggestion(s.append)}
                            className="text-[9px] bg-brand-primary/5 hover:bg-brand-primary/20 border border-brand-primary/10 px-2 py-1 rounded text-brand-primary/80 transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-2 h-2" />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleExecute}
                disabled={loading || !input}
                className="w-full py-3 bg-brand-primary text-black font-bold text-xs uppercase rounded hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.15)]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Initialize Sequence
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <ExecutionFeed logs={result?.agentLogs || []} />
          
          <div className="bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_#00ff9d] animate-pulse" />
            <div className="text-[10px] text-white uppercase font-bold tracking-tighter">Strategic Goal: <span className="text-brand-primary ml-1">MAXIMIZE VELOCITY OVER VALUATION</span></div>
          </div>
        </div>

        {/* Right Column: Execution Canvas */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-white/[0.02] border border-white/10 rounded-lg flex flex-col items-center justify-center relative min-h-[500px]"
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#00ff9d_0%,transparent_70%)]" />
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 rounded-full border border-brand-primary/30 border-dashed animate-[spin_10s_linear_infinite] flex items-center justify-center mb-6">
                    <Layers className="w-10 h-10 text-brand-primary/40" />
                  </div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-[0.3em] mb-2">Idle System</h2>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-mono">Awaiting routing instructions...</p>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center min-h-[500px] bg-white/[0.02] border border-white/5 rounded-lg relative overflow-hidden"
              >
                {/* Visual Data Stream Overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                  <div className="flex flex-wrap gap-4 p-4 font-mono text-[8px] animate-pulse">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span key={i} className="text-brand-primary">
                        {Math.random() > 0.5 ? 'SYNC_NODE_' : 'THREAD_'}0x{Math.floor(Math.random()*1000).toString(16)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 w-full max-w-md px-8">
                  <div className="flex flex-col items-center mb-12">
                    <div className="w-20 h-20 border-2 border-brand-primary/20 rounded-full flex items-center justify-center relative mb-6">
                      <div className="absolute inset-0 border-t-2 border-brand-primary rounded-full animate-spin" />
                      <div className="absolute inset-2 border-t-2 border-brand-secondary rounded-full animate-spin [animation-duration:2s]" />
                      <div className="absolute -inset-4 bg-brand-primary/5 rounded-full blur-xl animate-pulse" />
                      <Cpu className="w-6 h-6 text-white/40 animate-pulse" />
                    </div>
                    
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.4em] mb-1">Autonomous Sync</h3>
                    <p className="text-[10px] text-brand-primary font-mono animate-pulse tracking-widest uppercase">
                      {loadingStep || 'Neural Gateway Binding'}
                    </p>
                  </div>

                  {/* Real-time Thought Process Stream */}
                  {streamingText && (
                    <div className="mb-8 bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-[9px] text-white/40 overflow-hidden max-h-32 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <div className="animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-brand-primary/60 mr-2">[NODE_STREAM]:</span>
                        {streamingText.substring(Math.max(0, streamingText.length - 300))}
                        <span className="inline-block w-1 h-3 bg-brand-primary ml-1 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Enhanced Progress Container */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end text-[10px] uppercase font-bold tracking-widest font-mono">
                        <span className="text-white/40 flex items-center gap-2">
                          <Activity className="w-3 h-3 text-brand-primary" />
                          Neural Integrity
                        </span>
                        <span className="text-brand-primary">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ type: 'spring', damping: 20 }}
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                        <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Elapsed Time</p>
                        <p className="text-xs font-mono text-white">{elapsedTime}s</p>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                        <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Predicted ETA</p>
                        <p className="text-xs font-mono text-brand-secondary">
                          {progress === 100 ? '0s' : `${Math.max(eta - elapsedTime, 1)}s`}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-primary/5 border border-brand-primary/10 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                        <span className="text-[9px] text-white/40 uppercase tracking-widest leading-none">
                          {requestQueue.length > 1 ? `QUEUE POSITION: ${requestQueue.length - 1}` : 'DIRECT PRIORITY STREAM'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col gap-6"
              >
                {/* Visual Tabs */}
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <div className="flex gap-4">
                    {(['plan', 'marketing', 'risks', 'logs'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] pb-2 transition-all relative ${
                          activeTab === tab
                          ? 'text-brand-primary border-b border-brand-primary'
                          : 'text-white/30 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={exportToMarkdown}
                      className="flex items-center gap-1.5 text-[9px] text-white/40 hover:text-white transition-colors border border-white/10 px-2 py-1 rounded bg-white/5 uppercase tracking-widest font-bold"
                    >
                      {copied ? <Check className="w-3 h-3 text-brand-primary" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Export MD'}
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {activeTab === 'plan' && (
                    <>
                      {/* Fast Action Checklist */}
                      <div className="bg-brand-secondary/5 border border-brand-secondary/20 rounded-lg p-5">
                        <h3 className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Zap className="w-3 h-3" />
                          Fast-Path Checklist
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {result?.fastActionChecklist?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-black/40 p-2.5 rounded border border-white/5 group hover:border-brand-secondary/30 transition-colors">
                              <div className="w-3 h-3 bg-brand-secondary rounded-sm group-hover:shadow-[0_0_8px_rgba(0,212,255,0.4)]" />
                              <span className="text-[11px] text-white/70 font-mono italic">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Engine Modules */}
                      <div className="space-y-8">
                        {result?.saasBlueprint && (
                          <VibeCoding 
                            blueprint={result.saasBlueprint} 
                            vibePrompts={vibePrompts} 
                            setVibePrompts={setVibePrompts} 
                            isAutoSequencing={isAutoSequencing}
                            onAutoSequence={handleAutoSequence}
                          />
                        )}
                        {result?.liquidityPlan && <LiquidityResult plan={result.liquidityPlan} />}
                        {result?.saasBuildPlan && <SaaSResult plan={result.saasBuildPlan} />}
                      </div>
                    </>
                  )}

                  {activeTab === 'marketing' && result?.marketingStrategy && (
                    <MarketingResult strategy={result.marketingStrategy} />
                  )}

                  {activeTab === 'risks' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-brand-alert" />
                          Security & Operational Audit
                        </h2>
                        <div className="text-[10px] font-mono text-white/40">Status: <span className="text-brand-primary">SECURE</span></div>
                      </div>
                      <RiskReport report={result.riskReport} />
                    </div>
                  )}

                  {activeTab === 'logs' && (
                    <div className="bg-black/60 border border-white/10 rounded-lg p-6 min-h-[500px]">
                      <ExecutionFeed logs={result?.agentLogs || []} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white/10">CORE_SYNC</span>
            <span className="text-brand-primary">STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/10">THREATS</span>
            <span className="text-white/60">0_DETECTED</span>
          </div>
        </div>
        <div>
          SYS_OS: <span className="text-white">v2.5_INTELLIGENT_UPGRADE</span>
        </div>
      </footer>

      <SuccessParticles active={showParticles} />
      <LogPanel logs={liveLogs} isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} theme={theme} />
      
      <HistorySidebar 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={(item) => {
          setResult(item);
          setInput(item.input);
          setMode(item.mode as any);
          setIsHistoryOpen(false);
          setActiveTab('plan');
        }}
        onDelete={deleteFromHistory}
      />
        <SettingsDialog 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onSave={setSettings}
          currentSettings={settings}
          lastMetrics={lastMetrics}
        />

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 z-[100]"
            >
              <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
                toast.type === 'error' ? 'bg-brand-alert/10 border-brand-alert text-brand-alert' :
                toast.type === 'success' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' :
                'bg-brand-secondary/10 border-brand-secondary text-brand-secondary'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                   toast.type === 'error' ? 'bg-brand-alert' :
                   toast.type === 'success' ? 'bg-brand-primary' :
                   'bg-brand-secondary'
                } animate-pulse shadow-[0_0_8px_currentColor]`} />
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

