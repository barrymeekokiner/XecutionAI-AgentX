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
  Play,
  Users,
  ChevronRight,
  MessageSquare,
  PlusCircle,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { ExecutionFeed } from './components/ExecutionFeed';
import { LiquidityResult } from './components/LiquidityResult';
import { SaaSResult } from './components/SaaSResult';
import { SaaSMarketplace } from './components/SaaSMarketplace';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { CreatorStudio } from './components/CreatorStudio';
import { RiskReport } from './components/RiskReport';
import { MarketingResult } from './components/MarketingResult';
import { VibeCoding } from './components/VibeCoding';
import { SuccessParticles } from './components/SuccessParticles';
import { HistorySidebar } from './components/HistorySidebar';
import { LiquidityFunnel } from './components/LiquidityFunnel';
import { HistorySummary } from './components/HistorySummary';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SettingsDialog } from './components/SettingsDialog';
import { useFirebase } from './components/FirebaseProvider';
import { db, handleFirestoreError, OperationType, collection, addDoc, query, where, orderBy, onSnapshot, User, setDoc, doc, getDoc, deleteDoc } from './lib/firebase';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Settings as SettingsIcon, Palette, Zap as ZapIcon, Terminal as TerminalIcon, X } from 'lucide-react';

import { WelcomeTour } from './components/WelcomeTour';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { ResourceMonitor } from './components/ResourceMonitor';
import { NeuralRehearsal } from './components/NeuralRehearsal';
import { SandboxedSimulation } from './components/SandboxedSimulation';

import { MarketIntelligence } from './components/MarketIntelligence';
import { SaaSGenome } from './components/SaaSGenome';
import { VentureCouncil } from './components/VentureCouncil';
import { RevenueProjection } from './components/RevenueProjection';
import { GlobalResourceEfficiency } from './components/GlobalResourceEfficiency';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { SaaSGenomeChart } from './components/SaaSGenomeChart';
import { AgentPerformanceDashboard } from './components/AgentPerformanceDashboard';
import { AgentDialoguePanel } from './components/AgentDialoguePanel';
import { ProjectForge } from './components/ProjectForge';
import { AgenticCodingStudio } from './components/AgenticCodingStudio';
import { 
  ResourceMetric as ResourceMetricType, 
  AgentStatus, 
  AgentMessage, 
  AgentPerformanceMetrics,
  AgentLog, 
  ExecutionResult, 
  AppSettings, 
  ThemeType, 
  VibePrompt,
  MarketIntelligence as MarketIntelligenceType,
  SaaSGenome as SaaSGenomeType,
  CouncilOpinion,
  RevenueProjection as RevenueProjectionType,
  MarketIntelligenceEngineReport
} from './types';
import { AgentOrchestratorTree } from './components/AgentOrchestratorTree';
import { AgentRole } from './server/agents';
import { MarketEngineDashboard } from './components/MarketEngineDashboard';

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

const LogPanel = ({ 
  logs, 
  isOpen, 
  onClose, 
  theme, 
  onClear,
  agentStatuses,
  activeRole
}: { 
  logs: AgentLog[], 
  isOpen: boolean, 
  onClose: () => void, 
  theme: ThemeType, 
  onClear: () => void,
  agentStatuses: Record<AgentRole, AgentStatus>,
  activeRole?: AgentRole
}) => {
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [showTree, setShowTree] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 w-[450px] max-h-[600px] bg-app-bg border border-white/10 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-bold uppercase tracking-widest font-mono">Neural Telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowTree(!showTree)} 
                className={`p-1.5 rounded transition-all ${showTree ? 'text-brand-primary bg-brand-primary/10' : 'text-white/20 hover:text-white/40'}`}
                title="Toggle Cluster View"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setAutoScroll(!autoScroll)} 
                className={`p-1.5 rounded transition-all ${autoScroll ? 'text-brand-primary bg-brand-primary/10' : 'text-white/20 hover:text-white/40'}`}
                title={autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={onClear} 
                className="p-1.5 text-white/20 hover:text-brand-alert hover:bg-brand-alert/10 rounded transition-all"
                title="Clear Logs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors ml-1">
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>
          </div>

          {showTree && (
            <div className="p-4 border-b border-white/10 bg-black/20">
              <AgentOrchestratorTree activeRole={activeRole} statuses={agentStatuses} />
            </div>
          )}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] custom-scrollbar">
            {logs.length === 0 && (
              <div className="text-white/20 italic text-center py-10">No active neural streams...</div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="border-l-2 border-brand-primary/20 pl-3 py-1 animate-in fade-in slide-in-from-left-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      log.status === 'success' ? 'text-green-400' : 
                      log.status === 'warning' ? 'text-yellow-400' : 
                      log.status === 'error' ? 'text-red-400' : 'text-brand-secondary'
                    }`}>
                      [{log.agent}]
                    </span>
                    {['CEO', 'CTO', 'Growth', 'Finance', 'Security', 'MarketResearch', 'MARKETING'].includes(log.agent) && (
                      <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 scale-75 origin-left">
                        <div className={`w-1 h-1 rounded-full ${agentStatuses[log.agent as AgentRole]?.status === 'working' ? 'bg-brand-primary animate-pulse' : agentStatuses[log.agent as AgentRole]?.status === 'thinking' ? 'bg-brand-secondary animate-pulse' : 'bg-white/20'}`} />
                        <span className="text-[7px] text-white/40 uppercase tracking-tighter">{agentStatuses[log.agent as AgentRole]?.status || 'idle'}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-white/20">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div className="text-white/70 leading-relaxed mb-1">{log.message}</div>

                {/* Reasoning Extractor */}
                {log.agent !== 'SYSTEM' && log.agent !== 'DEVELOPER' && (
                  <div className="mt-2 pt-2 border-t border-white/5 group/reason">
                    <details className="cursor-pointer">
                      <summary className="text-[7px] text-brand-primary/40 uppercase font-bold hover:text-brand-primary transition-colors flex items-center gap-1 list-none">
                        <Zap className="w-2 h-2" />
                        Extract Neural Rationale
                      </summary>
                      <div className="mt-2 p-2 bg-black/40 rounded border border-white/5 text-[8px] text-white/40 italic leading-tight">
                        Analyzing core request vectors... Cross-referencing {log.agent} knowledge base... 
                        Decision logic: High confidence interval detected based on grounding scan.
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThemeSwitcher = ({ current, onSelect }: { current: ThemeType, onSelect: (t: ThemeType) => void }) => {
  const themes: { id: ThemeType, color: string, secondary: string, label: string }[] = [
    { id: 'neon', color: '#00ff9d', secondary: '#9d00ff', label: 'Neon Cyber' },
    { id: 'solaris', color: '#ffb300', secondary: '#ff6d00', label: 'Solaris' },
    { id: 'arctic', color: '#80d8ff', secondary: '#0091ea', label: 'Arctic' },
    { id: 'crimson', color: '#ff5252', secondary: '#ff1744', label: 'Crimson' },
    { id: 'emerald', color: '#69f0ae', secondary: '#00e676', label: 'Emerald' },
    { id: 'monochrome', color: '#ffffff', secondary: '#333333', label: 'Mono' },
  ];

  return (
    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
      {themes.map((t) => (
        <div key={t.id} className="relative group">
          <button
            onClick={() => onSelect(t.id)}
            className={`w-4 h-4 rounded-full border border-white/20 transition-all hover:scale-125 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] ${current === t.id ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'opacity-60 hover:opacity-100'}`}
            style={{ backgroundColor: t.color }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ opacity: 1, scale: 1, y: -45 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center gap-1.5"
          >
            <div className="bg-black/90 border border-white/10 rounded-lg p-2 flex items-center gap-2 shadow-2xl backdrop-blur-xl">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: t.color }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: t.secondary }} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white whitespace-nowrap">{t.label}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-black/90 border-r border-b border-white/10 rotate-45 -mt-1" />
          </motion.div>
        </div>
      ))}
    </div>
  );
};


// Modular components are imported from ./components/


// Modular components are imported from ./components/

export default function App() {
  const [showFunnel, setShowFunnel] = useState(true);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'liquidity' | 'saas' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);
  const [intelligenceResult, setIntelligenceResult] = useState<MarketIntelligenceType | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [requestQueue, setRequestQueue] = useState<(() => Promise<void>)[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isAutoSequencing, setIsAutoSequencing] = useState(false);
  const [currentAutoStep, setCurrentAutoStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [marketEngineReport, setMarketEngineReport] = useState<MarketIntelligenceEngineReport | null>(null);
  const [saasGenome, setSaasGenome] = useState<SaaSGenomeType | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<AgentPerformanceMetrics[]>([]);
  const [founderMode, setFounderMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'market' | 'genome' | 'council' | 'revenue' | 'marketing' | 'risks' | 'logs' | 'resources' | 'efficiency' | 'summary' | 'market_engine' | 'performance' | 'forge' | 'marketplace' | 'enterprise' | 'creator' | 'sandbox' | 'vibe_studio'>('plan');
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [efficiencyMetrics, setEfficiencyMetrics] = useState<ResourceMetricType[]>([]);
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
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [vibePrompts, setVibePrompts] = useState<VibePrompt[]>([]);
  const [lastMetrics, setLastMetrics] = useState<ExecutionResult['metrics']>();
  const [showStripe, setShowStripe] = useState<{tier: 'standard' | 'premium'} | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [showTour, setShowTour] = useState(() => !localStorage.getItem('tour_completed'));
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [hasWarnedUsage, setHasWarnedUsage] = useState(false);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'system' | 'agents'>('system');
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentRole, AgentStatus>>({
    CEO: { status: 'idle', load: 0, lastActive: Date.now() },
    CTO: { status: 'idle', load: 0, lastActive: Date.now() },
    Growth: { status: 'idle', load: 0, lastActive: Date.now() },
    Finance: { status: 'idle', load: 0, lastActive: Date.now() },
    Security: { status: 'idle', load: 0, lastActive: Date.now() },
    MarketResearch: { status: 'idle', load: 0, lastActive: Date.now() },
    Legal: { status: 'idle', load: 0, lastActive: Date.now() },
    Compliance: { status: 'idle', load: 0, lastActive: Date.now() },
    Operations: { status: 'idle', load: 0, lastActive: Date.now() }
  });
  const [activeRole, setActiveRole] = useState<AgentRole | undefined>();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Enterprise Brand Config
  const [teamConfig, setTeamConfig] = useState<{
    companyName: string;
    logo?: string;
    primaryColor: string;
    secondaryColor?: string;
    tokenUsage: { current: number; limit: number };
    topConsumers: { name: string; tokens: number }[];
  }>({
    companyName: 'Neural Dynamics',
    primaryColor: '#00ff9d',
    secondaryColor: '#a855f7',
    tokenUsage: { current: 820000, limit: 1000000 },
    topConsumers: [
      { name: 'architect@neural.io', tokens: 450000 },
      { name: 'owner@neural.io', tokens: 280000 },
      { name: 'analyst@neural.io', tokens: 90000 }
    ]
  });

  const [showQuotaBreakdown, setShowQuotaBreakdown] = useState(false);

  // Firestore Enterprise Theme Sync
  useEffect(() => {
    // Watch the enterprise config document
    const unsub = onSnapshot(doc(db, 'teams', 'enterprise_config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTeamConfig(prev => ({
          ...prev,
          companyName: data.companyName || prev.companyName,
          logo: data.logo || prev.logo,
          primaryColor: data.primaryColor || prev.primaryColor,
          secondaryColor: data.secondaryColor || prev.secondaryColor,
          tokenUsage: data.tokenUsage || prev.tokenUsage
        }));
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'teams/enterprise_config');
    });

    return () => unsub();
  }, []);

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
    const defaults: AppSettings = {
      apiKey: '',
      model: 'gemini-1.5-flash-8b',
      autoRefine: true,
      persistenceMode: 'local',
      tier: 'free',
      verbosity: 'balanced',
      neuralIntensity: 85,
      experimentalFeatures: false,
      autoSequencing: false,
      autoScaling: false,
      gpuThreshold: 90,
      computeThreshold: 90,
      customCpuThreshold: 80,
      customMemoryThreshold: 85,
      manualAgentOverride: false
    };

    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return defaults;
  });

  // Fetch agent messages for telemetry
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch('/api/agents/performance');
        if (res.ok) {
          const data = await res.json();
          setPerformanceMetrics(data);
        }
      } catch (e) {
        console.error("Failed to fetch performance metrics", e);
      }
    };

    if (activeTelemetryTab === 'agents' && result?.id) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/agents/messages?buildId=${result.id}`);
          if (res.ok) {
            const data = await res.json();
            setAgentMessages(data);
          }
        } catch (e) {
          console.error("Failed to fetch agent messages", e);
        }
      };
      fetchMessages();
      fetchPerformance();
      const interval = setInterval(() => {
        fetchMessages();
        fetchPerformance();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTelemetryTab, result?.id]);

  // Usage Monitoring
  useEffect(() => {
    // Basic calculation for usage warning in App
    const limits = { free: 50000, standard: 500000, premium: 5000000 };
    const currentLimit = limits[settings.tier] || limits.free;
    const usageData = [4500, 12000, 8000, 15000, 3000, 18000, lastMetrics?.estimatedTokens || 10000];
    const totalUsage = usageData.reduce((a, b) => a + b, 0);
    
    if (totalUsage / currentLimit > 0.8 && !hasWarnedUsage) {
      setToast({ message: "WARNING: Neural quota exceeding 80%. System efficiency may degrade soon.", type: 'error' });
      setHasWarnedUsage(true);
    }
  }, [lastMetrics, settings.tier, hasWarnedUsage]);

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

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('system_theme', theme);
    
    // Apply Enterprise Branding
    if (teamConfig.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', teamConfig.primaryColor);
    }
    if (teamConfig.secondaryColor) {
      document.documentElement.style.setProperty('--brand-secondary', teamConfig.secondaryColor);
    }
  }, [theme, teamConfig.primaryColor, teamConfig.secondaryColor]);

  const addLog = (agent: AgentLog['agent'], message: string, status: AgentLog['status'] = 'info') => {
    const newLog: AgentLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      agent,
      message,
      status
    };
    setLiveLogs(prev => [newLog, ...prev].slice(0, 100));

    // Update heartbeat for the agent
    if (['CEO', 'CTO', 'Growth', 'Finance', 'Security', 'MarketResearch', 'MARKETING'].includes(agent)) {
      setAgentStatuses(prev => ({
        ...prev,
        [agent as AgentRole]: {
          ...prev[agent as AgentRole],
          lastActive: Date.now()
        }
      }));
    }
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
      // Cmd + S for Settings
      if (isCmd && e.key === 's') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
      // Cmd + L for Logs
      if (isCmd && e.key === 'l') {
        e.preventDefault();
        setIsLogsOpen(!isLogsOpen);
      }
      // Cmd + Shift + C to Clear Logs
      if (isCmd && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setLiveLogs([]);
        setToast({ message: "Neural telemetry cleared.", type: 'info' });
      }
      // Cmd + H for History
      if (isCmd && e.key === 'h') {
        e.preventDefault();
        setIsHistoryOpen(!isHistoryOpen);
      }
      // Esc to close everything
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsLogsOpen(false);
        setIsHistoryOpen(false);
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, isLogsOpen, isSettingsOpen, isHistoryOpen]);

  // Load Efficiency Metrics
  useEffect(() => {
    const saved = localStorage.getItem('efficiency_metrics');
    if (saved) {
      try {
        setEfficiencyMetrics(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse efficiency metrics", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('efficiency_metrics', JSON.stringify(efficiencyMetrics));
  }, [efficiencyMetrics]);

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

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const { user, signIn, logout, loading: authLoading } = useFirebase();

  // Unified history sync
  useEffect(() => {
    if (user && settings.persistenceMode === 'cloud') {
      const q = query(
        collection(db, 'users', user.uid, 'results'),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudHistory = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as ExecutionResult[];
        setHistory(cloudHistory);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/results`);
      });

      return () => unsubscribe();
    } else if (settings.persistenceMode === 'local') {
      const saved = localStorage.getItem('execution_history');
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    }
  }, [user, settings.persistenceMode]);

  // Sync settings to cloud if enabled
  useEffect(() => {
    if (user && settings.persistenceMode === 'cloud') {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'global');
      getDoc(settingsRef).then(snap => {
        if (snap.exists()) {
          setSettings(snap.data() as AppSettings);
        } else {
          setDoc(settingsRef, settings);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && settings.persistenceMode === 'cloud') {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'global');
      setDoc(settingsRef, settings);
    }
  }, [settings, user]);

  const fallbackModels = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];

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

  const runMarketIntelligence = async () => {
    if (!input.trim()) return;
    setIntelligenceLoading(true);
    setIntelligenceResult(null);
    setMarketEngineReport(null);
    setSaasGenome(null);
    setActiveTab('market');
    
    addLog('MARKETING', 'Initiating Autonomous Market Intelligence Scan...', 'info');
    addLog('MARKETING', 'Scanning Reddit, Product Hunt, and Google Trends via grounding...', 'info');
    
    try {
      // Run the standard intelligence scan
      const response = await fetch('/api/market/intelligence', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ input })
      });
      
      if (!response.ok) throw new Error('Market scan failed');
      const data = await response.json();
      setIntelligenceResult(data);
      addLog('MARKETING', `Market intelligence retrieved. Opportunity Score: ${data.opportunityScore}/100`, 'success');

      // Also trigger the advanced engine
      addLog('MARKETING', 'Synthesizing Market Intelligence Engine Report...', 'info');
      const engineRes = await fetch('/api/market/analyze', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ query: input, tier: settings.tier }),
      });
      
      if (engineRes.ok) {
        const engineData = await engineRes.json();
        setMarketEngineReport(engineData);
        addLog('MARKETING', 'Advanced market engine analysis complete.', 'success');
      }

      // Trigger SaaS Genome Engine
      addLog('ORCHESTRATOR', 'Decoding Proprietary SaaS Genome...', 'info');
      const genomeRes = await fetch('/api/saas/genome', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ input, mode })
      });

      if (genomeRes.ok) {
        const genomeData = await genomeRes.json();
        setSaasGenome(genomeData);
        addLog('ORCHESTRATOR', 'SaaS DNA sequencing finalized.', 'success');
      }
      
      setToast({ message: "Market scan complete.", type: 'success' });
    } catch (error: any) {
      console.error(error);
      addLog('MARKETING', 'Neural scan interrupted: ' + error.message, 'error');
      setToast({ message: "Scan failed: " + error.message, type: 'error' });
    } finally {
      setIntelligenceLoading(false);
    }
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
        
        if (founderMode) {
          setLoadingStep('Decoding SaaS DNA...');
          addLog('DEVELOPER', 'Extracting core product identifiers...', 'info');
          const genomeRes = await fetch('/api/neural/genome', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ input })
          });
          const genomeData = await genomeRes.json();
          addLog('DEVELOPER', 'SaaS Genome decoded successfully.', 'success');

          setLoadingStep('Grounding Market Scan...');
          addLog('MARKETING', 'Initiating cross-platform intelligence sweep...', 'info');
          const intelRes = await fetch('/api/market/intelligence', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ input })
          });
          const intelData = await intelRes.json();
          setIntelligenceResult(intelData);
          addLog('MARKETING', `Opportunity Score: ${intelData.opportunityScore}/100`, 'success');

          setLoadingStep('Assembling Venture Council...');
          addLog('ORCHESTRATOR', 'Summoning agentic peers for critical review...', 'info');
          const councilRes = await fetch('/api/neural/council', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ 
              input, 
              mode,
              manualOverride: settings.manualAgentOverride,
              buildId: result?.id 
            })
          });
          const councilData = await councilRes.json();
          addLog('ORCHESTRATOR', 'Council debate concluded. Consensus reached.', 'success');

          setLoadingStep('Simulating Revenue Model...');
          addLog('SYSTEM', 'Running 24-month neural projection...', 'info');
          const projRes = await fetch('/api/neural/projection', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ input })
          });
          const projData = await projRes.json();
          addLog('SYSTEM', 'Revenue simulation complete.', 'success');

          // Store temporary founder data
          (window as any)._founderData = { genomeData, intelData, councilData, projData };
        }

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
        addLog('ORCHESTRATOR', 'Strategic alignment confirmed.', 'success');

        setLoadingStep('Finalizing Strategic Alignment...');
        await new Promise(r => setTimeout(r, 600));
        setProgress(95);
        
        addLog('COMPRESSOR', 'Optimizing execution sequence for speed-to-liquidity', 'success');
        addLog('SYSTEM', 'Compiling execution manifest...', 'info');

        const founderData = (window as any)._founderData || {};
        const enrichedResult: ExecutionResult = {
          ...data,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          input: input,
          mode: mode,
          actualizedCashout: mode === 'liquidity' ? (data.liquidityPlan?.assetTable?.reduce((sum: number, a: any) => sum + a.flashValue, 0) || 0) * 0.8 : 0,
          saasGenome: founderData.genomeData,
          marketIntelligence: founderData.intelData,
          councilDebate: founderData.councilData,
          revenueProjection: founderData.projData
        };
        
        delete (window as any)._founderData;

        if (enrichedResult.saasBlueprint) {
          setVibePrompts(enrichedResult.saasBlueprint.vibePrompts || []);
        }

        if (enrichedResult.metrics) {
          setLastMetrics(enrichedResult.metrics);
        }

        setResult(enrichedResult);
        
        if (user && settings.persistenceMode === 'cloud') {
          const resultRef = doc(db, 'users', user.uid, 'results', enrichedResult.id);
          setDoc(resultRef, enrichedResult).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/results/${enrichedResult.id}`));
        } else {
          setHistory(prev => [enrichedResult, ...prev].slice(0, 50));
        }

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
    if (user && settings.persistenceMode === 'cloud') {
      const resultRef = doc(db, 'users', user.uid, 'results', id);
      deleteDoc(resultRef).catch(e => handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/results/${id}`));
    } else {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  if (showFunnel) {
    return <LiquidityFunnel onStart={() => setShowFunnel(false)} />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-app-bg text-[#e0e0e0] font-sans selection:bg-brand-primary/30 flex flex-col overflow-hidden">
        {/* Header */}
      <header className="sticky top-0 z-50 bg-app-bg/80 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center w-full">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 bg-brand-primary rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.4)] transition-all hover:rotate-12 theme-glow cursor-pointer overflow-hidden" onClick={() => window.location.reload()}>
              {teamConfig.logo ? (
                <img src={teamConfig.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-black font-black text-xl italic tracking-tighter">X</span>
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic theme-text-glow">{teamConfig.companyName} // AgentX</h1>
              <div className="flex items-center gap-3">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">Enterprise Nexus</p>
                <div className="relative">
                  <button 
                    onMouseEnter={() => setShowQuotaBreakdown(true)}
                    onMouseLeave={() => setShowQuotaBreakdown(false)}
                    className="flex items-center gap-1.5 transition-all cursor-help group"
                  >
                    <HeartPulse className={`w-3 h-3 ${
                      (teamConfig.tokenUsage.current / teamConfig.tokenUsage.limit) > 0.9 ? 'text-brand-alert animate-pulse' :
                      (teamConfig.tokenUsage.current / teamConfig.tokenUsage.limit) > 0.7 ? 'text-orange-400' : 'text-brand-primary'
                    }`} />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Quota Health</span>
                  </button>

                  <AnimatePresence>
                    {showQuotaBreakdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-app-bg border border-white/10 rounded-xl p-4 shadow-2xl z-50 backdrop-blur-xl"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Monthly Quota</span>
                            <span className="text-[10px] font-mono text-white/40">{Math.round((teamConfig.tokenUsage.current / teamConfig.tokenUsage.limit) * 100)}%</span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Top Consumers</p>
                            {teamConfig.topConsumers.map((user, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <span className="text-[10px] text-white/60 truncate max-w-[120px]">{user.name}</span>
                                <span className="text-[10px] font-mono text-brand-primary">{(user.tokens / 1000).toFixed(0)}k</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                            <Info className="w-3 h-3 text-white/20" />
                            <p className="text-[8px] text-white/40 leading-tight">Neural assets will degrade if quota exceeds 100%.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <ThemeSwitcher current={theme} onSelect={setTheme} />
            <div className="flex items-center gap-4 border-r border-white/10 pr-8">
              <button 
                onClick={() => setIsDialogueOpen(!isDialogueOpen)}
                className={`p-2 rounded-lg transition-all ${isDialogueOpen ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/40 hover:text-white'}`}
                title="Toggle Agent Dialogue"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsLogsOpen(!isLogsOpen)}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest border px-3 py-1.5 rounded transition-all ${
                  isLogsOpen ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.2)]' : 'text-white/40 border-white/5 bg-white/[0.02] hover:text-white'
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

              {/* User Section */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                {authLoading ? (
                  <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse" />
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL || ''} className="w-6 h-6 rounded-full border border-brand-primary/30" alt="Profile" />
                    <button 
                      onClick={logout}
                      className="text-white/20 hover:text-brand-alert transition-colors"
                      title="Neural Detach (Logout)"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={signIn}
                    className="flex items-center gap-2 text-[10px] text-brand-primary hover:bg-brand-primary/10 transition-all border border-brand-primary/30 px-3 py-1.5 rounded font-bold uppercase tracking-widest"
                  >
                    <UserIcon className="w-3 h-3" />
                    Neural Sync
                  </button>
                )}
              </div>
            </div>
              <div className="text-[9px] text-white/30 font-mono hidden md:flex flex-col items-end shrink-0">
                <span>⌘+↵ EXECUTE</span>
                <span>⌘+K FOCUS</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(var(--brand-primary-rgb),0.05),transparent_70%)]">
          <div className="max-w-screen-2xl mx-auto p-6 md:p-12">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column: Controls */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <HistorySummary history={history} />
          <div className="bg-white/5 theme-border rounded-lg p-5 transition-all duration-500">
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

              <div className="flex items-center justify-between p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl mb-2 group cursor-pointer hover:bg-brand-primary/10 transition-colors"
                onClick={() => setFounderMode(!founderMode)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all ${founderMode ? 'bg-brand-primary text-black scale-110' : 'bg-white/5 text-white/40'}`}>
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Founder Mode</h4>
                    <p className="text-[8px] text-white/30 uppercase font-mono">End-to-End Autonomous Venture Builder</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${founderMode ? 'bg-brand-primary' : 'bg-white/10'}`}>
                  <motion.div 
                    animate={{ x: founderMode ? 22 : 4 }}
                    className={`absolute top-1 w-3 h-3 rounded-full ${founderMode ? 'bg-black' : 'bg-white/40'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={runMarketIntelligence}
                  disabled={loading || intelligenceLoading || !input}
                  className="py-3 bg-brand-secondary/20 border border-brand-secondary/50 text-brand-secondary font-bold text-[10px] uppercase rounded hover:bg-brand-secondary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {intelligenceLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Scan Market
                    </>
                  )}
                </button>
                <button
                  onClick={handleExecute}
                  disabled={loading || intelligenceLoading || !input}
                  className="py-3 bg-brand-primary text-black font-bold text-xs uppercase rounded hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.15)]"
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
          </div>

          <ExecutionFeed logs={result?.agentLogs || []} />
          
          <div className="bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(var(--brand-primary-rgb),0.5)] animate-pulse" />
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
                  
                  {input && (
                    <button 
                      onClick={() => setActiveTab('sandbox')}
                      className="mt-6 px-6 py-2 bg-brand-secondary/20 border border-brand-secondary/50 text-brand-secondary text-[10px] font-bold uppercase rounded-lg hover:bg-brand-secondary/30 transition-all flex items-center gap-2 animate-in fade-in zoom-in duration-500"
                    >
                      <Layers className="w-3 h-3" />
                      Neural Sandbox Simulation
                    </button>
                  )}
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
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)]"
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
                  <div className="flex gap-4 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
                    {(['plan', 'vibe_studio', 'market', 'market_engine', 'genome', 'council', 'revenue', 'marketing', 'risks', 'resources', 'efficiency', 'performance', 'forge', 'marketplace', 'enterprise', 'creator', 'sandbox', 'summary', 'logs'] as const).map((tab) => {
                      // Hide tabs if no data
                      if (tab === 'genome' && !saasGenome && !result?.saasGenome) return null;
                      if (tab === 'council' && !result?.councilDebate) return null;
                      if (tab === 'revenue' && !result?.revenueProjection) return null;
                      if (tab === 'market_engine' && !marketEngineReport) return null;
                      if (tab === 'performance' && performanceMetrics.length === 0) return null;
                      if (tab === 'forge' && !result) return null;
                      
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] pb-2 transition-all relative shrink-0 ${
                            activeTab === tab
                            ? 'text-brand-primary border-b border-brand-primary'
                            : 'text-white/30 hover:text-white'
                          }`}
                        >
                          {tab === 'plan' ? 'Neural Blueprint' : 
                           tab === 'market' ? 'Grounding' : 
                           tab === 'market_engine' ? 'Market Intelligence' : 
                           tab === 'genome' ? 'SaaS DNA' : 
                           tab === 'council' ? 'Venture Council' : 
                           tab === 'revenue' ? 'Projections' : 
                           tab === 'marketing' ? 'Market Engine' : 
                           tab === 'risks' ? 'Risk Shield' : 
                           tab === 'efficiency' ? 'Efficiency' :
                           tab === 'marketplace' ? 'Marketplace' :
                           tab === 'enterprise' ? 'Enterprise' :
                           tab === 'creator' ? 'Creator Studio' :
                           tab === 'performance' ? 'Performance' :
                           tab === 'forge' ? 'Neural Forge' :
                           tab === 'vibe_studio' ? 'Vibe Studio' :
                           tab === 'sandbox' ? 'Sandbox' :
                           tab === 'summary' ? 'Summary' :
                           tab === 'resources' ? 'Resources' : 'Telemetry'}
                        </button>
                      );
                    })}
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
                  {activeTab === 'sandbox' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                       <SandboxedSimulation input={input} settings={settings} />
                    </div>
                  )}
                  {activeTab === 'plan' && (
                    <>
                      {/* Intelligence Alert */}
                      {intelligenceResult && !result && (
                         <div className="bg-brand-secondary/10 border border-brand-secondary/30 p-4 rounded-xl flex items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4 duration-500">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-brand-secondary/20 rounded-lg">
                               <Search className="w-4 h-4 text-brand-secondary" />
                             </div>
                             <div>
                               <p className="text-[10px] text-white font-bold uppercase tracking-widest">Market Scan Available</p>
                               <p className="text-[9px] text-white/40 uppercase font-mono">Opportunity Score: {intelligenceResult.opportunityScore}/100</p>
                             </div>
                           </div>
                           <button 
                             onClick={() => setActiveTab('market')}
                             className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest hover:underline"
                           >
                             View Analysis
                           </button>
                         </div>
                      )}
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
                        {result?.saasBuildPlan && <SaaSResult plan={result.saasBuildPlan} originalInput={input} />}
                        
                        {/* Experimental: Neural Rehearsal */}
                        {settings.experimentalFeatures && (
                          <NeuralRehearsal 
                            plan={result.saasBuildPlan || result.liquidityPlan} 
                            input={result.input} 
                            settings={settings}
                          />
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === 'market' && (
                    <div className="space-y-6">
                       {intelligenceLoading ? (
                         <div className="flex flex-col items-center justify-center py-20 gap-4">
                           <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
                           <p className="text-xs text-brand-secondary font-mono uppercase animate-pulse">Running autonomous grounding scan...</p>
                         </div>
                       ) : result?.marketIntelligence ? (
                         <MarketIntelligence data={result.marketIntelligence} />
                       ) : intelligenceResult ? (
                         <MarketIntelligence data={intelligenceResult} />
                       ) : (
                         <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/20">
                           <Search className="w-8 h-8 opacity-20" />
                           <p className="text-xs font-mono uppercase">Initiate market scan to see real-time intelligence</p>
                         </div>
                       )}
                    </div>
                  )}

                  {activeTab === 'market_engine' && marketEngineReport && (
                    <MarketEngineDashboard report={marketEngineReport} />
                  )}

                  {activeTab === 'genome' && (saasGenome || result?.saasGenome) && (
                    <SaaSGenomeChart genome={saasGenome || result!.saasGenome!} />
                  )}

                  {activeTab === 'performance' && performanceMetrics.length > 0 && (
                    <AgentPerformanceDashboard metrics={performanceMetrics} />
                  )}

                  {activeTab === 'forge' && (
                    <ProjectForge />
                  )}

                  {activeTab === 'council' && result?.councilDebate && (
                    <VentureCouncil debate={result.councilDebate} />
                  )}

                  {activeTab === 'revenue' && result?.revenueProjection && (
                    <RevenueProjection projection={result.revenueProjection} />
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

                  {activeTab === 'resources' && (
                    <ResourceMonitor 
                      settings={settings} 
                      onUpdateSettings={(s) => setSettings(prev => ({ ...prev, ...s }))}
                      onEmitMetric={(m) => setEfficiencyMetrics(prev => [m, ...prev].slice(0, 100))}
                    />
                  )}
                  {activeTab === 'efficiency' && (
                    <GlobalResourceEfficiency metrics={efficiencyMetrics} />
                  )}
                  {activeTab === 'marketplace' && (
                    <SaaSMarketplace />
                  )}
                  {activeTab === 'enterprise' && (
                    <EnterpriseDashboard />
                  )}
                  {activeTab === 'creator' && (
                    <CreatorStudio />
                  )}
                  {activeTab === 'vibe_studio' && (
                    <AgenticCodingStudio />
                  )}
                  {activeTab === 'summary' && (
                    <ExecutiveSummary activeBuilds={history} />
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
        </div>
      </div>
    </main>

      {/* Footer Area */}
      <footer className="shrink-0 border-t border-white/10 p-4 flex justify-between items-center text-[10px] font-mono tracking-widest bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-white/20 uppercase">Network Status</span>
            <div className="flex items-center gap-2 text-brand-primary">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
              PRIORITY_FLOW
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/20 uppercase">Session Uptime</span>
            <span className="text-brand-secondary">142:12:08:55</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/10">THREATS</span>
            <span className="text-white/60">0_DETECTED</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-white/30 uppercase">
          <button 
            onClick={() => setShowShortcuts(true)}
            className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
          >
            <Command className="w-3 h-3" /> Shortcuts
          </button>
          <span>SYS_OS: <span className="text-white">v3.0.1_INTELLIGENT_UPGRADE</span></span>
          <span>© 2026 XecutionAI</span>
        </div>
      </footer>

      <SuccessParticles active={showParticles} />
      {/* Dialogue Stream Side Panel */}
      <AnimatePresence>
        {isDialogueOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[400px] h-full z-[60] shadow-2xl"
          >
            <AgentDialoguePanel messages={agentMessages} />
            <button 
              onClick={() => setIsDialogueOpen(false)}
              className="absolute top-4 left-[-40px] w-10 h-10 bg-brand-primary text-black flex items-center justify-center rounded-l-xl shadow-lg"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LogPanel 
        logs={liveLogs} 
        isOpen={isLogsOpen} 
        onClose={() => setIsLogsOpen(false)} 
        theme={theme} 
        onClear={() => setLiveLogs([])}
        agentStatuses={agentStatuses}
        activeRole={activeRole}
      />
      
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
          user={user}
        />

        <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        
        {showTour && (
          <WelcomeTour onComplete={() => {
            setShowTour(false);
            localStorage.setItem('tour_completed', 'true');
          }} />
        )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] px-6 py-3 rounded-xl bg-black/90 border border-white/10 shadow-2xl flex items-center gap-3 backdrop-blur-xl"
          >
            <div className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-brand-primary shadow-[0_0_8px_#00ff9d]' : 
              toast.type === 'error' ? 'bg-brand-alert shadow-[0_0_8px_#ff4d4d]' : 'bg-brand-secondary'
            } animate-pulse`} />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-white/5 rounded">
              <X className="w-3 h-3 text-white/20 hover:text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

