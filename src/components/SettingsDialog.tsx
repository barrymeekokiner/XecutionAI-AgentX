import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Key, 
  Cpu, 
  ShieldCheck, 
  RefreshCcw, 
  Database,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  Palette,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StripeCheckout } from './StripeCheckout';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings;
  lastMetrics?: {
    estimatedTokens: number;
    latencyMs: number;
  };
}

export interface AppSettings {
  apiKey: string;
  model: string;
  autoRefine: boolean;
  persistenceMode: 'local' | 'cloud';
  tier: 'free' | 'standard' | 'premium';
  customSystemInstruction?: string;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings,
  lastMetrics
}) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  const [showKey, setShowKey] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showStripe, setShowStripe] = useState<{tier: 'standard' | 'premium'} | null>(null);

  const usageData = [
    { name: 'Day 1', tokens: 4500 },
    { name: 'Day 2', tokens: 12000 },
    { name: 'Day 3', tokens: 8000 },
    { name: 'Day 4', tokens: 15000 },
    { name: 'Day 5', tokens: 3000 },
    { name: 'Day 6', tokens: 18000 },
    { name: 'Day 7', tokens: lastMetrics?.estimatedTokens || 10000 },
  ];

  const limits = {
    free: 50000,
    standard: 500000,
    premium: 5000000
  };

  const totalUsage = usageData.reduce((acc, curr) => acc + curr.tokens, 0);
  const currentLimit = limits[settings.tier];
  const usagePercent = Math.min((totalUsage / currentLimit) * 100, 100);

  useEffect(() => {
    setSettings(currentSettings);
    setVerifyStatus('idle');
    setVerifyError(null);
  }, [currentSettings, isOpen]);

  const models = [
    { id: 'gemini-3.5-flash-preview', label: 'Gemini 3.5 Flash (Preview)', tier: 'PREMIUM', speed: 'Quantum', intelligence: 'Elite' },
    { id: 'gemini-3.1-flash', label: 'Gemini 3.1 Flash', tier: 'STANDARD', speed: 'Ultra', intelligence: 'High' },
    { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', tier: 'FREE', speed: 'Instant', intelligence: 'Standard' },
  ];

  const handleUpgrade = (tier: 'standard' | 'premium') => {
    setShowStripe({ tier });
  };

  const handleTestKey = async () => {
    setVerifyStatus('loading');
    setVerifyError(null);
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': settings.apiKey,
          'x-gemini-model': settings.model
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setVerifyStatus('success');
      } else {
        setVerifyStatus('error');
        setVerifyError(data.error || "Verification failed");
      }
    } catch (e: any) {
      setVerifyStatus('error');
      setVerifyError(e.message);
    }
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-app-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight uppercase italic">Core Neural Configuration</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Kernel v3.0.1 // X-AGENTX</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Usage & Billing Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 text-brand-primary" />
                  Usage & Resource Economics
                </label>
                <div className="bg-black border border-white/10 rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Weekly Consumption</p>
                      <p className="text-lg font-bold text-white font-mono">{totalUsage.toLocaleString()} <span className="text-xs text-white/40">Tokens</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Plan Limit</p>
                      <p className="text-sm font-bold text-white/60 font-mono">{currentLimit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData}>
                        <Bar dataKey="tokens" radius={[4, 4, 0, 0]}>
                          {usageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 6 ? '#00ff9d' : '#ffffff20'} />
                          ))}
                        </Bar>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter">
                      <span className="text-white/40">Quota Integrity</span>
                      <span className={usagePercent > 90 ? 'text-brand-alert' : 'text-brand-primary'}>{usagePercent.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${usagePercent}%` }}
                        className={`h-full shadow-[0_0_10px_currentColor] ${usagePercent > 90 ? 'bg-brand-alert' : 'bg-brand-primary'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <Key className="w-3 h-3 text-brand-secondary" />
                    Neural Gateway Key
                  </label>
                  <div className="flex items-center gap-2">
                    {verifyStatus === 'success' && (
                      <span className="text-[9px] text-brand-primary flex items-center gap-1 uppercase font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Validated
                      </span>
                    )}
                    {verifyStatus === 'error' && (
                      <span className="text-[9px] text-brand-alert flex items-center gap-1 uppercase font-bold">
                        <XCircle className="w-3 h-3" /> Blocked
                      </span>
                    )}
                    <span className="text-[10px] text-brand-secondary uppercase font-mono px-2 py-0.5 bg-brand-secondary/10 border border-brand-secondary/20 rounded">
                      Optional
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type={showKey ? "text" : "password"}
                      value={settings.apiKey}
                      onChange={(e) => {
                        setSettings({ ...settings, apiKey: e.target.value });
                        setVerifyStatus('idle');
                      }}
                      placeholder="Enter Gemini API key..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-all font-mono text-white/80 placeholder:text-white/10"
                    />
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-white/20 hover:text-brand-primary transition-colors"
                    >
                      {showKey ? "Hide" : "Show"}
                    </button>
                  </div>
                  <button 
                    onClick={handleTestKey}
                    disabled={verifyStatus === 'loading' || !settings.apiKey}
                    className="px-4 py-3 rounded-xl border border-white/10 hover:border-brand-secondary text-[10px] uppercase font-bold text-white/40 hover:text-brand-secondary transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {verifyStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                    Test
                  </button>
                </div>
                {verifyError && (
                  <p className="text-[9px] text-brand-alert bg-brand-alert/5 p-2 border border-brand-alert/10 rounded-lg font-mono uppercase tracking-tighter">
                    {verifyError}
                  </p>
                )}
              </div>

              {/* Model Selection Dropdown */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-brand-primary" />
                  Neural Model Tier
                </label>
                <div className="relative">
                  <select 
                    value={settings.model}
                    onChange={(e) => {
                      const m = models.find(x => x.id === e.target.value);
                      if (m && m.tier === 'PREMIUM' && settings.tier === 'free') {
                        // Trigger paywall or warning
                        return;
                      }
                      setSettings({ ...settings, model: e.target.value });
                      setVerifyStatus('idle');
                    }}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white/80 appearance-none cursor-pointer"
                  >
                    {models.map(m => {
                      const isLocked = (m.tier === 'PREMIUM' || m.tier === 'STANDARD') && settings.tier === 'free';
                      return (
                        <option key={m.id} value={m.id} className="bg-app-bg text-white" disabled={isLocked}>
                          {m.label} {isLocked ? ' (LOCKED)' : `(${m.tier})`}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                </div>
                
                {/* Active Model Preview */}
                <div className="grid grid-cols-2 gap-3">
                  {models.filter(m => m.id === settings.model).map(m => (
                    <React.Fragment key={m.id}>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-white/20 uppercase tracking-tighter block mb-1">Latency</span>
                        <span className="text-xs text-white font-mono">{m.speed}</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-white/20 uppercase tracking-tighter block mb-1">Logic Depth</span>
                        <span className="text-xs text-white font-mono">{m.intelligence}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Neural Usage Monitor */}
              {lastMetrics && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3 text-brand-secondary" />
                    Resource Consumption
                  </label>
                  <div className="bg-black border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-mono">
                        <span className="text-white/40">Tokens (Last Request)</span>
                        <span className="text-brand-primary font-bold">{lastMetrics.estimatedTokens.toLocaleString()} tk</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((lastMetrics.estimatedTokens / 20000) * 100, 100)}%` }}
                          className="h-full bg-brand-primary shadow-[0_0_10px_#00ff9d]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-mono">
                      <span className="text-white/40">Neural Latency</span>
                      <span className="text-white">{(lastMetrics.latencyMs / 1000).toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom AI Persona */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <Palette className="w-3 h-3 text-brand-primary" />
                  Custom AI Persona Override
                </label>
                <div className="space-y-2">
                  <textarea 
                    value={settings.customSystemInstruction || ''}
                    onChange={(e) => setSettings({ ...settings, customSystemInstruction: e.target.value })}
                    placeholder="E.g. You are a minimalist SaaS architect focused on zero-dependency code..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-all font-mono text-white/80 placeholder:text-white/10 h-24 resize-none"
                  />
                  <p className="text-[9px] text-white/20 uppercase tracking-tight leading-relaxed">
                    This instruction "dresses" the Master Orchestrator. It overrides default personality traits with your specific preferences.
                  </p>
                </div>
              </div>


              {/* Neural Marketplace / Upgrades */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-brand-primary" />
                  Subscription & Upgrades
                </label>
                <div className="grid gap-4">
                  <div className={`p-4 rounded-xl border transition-all ${settings.tier === 'premium' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          XecutionAI AgentX Premium
                          {settings.tier === 'premium' && <span className="text-[8px] bg-brand-primary text-black px-1.5 py-0.5 rounded uppercase">Active</span>}
                        </h3>
                        <p className="text-[10px] text-white/40 uppercase font-mono mt-1">Full access to 3.5 & Pro clusters</p>
                      </div>
                      <span className="text-lg font-bold text-white">$29<span className="text-[10px] text-white/40">/mo</span></span>
                    </div>
                    {settings.tier !== 'premium' && (
                      <button 
                        onClick={() => handleUpgrade('premium')}
                        disabled={upgradeLoading}
                        className="w-full py-2 rounded-lg bg-brand-primary text-black text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                        {upgradeLoading ? 'Processing...' : 'Upgrade to Premium'}
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-white">Execution Priority Pass</span>
                      <p className="text-[10px] text-white/40 uppercase font-mono">Reduce latency by 40% (Alacarte)</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-white/60 uppercase hover:text-brand-primary hover:border-brand-primary transition-all">
                      $5.00
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw className="w-3 h-3 text-orange-400" />
                  Execution Parameters
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-white">Autonomous Refinement</span>
                      <p className="text-[10px] text-white/40 uppercase font-mono">Auto-correct prompts via secondary LLM pass</p>
                    </div>
                    <button 
                      onClick={() => setSettings({ ...settings, autoRefine: !settings.autoRefine })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoRefine ? 'bg-brand-primary' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoRefine ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${verifyStatus === 'success' ? 'bg-brand-primary shadow-[0_0_8px_#00ff9d]' : verifyStatus === 'error' ? 'bg-brand-alert shadow-[0_0_8px_#ff4d4d]' : 'bg-white/20 animate-pulse'}`} />
                  <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">System Status:</span>
                </div>
                <span className={`text-[10px] font-mono uppercase ${verifyStatus === 'success' ? 'text-brand-primary' : verifyStatus === 'error' ? 'text-brand-alert' : 'text-white/20'}`}>
                  {verifyStatus === 'success' ? 'Synchronized' : verifyStatus === 'error' ? 'Degraded' : 'Awaiting Link'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/5 bg-white/5 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] px-4 py-3 rounded-xl bg-brand-primary text-black font-extrabold uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Apply Changes
              </button>
            </div>

            {/* Stripe Overlay */}
            <AnimatePresence>
              {showStripe && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                >
                  <StripeCheckout 
                    tier={showStripe.tier} 
                    onCancel={() => setShowStripe(null)}
                    onSuccess={(newTier) => {
                      setSettings(prev => ({ ...prev, tier: newTier as any }));
                      setShowStripe(null);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
