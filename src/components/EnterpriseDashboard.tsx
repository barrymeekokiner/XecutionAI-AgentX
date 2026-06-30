import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Plus, 
  Mail, 
  Trash2, 
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronDown,
  Building2,
  Key,
  Globe,
  Palette,
  Eye,
  PieChart,
  HardDrive,
  ArrowRight,
  Zap,
  Cpu,
  AlertTriangle,
  CreditCard,
  UserPlus,
  ArrowUpCircle,
  ArrowDownCircle,
  Layout,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Edit3,
  X as CloseIcon
} from 'lucide-react';
import { Team, UsageQuota, TeamMember, AuditLog } from '../types';
import { TeamCapacityOverview } from './TeamCapacityOverview';

export const EnterpriseDashboard: React.FC = () => {
  // Mock Team Data
  const [team, setTeam] = useState<Team>({
    id: 't1',
    name: 'Neural Dynamics Corp',
    ownerId: 'u1',
    memberUids: ['u1', 'u2', 'u3'],
    members: [
      { uid: 'u1', email: 'owner@neural.io', role: 'owner', joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000 },
      { uid: 'u2', email: 'architect@neural.io', role: 'admin', joinedAt: Date.now() - 15 * 24 * 60 * 60 * 1000 },
      { uid: 'u3', email: 'analyst@neural.io', role: 'editor', joinedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 }
    ],
    billingTier: 'enterprise',
    billingDetails: {
      interval: 'month',
      seats: 5,
      status: 'active',
      nextBillingDate: Date.now() + 15 * 24 * 60 * 60 * 1000
    },
    whiteLabelConfig: {
      primaryColor: '#00ff9d',
      domain: 'agents.neural.io',
      companyName: 'Neural Dynamics'
    },
    usageHistory: [
      { month: 'May', executions: 850, tokens: 450000, cost: 1250 },
      { month: 'June', executions: 1200, tokens: 680000, cost: 1890 }
    ]
  });

  const [activeTab, setActiveTab] = useState<'team' | 'usage' | 'settings' | 'subscription'>('team');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'usage' || activeTab === 'team') {
      fetch(`/api/teams/${team.id}/audit-logs`)
        .then(res => res.json())
        .then(data => setAuditLogs(data))
        .catch(err => console.error("Audit log fetch failed:", err));
    }
  }, [activeTab, team.id]);

  const [previewConfig, setPreviewConfig] = useState(team.whiteLabelConfig || {
    primaryColor: '#00ff9d',
    domain: 'agents.neural.io',
    companyName: 'Neural Dynamics'
  });

  // Mock Usage Data
  const usage: UsageQuota = {
    executions: { current: 450, limit: 1000 },
    storage: { current: 12.5, limit: 50 },
    apiCalls: { current: 8500, limit: 25000 },
    tokens: { current: 820000, limit: 1000000 }, // Close to limit for alert
    projectedCost: 2450.00
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(0, 255, 157); // Brand Primary
    doc.setFontSize(22);
    doc.text('Neural Enterprise Report', 20, 30);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Organization: ${team.whiteLabelConfig?.companyName || team.name}`, 20, 40);
    doc.text(`Report Generated: ${timestamp}`, 20, 45);
    
    doc.setFontSize(14);
    doc.text('Resource Utilization', 20, 60);
    doc.setFontSize(10);
    doc.text(`- Executions: ${usage.executions.current} / ${usage.executions.limit}`, 25, 70);
    doc.text(`- Token Consumption: ${usage.tokens.current.toLocaleString()} / ${usage.tokens.limit.toLocaleString()}`, 25, 75);
    doc.text(`- API Interactions: ${usage.apiCalls.current.toLocaleString()} / ${usage.apiCalls.limit.toLocaleString()}`, 25, 80);
    
    doc.setFontSize(14);
    doc.text('Cost Metrics', 20, 95);
    doc.setFontSize(10);
    doc.text(`- Projected Monthly Cost: $${usage.projectedCost.toLocaleString()}`, 25, 105);
    doc.text(`- Active Plan: ${team.billingTier.toUpperCase()}`, 25, 110);
    
    doc.setFontSize(14);
    doc.text('Team Activity Log', 20, 125);
    doc.setFontSize(8);
    team.members.forEach((m, i) => {
      doc.text(`${m.email} - Role: ${m.role} - Joined: ${new Date(m.joinedAt).toLocaleDateString()}`, 25, 135 + (i * 5));
    });

    doc.save(`${team.name.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);

    // Dispatch notification
    fetch('/api/teams/report/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: team.id })
    }).catch(err => console.error('Dispatch failed:', err));
  };

  const handleOpenStripePortal = async () => {
    setIsPortalLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: 'cus_mock_enterprise_123' }) // In real app, from team.stripeCustomerId
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error("Portal redirection failed:", err);
    } finally {
      setIsPortalLoading(false);
      setIsBillingModalOpen(false);
    }
  };
  const handleUpdateRole = async (uid: string, newRole: TeamMember['role']) => {
    try {
      const response = await fetch('/api/teams/members/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id, memberUid: uid, newRole })
      });
      if (response.ok) {
        setTeam(prev => ({
          ...prev,
          members: prev.members.map(m => m.uid === uid ? { ...m, role: newRole } : m)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Usage alert state
  const tokenUsagePercent = (usage.tokens.current / usage.tokens.limit) * 100;
  const showUsageAlert = tokenUsagePercent > 80;

  useEffect(() => {
    if (team.whiteLabelConfig?.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', team.whiteLabelConfig.primaryColor);
    }
  }, [team.whiteLabelConfig?.primaryColor]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Real-time Usage Tracker Header */}
      {showUsageAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-alert/10 border border-brand-alert/20 p-4 rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-alert/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-brand-alert" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Neural Quota Warning</h4>
              <p className="text-xs text-white/40 font-mono uppercase">You have consumed {tokenUsagePercent.toFixed(1)}% of your monthly token limit.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden hidden md:block">
                <div className="h-full bg-brand-alert" style={{ width: `${tokenUsagePercent}%` }} />
             </div>
             <button 
               onClick={() => setActiveTab('subscription')}
               className="bg-brand-alert text-black px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
             >
               Expand Quota
             </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-brand-primary/10">
             {team.whiteLabelConfig?.logo ? (
               <img src={team.whiteLabelConfig.logo} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               <Building2 className="w-8 h-8 text-white relative z-10" />
             )}
             <div className="absolute inset-0 bg-brand-primary/5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white tracking-tighter">{team.whiteLabelConfig?.companyName || team.name}</h1>
              <span className="px-2 py-0.5 bg-brand-primary text-black text-[8px] font-bold rounded uppercase">Enterprise</span>
            </div>
            <p className="text-white/40 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
              Neural Registry: {team.id}
              <CheckCircle2 className="w-3 h-3 text-brand-primary" />
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleDownloadReport}
            className="bg-white/5 hover:bg-brand-primary/10 border border-white/10 hover:border-brand-primary/30 text-white hover:text-brand-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all group"
          >
            <PieChart className="w-4 h-4" />
            Download Report
          </button>
          <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            <Settings className="w-4 h-4" />
            Org Control
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'team', label: 'Team', icon: Users },
          { id: 'usage', label: 'Usage Metering', icon: BarChart3 },
          { id: 'subscription', label: 'Billing & Plans', icon: CreditCard },
          { id: 'settings', label: 'Brand Identity', icon: Palette }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-white border-brand-primary' 
                : 'text-white/20 border-transparent hover:text-white/40'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'team' && (
              <motion.div 
                key="team"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                {/* Capacity Visualization */}
                <TeamCapacityOverview 
                  data={[
                    { role: 'Admins', count: 2, color: '#00ff9d' },
                    { role: 'Editors', count: 5, color: '#a855f7' },
                    { role: 'Viewers', count: 3, color: '#3b82f6' }
                  ]}
                  growth={[
                    { month: 'Jan', seats: 2 },
                    { month: 'Feb', seats: 3 },
                    { month: 'Mar', seats: 3 },
                    { month: 'Apr', seats: 5 },
                    { month: 'May', seats: 8 },
                    { month: 'Jun', seats: 10 }
                  ]}
                />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white tracking-tight">Permissions Management</h2>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Manage roles and workspace access</p>
                  </div>
                  <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2 transition-all">
                    <UserPlus className="w-4 h-4" />
                    Add Seat
                  </button>
                </div>

                {/* Audit Trail Preview */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">Immutable Audit Log</h3>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Compliance & Event Tracking</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                      <Shield className="w-3 h-3 text-brand-primary" />
                      <span className="text-[8px] font-bold text-white uppercase tracking-widest">Protected</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map((log, i) => (
                      <div key={log.id || i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-brand-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                           <div className={`w-1.5 h-1.5 rounded-full ${log.severity === 'critical' ? 'bg-brand-alert animate-pulse' : log.severity === 'warning' ? 'bg-orange-500' : 'bg-brand-primary'}`} />
                           <div>
                             <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{log.action}</p>
                             <p className="text-[9px] text-white/40 line-clamp-1">{log.details}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-mono text-white/60">{new Date(log.timestamp).toLocaleTimeString()}</p>
                           <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">{log.actor?.email || 'SYSTEM'}</p>
                        </div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                       <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                         <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No recent administrative events indexed</p>
                       </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Stakeholder</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Visual Role Assignment</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Security Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {team.members.map((member) => (
                        <tr key={member.uid} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white/40 text-xs">
                                {member.email[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{member.email}</span>
                                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">ID: {member.uid.substring(0, 8)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                              {[
                                { role: 'admin', icon: ShieldCheck, label: 'Admin', color: 'text-brand-primary' },
                                { role: 'editor', icon: Edit3, label: 'Editor', color: 'text-brand-secondary' },
                                { role: 'viewer', icon: Eye, label: 'Viewer', color: 'text-white/40' }
                              ].map((r) => (
                                <button
                                  key={r.role}
                                  disabled={member.role === 'owner'}
                                  onClick={() => handleUpdateRole(member.uid, r.role as any)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                                    member.role === r.role 
                                      ? 'bg-white/10 text-white shadow-lg' 
                                      : 'text-white/20 hover:text-white/40'
                                  }`}
                                  title={r.label}
                                >
                                  <r.icon className={`w-3 h-3 ${member.role === r.role ? r.color : ''}`} />
                                  <span className="hidden xl:block">{r.label}</span>
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <Shield className="w-3 h-3 text-brand-primary" />
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verified</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/20 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'usage' && (
              <motion.div 
                key="usage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Neural Executions', value: usage.executions, unit: 'Tasks', color: 'brand-primary', icon: PieChart },
                    { label: 'Token Consumption', value: usage.tokens, unit: 'Tokens', color: 'brand-secondary', icon: Cpu },
                    { label: 'API Interactions', value: usage.apiCalls, unit: 'Requests', color: 'brand-alert', icon: BarChart3 }
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                      <div className="flex items-center justify-between relative z-10">
                        <div className={`p-2 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20`}>
                          <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                        </div>
                        <span className="text-[10px] font-mono text-white/20 uppercase font-bold tracking-widest">Live Meter</span>
                      </div>
                      <div className="space-y-2 relative z-10">
                        <div className="flex justify-between items-end">
                          <h3 className="text-2xl font-bold text-white font-mono">{stat.value.current.toLocaleString()}</h3>
                          <span className="text-xs text-white/40 font-mono">/ {stat.value.limit.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.value.current / stat.value.limit) * 100}%` }}
                            className={`h-full bg-${stat.color} shadow-[0_0_12px_rgba(0,0,0,0.5)]`}
                          />
                        </div>
                      </div>
                      {/* Decorative background flair */}
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 blur-3xl -translate-y-12 translate-x-12 rounded-full`} />
                    </div>
                  ))}
                </div>

                {/* Cost Projection */}
                <div className="bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-xl font-bold text-white tracking-tight">Projected Monthly Investment</h3>
                    <p className="text-sm text-white/40">Real-time projection based on neural compute cycles and agent orchestration load.</p>
                  </div>
                  <div className="text-right relative z-10">
                    <span className="text-4xl font-bold text-brand-primary font-mono">${usage.projectedCost.toLocaleString()}</span>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Est. Closing Balance</p>
                  </div>
                  <Layout className="absolute -right-8 -bottom-8 w-48 h-48 text-brand-primary/5 rotate-12" />
                </div>

                {/* Usage History */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-bold text-white tracking-tight">Historical Utilization Patterns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.usageHistory.map((history, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-primary/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:bg-brand-primary group-hover:text-black transition-all">
                            {history.month[0]}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">{history.month}</p>
                            <p className="text-[10px] text-white/20 font-mono">{(history.tokens / 1000).toFixed(0)}k Tokens</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-brand-primary font-mono">${history.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'subscription' && (
              <motion.div 
                key="subscription"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-primary/10 rounded-xl">
                      <CreditCard className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Subscription Toggle</h3>
                      <p className="text-[10px] text-white/40 uppercase font-bold">Switch between billing cycles</p>
                    </div>
                  </div>
                  <div className="flex bg-black p-1 rounded-xl border border-white/10">
                    <button 
                      onClick={() => setBillingInterval('month')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${billingInterval === 'month' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setBillingInterval('year')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${billingInterval === 'year' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      Annual <span className="text-[8px] text-brand-primary ml-1">-15%</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { tier: 'Standard', price: 99, features: ['100 Executions', 'Basic Agents', 'Local Storage'] },
                    { tier: 'Premium', price: 499, features: ['500 Executions', 'All Agents', 'Cloud Storage'], active: false },
                    { tier: 'Enterprise', price: 2450, features: ['Unlimited Agents', 'SSO & White-label', 'Dedicated Compute'], active: true }
                  ].map((plan, i) => (
                    <div key={i} className={`bg-black/40 border rounded-2xl p-8 space-y-8 relative overflow-hidden transition-all hover:translate-y-[-4px] ${plan.active ? 'border-brand-primary ring-1 ring-brand-primary/50' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                      {plan.active && (
                        <div className="absolute top-4 right-4 bg-brand-primary text-black px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/20">Current</div>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tighter">{plan.tier} Tier</h3>
                        <div className="flex items-end gap-1">
                          <span className="text-3xl font-bold text-white font-mono">${billingInterval === 'month' ? plan.price : Math.round(plan.price * 12 * 0.85).toLocaleString()}</span>
                          <span className="text-xs text-white/20 mb-1">/ {billingInterval === 'month' ? 'month' : 'year'}</span>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3 text-brand-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    <button 
                      onClick={() => setIsBillingModalOpen(true)}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${plan.active ? 'bg-white/10 text-white cursor-default' : 'bg-brand-primary text-black hover:scale-105 shadow-xl shadow-brand-primary/10'}`}
                    >
                      {plan.active ? 'Active Configuration' : 'Upgrade Neural Plan'}
                    </button>
                    </div>
                  ))}
                </div>

                {/* Seat Management */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 space-y-6">
                   <div className="flex items-center justify-between">
                     <div className="space-y-1">
                       <h3 className="text-lg font-bold text-white tracking-tight">Seat Management</h3>
                       <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Scalable team licensing</p>
                     </div>
                     <div className="flex items-center gap-4 bg-black border border-white/10 p-2 rounded-xl">
                       <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all">-</button>
                       <span className="text-lg font-bold text-white font-mono">{team.billingDetails?.seats || 5}</span>
                       <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all">+</button>
                     </div>
                   </div>
                   <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/20">Estimated Cost Adjustment</span>
                      <span className="text-brand-primary">+$45.00 / month</span>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-8 space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <Palette className="w-5 h-5" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Enterprise Identity</h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">Customize the neural workspace and documentation export engines with your corporate DNA.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Company Legal Identity</label>
                      <input 
                        type="text" 
                        value={previewConfig.companyName}
                        onChange={(e) => setPreviewConfig(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary outline-none transition-all placeholder:text-white/10 font-mono" 
                        placeholder="e.g. Neural Dynamics Corp"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Primary Brand Signature</label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="color"
                          value={previewConfig.primaryColor}
                          onChange={(e) => setPreviewConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0"
                        />
                        <div className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                           <span className="text-white font-mono text-sm uppercase">{previewConfig.primaryColor}</span>
                           <span className="text-[10px] font-bold text-white/20">LIVE PREVIEW</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Neural Canvas Preview</label>
                      <div 
                        className="bg-black border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl relative overflow-hidden group"
                        style={{ borderColor: `${previewConfig.primaryColor}20` }}
                      >
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: previewConfig.primaryColor }}>
                             <Zap className="w-4 h-4 text-black" />
                           </div>
                           <h4 className="text-sm font-bold text-white tracking-tight">{previewConfig.companyName}</h4>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full" style={{ width: '65%', backgroundColor: previewConfig.primaryColor }} />
                         </div>
                         <p className="text-[8px] text-white/40 uppercase font-mono tracking-widest">Simulated Interface Component</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Neural Workspace Domain</label>
                      <div className="flex gap-2">
                         <div className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                            <Globe className="w-4 h-4 text-white/20" />
                            <span className="text-white text-sm font-mono truncate">{previewConfig.domain}</span>
                         </div>
                         <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                           <ArrowUpCircle className="w-4 h-4 text-white/40" />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                  <button 
                    onClick={() => setPreviewConfig(team.whiteLabelConfig || { primaryColor: '#00ff9d', domain: 'agents.neural.io', companyName: 'Neural Dynamics' })}
                    className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-all"
                  >
                     Reset Changes
                  </button>
                  <button className="bg-brand-primary text-black px-8 py-3 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-brand-primary/20">
                     Propagate Identity
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Permission Quick Info */}
          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-brand-primary">
              <Shield className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Enterprise Guard</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Role-Based Auth', status: 'Active' },
                { label: 'Custom Claims', status: 'Configured' },
                { label: 'Audit Logging', status: 'Live' },
                { label: 'Neural Isolation', status: 'L4' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-white/20 tracking-widest">{item.label}</span>
                  <span className="text-white/60 font-mono">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Cycle Info */}
          <div className="bg-brand-primary text-black rounded-2xl p-6 space-y-4 shadow-xl shadow-brand-primary/10 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Next Billing Cycle</h3>
              <Zap className="w-4 h-4 fill-current animate-pulse" />
            </div>
            <div className="space-y-1 relative z-10">
              <h4 className="text-2xl font-bold tracking-tighter">July 15, 2026</h4>
              <p className="text-[10px] font-bold uppercase opacity-60">Total Estimated: $2,450.00</p>
            </div>
            <button className="w-full bg-black text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all relative z-10">
              Manage Ledger
            </button>
            <CreditCard className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-all" />
          </div>

          {/* Quick API Keys */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Neural API Tunnel</h3>
                <Key className="w-4 h-4 text-white/20" />
             </div>
             <div className="bg-black border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between group">
                <span className="text-xs font-mono text-white/40 tracking-widest">sk_neural_••••••••</span>
                <button className="text-[10px] font-bold text-brand-primary uppercase opacity-0 group-hover:opacity-100 transition-all">Reveal</button>
             </div>
             <p className="text-[8px] text-white/20 uppercase text-center">API keys are encrypted using enterprise AES-256</p>
          </div>
        </div>
      </div>
      {/* Plan Switcher Modal */}
      <AnimatePresence>
        {isBillingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBillingModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-app-bg border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-alert" />
              
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Billing Portal Transition</h3>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Enterprise Ledger Management</p>
                </div>
                <button 
                  onClick={() => setIsBillingModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-all"
                >
                  <CloseIcon className="w-5 h-5 text-white/40 hover:text-white" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tighter">Stripe Customer Portal</h4>
                      <p className="text-[10px] text-white/40 uppercase font-bold">Secure external session</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    You are being redirected to our secure billing partner, Stripe. Here you can:
                  </p>
                  <ul className="space-y-2">
                    {['Switch to Annual Billing (-15%)', 'Update Payment Methods', 'View Invoice History', 'Adjust Seat Capacity'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-brand-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsBillingModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleOpenStripePortal}
                    disabled={isPortalLoading}
                    className="flex-1 px-6 py-3 rounded-xl bg-brand-primary text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2"
                  >
                    {isPortalLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Launch Portal
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
