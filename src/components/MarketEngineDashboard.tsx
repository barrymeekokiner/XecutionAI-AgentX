import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ChevronRight, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { MarketIntelligenceEngineReport } from '../types';

interface MarketEngineDashboardProps {
  report: MarketIntelligenceEngineReport;
}

export const MarketEngineDashboard: React.FC<MarketEngineDashboardProps> = ({ report }) => {
  // Generate mock sentiment data for 90 days
  const sentimentData = Array.from({ length: 12 }, (_, i) => ({
    date: `Week ${i + 1}`,
    sentiment: 40 + Math.random() * 50,
    searchVolume: 30 + Math.random() * 60
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Venture Sentiment Matrix */}
      <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-secondary/10 rounded-xl">
              <Globe className="w-5 h-5 text-brand-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Neural Venture Sentiment</h3>
              <p className="text-[10px] text-white/40 font-mono">90-Day Google Trends Aggregate</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
              <span className="text-[8px] text-white/40 uppercase font-bold">Search Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span className="text-[8px] text-white/40 uppercase font-bold">Sentiment Index</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sentimentData}>
              <defs>
                <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-secondary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--brand-secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#ffffff20', fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: '#ffffff20', fontSize: 10 }} axisLine={false} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
              />
              <Area 
                type="monotone" 
                dataKey="sentiment" 
                stroke="var(--brand-secondary)" 
                fillOpacity={1} 
                fill="url(#colorSentiment)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="searchVolume" 
                stroke="var(--brand-primary)" 
                strokeWidth={2} 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-brand-primary/5 border border-brand-primary/20 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <Target className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em]">Overall Opportunity</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black font-mono text-white">{report.overallScore}</span>
              <span className="text-white/20 font-mono text-xl">/100</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed max-w-md">{report.recommendation}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Target ARR</h4>
          <div className="space-y-1">
            <p className="text-2xl font-black font-mono text-white tracking-tighter">{report.revenuePotential.target}</p>
            <p className="text-[8px] text-brand-primary font-mono uppercase">Optimistic: {report.revenuePotential.high}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time to Revenue</h4>
          <div className="space-y-1">
            <p className="text-2xl font-black font-mono text-white tracking-tighter">{report.revenuePotential.timeToFirstDollar}</p>
            <p className="text-[8px] text-white/20 font-mono uppercase">Estimated deployment cycle</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scoring Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <BarChart3 className="w-4 h-4 text-brand-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Scoring Matrix</h3>
          </div>
          <div className="space-y-4">
            {report.scoringBreakdown.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 group hover:border-brand-primary/30 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{item.factor}</span>
                  <span className="text-xs font-mono text-brand-primary">{item.score}/10</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score * 10}%` }}
                    className="h-full bg-brand-primary"
                  />
                </div>
                <p className="text-[9px] text-white/40 font-mono leading-tight">{item.justification}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trends & Competitors */}
        <div className="lg:col-span-2 space-y-8">
          {/* Market Trends */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <TrendingUp className="w-4 h-4 text-brand-secondary" />
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Market Momentum</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.trends.map((trend, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className={`p-1.5 rounded-lg ${trend.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' : trend.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {trend.sentiment === 'positive' ? <ArrowUpRight className="w-3.5 h-3.5" /> : trend.sentiment === 'negative' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[8px] text-white/20 font-mono uppercase">{trend.source}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-white leading-tight">{trend.trend}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-secondary" style={{ width: `${trend.momentum * 100}%` }} />
                      </div>
                      <span className="text-[8px] text-white/40 font-mono">{(trend.momentum * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Competitor Analysis */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Users className="w-4 h-4 text-brand-alert" />
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Competitive Analysis</h3>
            </div>
            <div className="space-y-4">
              {report.competitors.map((comp, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl group hover:bg-white/[0.04] transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-white uppercase tracking-tighter">{comp.name}</h4>
                      <p className="text-[9px] text-brand-alert font-mono uppercase tracking-widest">Market Share: {comp.marketShare}</p>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/60">
                      Pricing: {comp.pricing}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h5 className="text-[8px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" />
                        Strengths
                      </h5>
                      <ul className="space-y-1.5">
                        {comp.strengths.map((s, j) => (
                          <li key={j} className="text-[10px] text-white/60 flex items-start gap-2">
                            <span className="text-green-500/40 mt-1">●</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-[8px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        Weaknesses
                      </h5>
                      <ul className="space-y-1.5">
                        {comp.weaknesses.map((w, j) => (
                          <li key={j} className="text-[10px] text-white/60 flex items-start gap-2">
                            <span className="text-red-500/40 mt-1">●</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
