import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, TrendingUp, BarChart3, Download, Share2, History } from 'lucide-react';
import { ResourceMetric } from '../types';
import { ResourceBenchmarking } from './ResourceBenchmarking';

interface GlobalResourceEfficiencyProps {
  metrics: ResourceMetric[];
}

export const GlobalResourceEfficiency: React.FC<GlobalResourceEfficiencyProps> = ({ metrics }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<ResourceMetric | null>(null);
  const [activeTab, setActiveTab] = useState<'spectrum' | 'benchmarking'>('spectrum');

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || metrics.length === 0) return;

    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale (Time)
    const x = d3.scaleTime()
      .domain(d3.extent(metrics, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    // Y Scale (Efficiency %)
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Area Generator
    const area = d3.area<ResourceMetric>()
      .x(d => x(new Date(d.timestamp)))
      .y0(y(0))
      .y1(d => y(d.efficiency))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const line = d3.line<ResourceMetric>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.efficiency))
      .curve(d3.curveMonotoneX);

    // Gradients
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "efficiency-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00ff9d")
      .attr("stop-opacity", 0.4);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00ff9d")
      .attr("stop-opacity", 0);

    // Draw Area
    svg.append("path")
      .datum(metrics)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", "url(#efficiency-gradient)");

    // Draw Line
    svg.append("path")
      .datum(metrics)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#00ff9d")
      .attr("stroke-width", 2);

    // Add Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %d") as any))
      .attr("color", "rgba(255,255,255,0.2)")
      .selectAll("text")
      .style("font-family", "JetBrains Mono")
      .style("font-size", "10px");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .attr("color", "rgba(255,255,255,0.2)")
      .selectAll("text")
      .style("font-family", "JetBrains Mono")
      .style("font-size", "10px");

    // Interactive Overlay
    const bisect = d3.bisector((d: ResourceMetric) => d.timestamp).left;
    
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const mouseX = d3.pointer(event)[0];
        const date = x.invert(mouseX);
        const i = bisect(metrics, date.getTime());
        const d = metrics[i];
        if (d) setHoveredData(d);
      })
      .on("mouseleave", () => setHoveredData(null));

    // Focus point
    if (hoveredData) {
      svg.append("circle")
        .attr("cx", x(new Date(hoveredData.timestamp)))
        .attr("cy", y(hoveredData.efficiency))
        .attr("r", 5)
        .attr("fill", "#00ff9d")
        .attr("stroke", "#000")
        .attr("stroke-width", 2);
    }

  }, [metrics, hoveredData]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Zap className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Global Efficiency</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-mono">
              {metrics.length > 0 ? (metrics.reduce((acc, m) => acc + m.efficiency, 0) / metrics.length).toFixed(1) : 0}%
            </span>
            <TrendingUp className="w-4 h-4 text-brand-primary" />
          </div>
          <p className="text-[10px] text-white/20 mt-2 font-mono uppercase tracking-tighter">Aggregated across all historical builds</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-secondary/10 rounded-lg">
              <Activity className="w-5 h-5 text-brand-secondary" />
            </div>
            <h3 className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Compute Recovery</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-mono">14.2%</span>
            <span className="text-[10px] text-brand-secondary font-mono">AVG_GAIN</span>
          </div>
          <p className="text-[10px] text-white/20 mt-2 font-mono uppercase tracking-tighter">Neural optimization effectiveness rating</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-alert/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-brand-alert" />
            </div>
            <h3 className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Wasted Resource Score</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-mono">0.04</span>
            <span className="text-[10px] text-brand-alert font-mono">LAMBDA_W</span>
          </div>
          <p className="text-[10px] text-white/20 mt-2 font-mono uppercase tracking-tighter">Lower is better. Represents idle overhead.</p>
        </div>
      </div>

      <div className="bg-black border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('spectrum')}
              className={`pb-2 text-sm font-bold uppercase tracking-tighter flex items-center gap-2 border-b-2 transition-all ${activeTab === 'spectrum' ? 'text-white border-brand-primary' : 'text-white/20 border-transparent hover:text-white/40'}`}
            >
              Neural Efficiency Spectrum
              {activeTab === 'spectrum' && <div className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded text-[8px] text-brand-primary font-mono animate-pulse">LTM_ENABLED</div>}
            </button>
            <button 
              onClick={() => setActiveTab('benchmarking')}
              className={`pb-2 text-sm font-bold uppercase tracking-tighter flex items-center gap-2 border-b-2 transition-all ${activeTab === 'benchmarking' ? 'text-white border-brand-secondary' : 'text-white/20 border-transparent hover:text-white/40'}`}
            >
              Historical Benchmarking
              <History className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={containerRef} className="w-full relative">
          {activeTab === 'spectrum' ? (
            <>
              <svg ref={svgRef} className="w-full h-[400px]" />
              
              <AnimatePresence>
                {hoveredData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-0 right-0 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl z-10 space-y-2 pointer-events-none min-w-[160px]"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[8px] text-white/40 uppercase font-bold font-mono">Timestamp</span>
                      <span className="text-[10px] text-white font-mono">{new Date(hoveredData.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-brand-primary uppercase font-bold font-mono">Efficiency</span>
                      <span className="text-[12px] text-brand-primary font-bold font-mono">{hoveredData.efficiency}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-brand-secondary uppercase font-bold font-mono">CPU Load</span>
                      <span className="text-[10px] text-white/80 font-mono">{hoveredData.cpu}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-brand-alert uppercase font-bold font-mono">Memory</span>
                      <span className="text-[10px] text-white/80 font-mono">{hoveredData.memory}%</span>
                    </div>
                    <p className="text-[8px] text-white/20 italic mt-2 border-t border-white/5 pt-2">Build ID: {hoveredData.buildId.substring(0, 8)}...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <ResourceBenchmarking metrics={metrics} />
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">Optimized Build Ratio</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white font-mono">0.94</span>
              <span className="text-[8px] text-green-400 font-mono">+2.1%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[94%] bg-brand-primary shadow-[0_0_5px_#00ff9d]" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">Compute Overhead</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white font-mono">124ms</span>
              <span className="text-[8px] text-red-400 font-mono">+12ms</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[25%] bg-brand-alert shadow-[0_0_5px_#ff1744]" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">Alpha Opportunity Identification</span>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-black flex items-center justify-center text-[8px] font-bold text-white/40">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-white/40 font-mono">Agent clusters identified 14 new cost-saving vectors in last 30d cycle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
