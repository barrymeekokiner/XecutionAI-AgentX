import React, { useState, useEffect } from 'react';
import { LiquidityPlan, LiquidityAsset } from '../types';
import { Table, BarChart3, Clock, ArrowUpRight, Zap, Radar, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { EmailDrafts } from './EmailDrafts';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  plan?: LiquidityPlan;
}

export const LiquidityResult: React.FC<Props> = ({ plan }) => {
  const [sortKey, setSortKey] = useState<'speed' | 'value'>('speed');
  const [volume, setVolume] = useState(100); // Percentage
  const [marketInterest, setMarketInterest] = useState(100); // Percentage
  const [sentinelData, setSentinelData] = useState<any>(null);
  const [sentinelLoading, setSentinelLoading] = useState(false);

  if (!plan) return null;

  const runSentinel = async () => {
    setSentinelLoading(true);
    try {
      const res = await fetch('/api/market-sentinel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: plan.assetTable.map(a => a.asset) })
      });
      if (res.ok) {
        const data = await res.json();
        setSentinelData(data);
      }
    } catch (e) {
      console.error("Sentinel failed", e);
    } finally {
      setSentinelLoading(false);
    }
  };

  useEffect(() => {
    if (plan && !sentinelData && !sentinelLoading) {
      runSentinel();
    }
  }, [plan]);

  const adjustedAssets = plan.assetTable.map(asset => {
    const multiplier = (volume / 100) * (marketInterest / 100);
    return {
      ...asset,
      flashValue: asset.flashValue * multiplier,
      marketValue: asset.marketValue * multiplier,
      maxExtraction: asset.maxExtraction * multiplier,
    };
  });

  const sortedAssets = [...adjustedAssets].sort((a, b) => {
    if (sortKey === 'speed') return b.speedScore - a.speedScore;
    return b.valueScore - a.valueScore;
  });

  const totalDays = plan.executionTimes?.reduce((a, b) => a + b, 0) || 0;
  const isMaxExtractionHit = marketInterest >= 150;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Market Sentinel Scanner */}
      <div className="relative overflow-hidden bg-black border border-white/10 rounded-xl p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Radar className="w-4 h-4 text-brand-primary animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Neural Market Sentinel</h3>
              <p className="text-[10px] text-white/40 uppercase font-mono tracking-tighter">Scanning global OTC & Liquidity pools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {sentinelLoading && (
              <div className="flex items-center gap-2 text-[9px] text-brand-primary font-mono animate-pulse uppercase">
                <Loader2 className="w-3 h-3 animate-spin" />
                Aggregating Order Books...
              </div>
            )}
            {!sentinelLoading && (
              <button 
                onClick={runSentinel}
                className="text-[9px] text-white/30 hover:text-brand-primary uppercase font-bold tracking-widest transition-colors flex items-center gap-1.5"
              >
                <TrendingUp className="w-3 h-3" />
                Force Rescan
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative z-10">
          <AnimatePresence mode="wait">
            {sentinelData ? (
              sentinelData.signals.slice(0, 4).map((signal: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2 group hover:border-brand-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] text-white/40 font-mono truncate max-w-[100px]">{signal.asset}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      signal.sentiment === 'BULLISH' ? 'bg-brand-primary/10 text-brand-primary' :
                      signal.sentiment === 'BEARISH' ? 'bg-brand-alert/10 text-brand-alert' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {signal.sentiment}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-xl font-bold text-white font-mono">{signal.interestScore}<span className="text-[10px] text-white/20">/100</span></div>
                    <span className="text-[8px] text-white/30 font-mono tracking-tighter">{signal.volumeSignal}</span>
                  </div>
                  <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.interestScore}%` }}
                      className={`h-full ${signal.sentiment === 'BULLISH' ? 'bg-brand-primary shadow-[0_0_8px_#00ff9d]' : 'bg-brand-secondary'}`}
                    />
                  </div>
                  <p className="text-[8px] text-white/40 leading-tight italic line-clamp-2 group-hover:line-clamp-none transition-all">{signal.reasoning}</p>
                </motion.div>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
              ))
            )}
          </AnimatePresence>
        </div>

        {sentinelData && (
          <div className="mt-4 p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <p className="text-[9px] text-brand-primary/80 leading-relaxed font-mono italic">
              GLOBAL_OUTLOOK: {sentinelData.globalOutlook}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Volume Coefficient</span>
            <span className="text-[10px] font-mono text-brand-primary">{volume}%</span>
          </div>
          <input 
            type="range" min="10" max="200" value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Market Interest</span>
            <span className={`text-[10px] font-mono ${isMaxExtractionHit ? 'text-brand-alert animate-pulse' : 'text-brand-secondary'}`}>
              {marketInterest}% {isMaxExtractionHit && '(MAX_EXTRACTION_THRESHOLD)'}
            </span>
          </div>
          <input 
            type="range" min="10" max="200" value={marketInterest} 
            onChange={(e) => setMarketInterest(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest block mb-1">Time to Cash</span>
            <div className="text-xl font-mono text-white flex items-baseline gap-1">
              {totalDays} <span className="text-xs text-white/40">DAYS</span>
            </div>
          </div>
          <Clock className="w-8 h-8 text-brand-primary/20" />
        </div>
        <div className="bg-brand-secondary/5 border border-brand-secondary/20 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-brand-secondary uppercase font-bold tracking-widest block mb-1">Proj. Liquidity</span>
            <div className="text-xl font-mono text-white flex items-baseline gap-1">
              <span className="text-xs text-brand-secondary">$</span>
              {(adjustedAssets.reduce((a, b) => a + b.marketValue, 0) / 1000).toFixed(1)}k
            </div>
          </div>
          <Zap className={`w-8 h-8 ${isMaxExtractionHit ? 'text-brand-alert animate-bounce' : 'text-brand-secondary/20'}`} />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Total Assets</span>
            <div className="text-xl font-mono text-white">{plan.assetTable.length}</div>
          </div>
          <Table className="w-8 h-8 text-white/10" />
        </div>
      </div>

      {/* Asset Table */}
      <div className={`bg-white/5 border rounded-lg p-5 transition-all duration-500 ${isMaxExtractionHit ? 'border-brand-alert/50 shadow-[0_0_30px_rgba(255,62,62,0.1)]' : 'border-white/10'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Table className={`w-4 h-4 ${isMaxExtractionHit ? 'text-brand-alert' : 'text-brand-primary'}`} />
            Asset Liquidation Matrix
          </h3>
          <div className="flex bg-black/40 p-1 rounded-md border border-white/5">
            <button 
              onClick={() => setSortKey('speed')}
              className={`px-3 py-1 text-[9px] uppercase font-bold rounded transition-all ${sortKey === 'speed' ? 'bg-brand-primary text-black' : 'text-white/40 hover:text-white'}`}
            >
              Speed to Cash
            </button>
            <button 
              onClick={() => setSortKey('value')}
              className={`px-3 py-1 text-[9px] uppercase font-bold rounded transition-all ${sortKey === 'value' ? 'bg-brand-secondary text-black' : 'text-white/40 hover:text-white'}`}
            >
              Highest Return
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 px-3 text-white/30 uppercase font-bold text-[9px] tracking-widest">Asset</th>
                <th className="py-2 px-3 text-white/30 uppercase font-bold text-[9px] tracking-widest text-center">Score</th>
                <th className="py-2 px-3 text-white/30 uppercase font-bold text-[9px] tracking-widest">Platform</th>
                <th className="py-2 px-3 text-white/30 uppercase font-bold text-[9px] tracking-widest text-right">Proj. Exit</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {sortedAssets.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono text-white text-[11px] mb-0.5">{item.asset}</div>
                    <div className="text-[8px] text-white/30 uppercase tracking-widest">{item.classification}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${sortKey === 'speed' ? 'bg-brand-primary' : 'bg-brand-secondary'}`} 
                          style={{ width: `${(sortKey === 'speed' ? item.speedScore : item.valueScore) * 10}%` }}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-white/40">{(sortKey === 'speed' ? item.speedScore : item.valueScore)}/10</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white/60 font-mono text-[10px]">{item.platform}</td>
                  <td className="py-3 px-3 text-right text-brand-secondary font-mono">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[9px] text-white/20">$</span>
                        {item.marketValue.toLocaleString()}
                        <ArrowUpRight className={`w-2 h-2 ${isMaxExtractionHit ? 'text-brand-alert animate-bounce' : 'opacity-50'}`} />
                      </div>
                      <span className="text-[8px] text-white/20 uppercase tracking-tighter">
                        Flash: ${item.flashValue.toLocaleString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visualization */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart3 className="w-3 h-3 text-brand-secondary" />
            Dynamic Price Projection
          </h4>
          <PriceChart assets={adjustedAssets} />
        </div>

        {/* Outreach Scripts */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5 h-full">
          <EmailDrafts scripts={plan.outreachScripts} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Market Mapping</h4>
          <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap font-mono border-l border-brand-primary/20 pl-4">{plan.marketMap}</p>
        </div>
        
        {/* Market Pressure Heatmap */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-brand-secondary" />
              Liquidity Pressure Heatmap
            </h4>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-brand-alert" />
                <span className="text-[8px] text-white/40 uppercase">Sell</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-brand-primary" />
                <span className="text-[8px] text-white/40 uppercase">Buy</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-1.5 h-32">
            {[...Array(25)].map((_, i) => {
              const intensity = Math.random();
              const isSell = i % 3 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: intensity * 0.8 + 0.2, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`rounded-sm flex items-center justify-center relative group cursor-crosshair ${
                    isSell ? 'bg-brand-alert/40' : 'bg-brand-primary/40'
                  }`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity" />
                  {intensity > 0.8 && (
                    <div className={`w-1 h-1 rounded-full animate-ping ${isSell ? 'bg-brand-alert' : 'bg-brand-primary'}`} />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[8px] text-white/20 font-mono uppercase tracking-tighter">
            <span>Global Order Depth</span>
            <span className="text-brand-primary">Update: T+200ms</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Execution Sequence</h4>
          <div className="space-y-2">
            {plan.executionSequence.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/[0.03] p-2 border-l-2 border-brand-primary rounded-r">
                <div className="flex flex-col items-center min-w-[30px]">
                  <span className="text-brand-primary font-mono text-[10px]">[{idx + 1}]</span>
                  <span className="text-[8px] text-white/20 font-mono">T+{plan.executionTimes?.[idx] || 0}D</span>
                </div>
                <p className="text-white/80 text-[11px] leading-tight mt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
