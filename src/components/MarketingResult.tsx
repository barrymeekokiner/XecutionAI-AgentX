import React from 'react';
import { MarketingStrategy } from '../types';
import { Target, Search, BarChart3, Globe, ArrowRight } from 'lucide-react';

interface Props {
  strategy: MarketingStrategy;
}

export const MarketingResult: React.FC<Props> = ({ strategy }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketplace Optimization */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-primary" />
            Marketplace Optimization
          </h3>
          <p className="text-white/60 text-[11px] leading-relaxed font-mono border-l border-brand-primary/30 pl-4">
            {strategy.marketplaceOptimization}
          </p>
        </div>

        {/* SEO Keywords */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-secondary" />
            Neural SEO Targets
          </h3>
          <div className="flex flex-wrap gap-2">
            {strategy.seoKeywords.map((keyword, i) => (
              <span key={i} className="px-2 py-1 bg-brand-secondary/10 border border-brand-secondary/20 rounded text-[9px] text-brand-secondary font-mono uppercase tracking-tighter">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-alert" />
            Conversion Pipeline
          </h3>
          <div className="space-y-2">
            {strategy.conversionFunnel.map((step, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-brand-alert/10 border border-brand-alert/30 flex items-center justify-center text-[8px] text-brand-alert font-bold">
                    {i + 1}
                  </div>
                  {i < strategy.conversionFunnel.length - 1 && (
                    <div className="w-px h-4 bg-brand-alert/20" />
                  )}
                </div>
                <p className="text-[10px] text-white/60 font-mono group-hover:text-white transition-colors">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Payload */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-primary" />
            Neural Analytics Logic
          </h3>
          <pre className="bg-black/60 p-4 rounded border border-white/5 text-[9px] text-brand-primary font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            {strategy.analyticsPayload}
          </pre>
        </div>
      </div>

      {/* Advanced Action Card */}
      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:bg-brand-primary/10 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-xl">
            <Target className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Execute Full Campaign</h4>
            <p className="text-[10px] text-white/40 uppercase font-mono mt-1">Deploy automated outreach & landing pages</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-brand-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
