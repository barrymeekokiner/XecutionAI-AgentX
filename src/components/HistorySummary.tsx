import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { ExecutionResult } from '../types';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';

interface Props {
  history: ExecutionResult[];
}

export const HistorySummary: React.FC<Props> = ({ history }) => {
  const stats = useMemo(() => {
    const liquidityHistory = history.filter(h => h.liquidityPlan);
    const totalPotential = liquidityHistory.reduce((acc, h) => {
      return acc + (h.liquidityPlan?.assetTable.reduce((sum, a) => sum + a.marketValue, 0) || 0);
    }, 0);
    const totalActualized = history.reduce((acc, h) => acc + (h.actualizedCashout || 0), 0);
    
    return {
      totalPotential,
      totalActualized,
      projectCount: history.length,
      liquidityCount: liquidityHistory.length
    };
  }, [history]);

  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || history.length < 2) return;

    const width = 300;
    const height = 120;
    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = history
      .filter(h => h.liquidityPlan)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((h, i) => ({
        index: i,
        value: h.liquidityPlan?.assetTable.reduce((sum, a) => sum + a.marketValue, 0) || 0
      }));

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: {index: number, value: number}) => d.value) || 0])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<any>()
      .x(d => x(d.index))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#00ff9d")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Area
    const area = d3.area<any>()
      .x(d => x(d.index))
      .y0(height - margin.bottom)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#gradient-green)")
      .attr("opacity", 0.2)
      .attr("d", area);

    // Gradients
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradient-green")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#00ff9d");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "transparent");

  }, [history]);

  if (history.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5 space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-primary" />
          Execution Performance
        </h3>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Archive_v2.6</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[9px] text-white/30 uppercase tracking-widest block">Total Pipeline Value</span>
          <div className="text-xl font-mono text-white flex items-center gap-1">
            <span className="text-brand-primary text-xs">$</span>
            {(stats.totalPotential / 1000).toFixed(1)}k
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] text-white/30 uppercase tracking-widest block">Actualized Liquidity</span>
          <div className="text-xl font-mono text-brand-secondary flex items-center gap-1">
            <span className="text-xs">$</span>
            {(stats.totalActualized / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] block mb-4">Value Accumulation Delta</span>
        {history.filter(h => h.liquidityPlan).length >= 2 ? (
          <svg ref={svgRef} className="w-full h-[120px]" />
        ) : (
          <div className="h-[120px] flex items-center justify-center border border-dashed border-white/5 rounded-lg text-white/10 text-[9px] uppercase tracking-widest">
            Awaiting additional data points...
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
          <span className="text-[9px] text-white/40 uppercase font-mono">{stats.liquidityCount} Liquidations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-alert" />
          <span className="text-[9px] text-white/40 uppercase font-mono">{stats.projectCount} Total Logs</span>
        </div>
      </div>
    </div>
  );
};
