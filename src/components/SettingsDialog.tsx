import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings as SettingsIcon, 
  Key, 
  Cpu, 
  ShieldCheck, 
  RefreshCcw, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  CreditCard,
  TrendingUp,
  RefreshCw,
  Info,
  Palette,
  ChevronDown,
  Cloud,
  Database,
  AlertCircle
} from 'lucide-react';
import { AppSettings, ExecutionResult } from '../types';
import { User } from '../lib/firebase';
import { StripeCheckout } from './StripeCheckout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings;
  lastMetrics?: ExecutionResult['metrics'];
  user: User | null;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings,
  lastMetrics,
  user
}) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'analytics'>('general');
  const [showKey, setShowKey] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showStripe, setShowStripe] = useState<{tier: 'standard' | 'premium'} | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(currentSettings);
    }
  }, [isOpen, currentSettings]);

  const models = [
    { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', tier: 'FREE', speed: 'Ultra-Fast', intelligence: 'Standard' },
    { id: 'gemini-3.1-flash', label: 'Gemini 3.1 Flash', tier: 'STANDARD', speed: 'Fast', intelligence: 'High' },
    { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro', tier: 'PREMIUM', speed: 'Balanced', intelligence: 'Extreme' }
  ];

  const handleTestKey = async () => {
    if (!settings.apiKey) return;
    setVerifyStatus('loading');
    setVerifyError(null);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': settings.apiKey
        }
      });
      if (res.ok) {
        setVerifyStatus('success');
      } else {
        const err = await res.json();
        setVerifyStatus('error');
        setVerifyError(err.error || 'Validation failed');
      }
    } catch (e) {
      setVerifyStatus('error');
      setVerifyError('Network error');
    }
  };

  const handleUpgrade = (tier: 'standard' | 'premium') => {
    setShowStripe({ tier });
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/stripe/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Failed to fetch analytics', e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics' && isOpen) {
      fetchAnalytics();
    }
  }, [activeTab, isOpen]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  // Mock usage data
  const usageData = [
    { day: 'Mon', tokens: 4500 },
    { day: 'Tue', tokens: 12000 },
    { day: 'Wed', tokens: 8000 },
    { day: 'Thu', tokens: 15000 },
    { day: 'Fri', tokens: 3000 },
    { day: 'Sat', tokens: 18000 },
    { day: 'Sun', tokens: lastMetrics?.estimatedTokens || 10000 }
  ];

  const totalUsage = usageData.reduce((a, b) => a + b.tokens, 0);
  const limits = { free: 50000, standard: 500000, premium: 5000000 };
  const currentLimit = limits[settings.tier] || limits.free;
  const usagePercent = (totalUsage / currentLimit) * 100;
  const isUsageWarning = usagePercent > 80;

  const formatMetric = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  const calculatePercent = (val: number, max: number) => Math.min((val / max) * 100, 100);

  const safeMetrics = {
    estimatedTokens: lastMetrics?.estimatedTokens || 0,
    latencyMs: lastMetrics?.latencyMs || 0
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-app-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${isUsageWarning ? 'bg-brand-alert/10' : 'bg-brand-primary/10'}`}>
                  <SettingsIcon className={`w-5 h-5 transition-colors ${isUsageWarning ? 'text-brand-alert' : 'text-brand-primary'}`} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight uppercase italic">Core Neural Configuration</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Kernel v3.0.1 // X-AGENTX</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex px-6 border-b border-white/5 bg-black/20">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all relative ${activeTab === 'general' ? 'text-brand-primary' : 'text-white/40 hover:text-white/60'}`}
              >
                General
                {activeTab === 'general' && <motion.div layoutId="settingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all relative ${activeTab === 'analytics' ? 'text-brand-secondary' : 'text-white/40 hover:text-white/60'}`}
              >
                Analytics
                {activeTab === 'analytics' && <motion.div layoutId="settingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-secondary" />}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {activeTab === 'general' ? (
                <div className="space-y-8">
                  {/* Usage Section */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 className={`w-3 h-3 transition-colors ${isUsageWarning ? 'text-brand-alert' : 'text-brand-primary'}`} />
                      Usage & Resource Economics
                    </label>
                    <div className={`bg-black border rounded-2xl p-6 space-y-6 transition-colors ${isUsageWarning ? 'border-brand-alert/30 shadow-[0_0_20px_rgba(240,98,146,0.05)]' : 'border-white/10'}`}>
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Weekly Consumption</p>
                          <p className="text-lg font-bold text-white font-mono">{formatMetric(totalUsage)} <span className="text-xs text-white/40">Tokens</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Plan Limit</p>
                          <p className="text-sm font-bold text-white/60 font-mono">{formatMetric(currentLimit)}</p>
                        </div>
                      </div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={usageData}>
                            <Bar dataKey="tokens" radius={[4, 4, 0, 0]}>
                              {usageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 6 ? (isUsageWarning ? '#f06292' : '#00ff9d') : '#ffffff20'} />
                              ))}
                            </Bar>
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter">
                          <span className="text-white/40">Quota Integrity</span>
                          <span className={isUsageWarning ? 'text-brand-alert' : 'text-brand-primary'}>{usagePercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${usagePercent}%` }} className={`h-full shadow-[0_0_10px_currentColor] transition-colors duration-500 ${isUsageWarning ? 'bg-brand-alert' : 'bg-brand-primary'}`} />
                        </div>
                        {isUsageWarning && <p className="text-[8px] text-brand-alert uppercase font-bold animate-pulse">Critical: Neural quota nearing exhaustion</p>}
                      </div>
                    </div>
                  </div>

                  {/* API Key Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Key className="w-3 h-3 text-brand-secondary" /> Neural Gateway Key</label>
                      <div className="flex items-center gap-2">
                        {verifyStatus === 'success' && <span className="text-[9px] text-brand-primary flex items-center gap-1 uppercase font-bold"><CheckCircle2 className="w-3 h-3" /> Validated</span>}
                        {verifyStatus === 'error' && <span className="text-[9px] text-brand-alert flex items-center gap-1 uppercase font-bold"><XCircle className="w-3 h-3" /> Blocked</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type={showKey ? "text" : "password"} value={settings.apiKey} onChange={(e) => { setSettings({ ...settings, apiKey: e.target.value }); setVerifyStatus('idle'); }} placeholder="Enter Gemini API key..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-all font-mono text-white/80 placeholder:text-white/10" />
                        <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-white/20 hover:text-brand-primary transition-colors">{showKey ? "Hide" : "Show"}</button>
                      </div>
                      <button onClick={handleTestKey} disabled={verifyStatus === 'loading' || !settings.apiKey} className="px-4 py-3 rounded-xl border border-white/10 hover:border-brand-secondary text-[10px] uppercase font-bold text-white/40 hover:text-brand-secondary transition-all flex items-center gap-2">
                        {verifyStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />} Test
                      </button>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Cpu className="w-3 h-3 text-brand-primary" /> Neural Model Tier</label>
                    <div className="relative">
                      <select value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 appearance-none cursor-pointer">
                        {models.map(m => (
                          <option key={m.id} value={m.id} className="bg-app-bg text-white" disabled={(m.tier === 'PREMIUM' || m.tier === 'STANDARD') && settings.tier === 'free'}>
                            {m.label} {(m.tier === 'PREMIUM' || m.tier === 'STANDARD') && settings.tier === 'free' ? ' (LOCKED)' : `(${m.tier})`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>

                  {/* Persistence Architecture */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-3 h-3 text-brand-secondary" /> 
                      Data Persistence Architecture
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSettings({ ...settings, persistenceMode: 'local' })}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                          settings.persistenceMode === 'local' 
                            ? 'bg-white/10 border-white/30 text-white' 
                            : 'bg-black/40 border-white/5 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <Database className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Local Session</span>
                      </button>
                      <button
                        disabled={!user}
                        onClick={() => setSettings({ ...settings, persistenceMode: 'cloud' })}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all relative ${
                          settings.persistenceMode === 'cloud' 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                            : 'bg-black/40 border-white/5 text-white/40 hover:border-white/20'
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {!user && <div className="absolute top-2 right-2"><AlertCircle className="w-3 h-3 text-brand-alert" /></div>}
                        <Cloud className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Neural Cloud</span>
                      </button>
                    </div>
                    {!user && settings.persistenceMode === 'local' && (
                      <p className="text-[8px] text-white/20 uppercase tracking-widest text-center">Neural Sync required for cloud storage.</p>
                    )}
                  </div>

                  {/* Persona Override */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Palette className="w-3 h-3 text-brand-primary" /> Custom AI Persona Override</label>
                    <textarea value={settings.customSystemInstruction || ''} onChange={(e) => setSettings({ ...settings, customSystemInstruction: e.target.value })} placeholder="E.g. You are a minimalist SaaS architect..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white/80 h-24 resize-none" />
                  </div>

                  {/* Subscription Section */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-brand-primary" /> Subscription & Upgrades</label>
                    <div className={`p-4 rounded-xl border transition-all ${settings.tier === 'premium' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white/5 border-white/5'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-white">XecutionAI AgentX Premium {settings.tier === 'premium' && <span className="text-[8px] bg-brand-primary text-black px-1.5 py-0.5 rounded uppercase">Active</span>}</h3>
                          <p className="text-[10px] text-white/40 uppercase font-mono mt-1">Full access to 3.5 & Pro clusters</p>
                        </div>
                        <span className="text-lg font-bold text-white">$29<span className="text-[10px] text-white/40">/mo</span></span>
                      </div>
                      {settings.tier !== 'premium' && (
                        <button onClick={() => handleUpgrade('premium')} className="w-full py-2 rounded-lg bg-brand-primary text-black text-[10px] font-bold uppercase tracking-widest transition-all">Upgrade to Premium</button>
                      )}
                    </div>
                  </div>

                  {/* Status */}
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
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black border border-white/10 rounded-2xl p-4 space-y-1">
                      <p className="text-[8px] text-white/20 uppercase tracking-widest">Monthly Recurring Revenue</p>
                      {analyticsLoading ? <div className="h-6 w-20 bg-white/5 animate-pulse rounded" /> : <p className="text-xl font-bold text-brand-secondary font-mono">${analytics?.mrr?.toLocaleString()}</p>}
                    </div>
                    <div className="bg-black border border-white/10 rounded-2xl p-4 space-y-1">
                      <p className="text-[8px] text-white/20 uppercase tracking-widest">Active Customer Base</p>
                      {analyticsLoading ? <div className="h-6 w-20 bg-white/5 animate-pulse rounded" /> : <p className="text-xl font-bold text-white font-mono">{analytics?.activeCustomers}</p>}
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><CreditCard className="w-3 h-3 text-brand-secondary" /> Upcoming Payment Cycles</label>
                      <button onClick={fetchAnalytics} className="p-1 hover:bg-white/5 rounded transition-colors"><RefreshCw className={`w-3 h-3 text-white/20 ${analyticsLoading ? 'animate-spin' : ''}`} /></button>
                    </div>
                    <div className="space-y-3">
                      {analytics?.upcomingPayments?.map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                          <div>
                            <p className="text-[10px] font-bold text-white uppercase">{payment.customer}</p>
                            <p className="text-[8px] text-white/20 font-mono italic">{payment.date}</p>
                          </div>
                          <p className="text-xs font-bold text-brand-primary font-mono">+${payment.amount.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/5 bg-white/5 flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-[2] px-4 py-3 rounded-xl bg-brand-primary text-black font-extrabold uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] transition-all">Apply Changes</button>
            </div>

            {/* Stripe Overlay */}
            <AnimatePresence>
              {showStripe && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
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
