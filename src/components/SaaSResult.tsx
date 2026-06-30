import React, { useState } from 'react';
import { SaaSBuildPlan } from '../types';
import { Code2, Server, Database, CreditCard, Play, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface Props {
  plan?: SaaSBuildPlan;
  originalInput?: string;
}

export const SaaSResult: React.FC<Props> = ({ plan, originalInput }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, context: originalInput })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error("Audit failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Neural Audit Section */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-black border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Neural Strategic Audit</h3>
                <p className="text-[10px] text-white/40 uppercase font-mono">Expert-level plan validation</p>
              </div>
            </div>
            {!analysis && !loading && (
              <button
                onClick={runAudit}
                className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-[10px] text-brand-primary font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3" />
                Initiate Review
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
              <p className="text-[10px] text-brand-primary font-mono uppercase animate-pulse">Analyzing architectural dependencies...</p>
            </div>
          )}

          {analysis && (
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
              <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-brand-primary font-mono text-[11px] text-white/70">
                <Markdown>{analysis}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Architecture */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-alert" />
            System Architecture
          </h3>
          <p className="text-white/60 text-[11px] leading-relaxed whitespace-pre-wrap font-mono border-l border-brand-alert/30 pl-3">{plan.architecture}</p>
        </div>

        {/* Database */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-secondary" />
            Data Schema
          </h3>
          <pre className="bg-black/40 p-3 rounded border border-white/5 text-[9px] text-brand-secondary font-mono overflow-x-auto">
            {plan.dbSchema}
          </pre>
        </div>
      </div>

      {/* Code Scaffold */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-yellow-400" />
          Code Scaffold (Minimal)
        </h3>
        <pre className="bg-black/60 p-4 rounded border border-white/5 text-[10px] text-brand-primary font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
          {plan.codeScaffold}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payments */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-pink-400" />
            Stripe Logic
          </h3>
          <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded text-[10px] text-white/80 font-mono">
            {plan.stripeFlow}
          </div>
        </div>

        {/* Deployment */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Play className="w-4 h-4 text-brand-primary" />
            Deployment Sequence
          </h3>
          <pre className="bg-black/40 p-3 rounded border border-white/5 text-[10px] text-brand-alert font-mono italic">
            {plan.deploymentScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
