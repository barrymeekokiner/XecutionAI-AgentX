import React from 'react';
import { SaaSBuildPlan } from '../types';
import { Code2, Server, Database, CreditCard, Play } from 'lucide-react';

interface Props {
  plan?: SaaSBuildPlan;
}

export const SaaSResult: React.FC<Props> = ({ plan }) => {
  if (!plan) return null;

  return (
    <div className="space-y-4">
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
