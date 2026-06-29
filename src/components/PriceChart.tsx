import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LiquidityAsset } from '../types';

interface Props {
  assets: LiquidityAsset[];
}

export const PriceChart: React.FC<Props> = ({ assets }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || assets.length === 0) return;

    const container = d3.select(containerRef.current);
    const width = containerRef.current.clientWidth;
    const height = 240;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
      .domain(assets.map(d => d.asset))
      .rangeRound([0, width - margin.left - margin.right])
      .paddingInner(0.2);

    const x1 = d3.scaleBand()
      .domain(['flash', 'market', 'max'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(assets, (d: LiquidityAsset) => Math.max(d.flashValue, d.marketValue, d.maxExtraction)) || 0])
      .nice()
      .rangeRound([height - margin.top - margin.bottom, 0]);

    const color = d3.scaleOrdinal<string>()
      .domain(['flash', 'market', 'max'])
      .range(['#ff3e3e', '#00ff9d', '#00d4ff']);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(y)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat(() => "")
      );

    svg.append("g")
      .selectAll("g")
      .data(assets)
      .join("g")
      .attr("transform", (d: LiquidityAsset) => `translate(${x0(d.asset)},0)`)
      .selectAll("rect")
      .data((d: LiquidityAsset) => [
        { key: 'flash', value: d.flashValue },
        { key: 'market', value: d.marketValue },
        { key: 'max', value: d.maxExtraction }
      ])
      .join("rect")
      .attr("x", d => x1(d.key) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => (height - margin.top - margin.bottom) - y(d.value))
      .attr("fill", d => color(d.key))
      .attr("rx", 2);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "end")
      .style("font-size", "9px")
      .style("fill", "rgba(255,255,255,0.4)");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5, "s"))
      .selectAll("text")
      .style("font-size", "9px")
      .style("fill", "rgba(255,255,255,0.4)");

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(0, -20)`);

    ['Flash', 'Market', 'Max'].forEach((label, i) => {
      const g = legend.append("g")
        .attr("transform", `translate(${i * 80}, 0)`);
      
      g.append("rect")
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill", color(['flash', 'market', 'max'][i]))
        .attr("rx", 2);

      g.append("text")
        .attr("x", 12)
        .attr("y", 8)
        .text(label)
        .style("font-size", "9px")
        .style("fill", "rgba(255,255,255,0.6)")
        .style("text-transform", "uppercase");
    });

  }, [assets]);

  return (
    <div ref={containerRef} className="w-full bg-black/20 rounded-lg p-2 border border-white/5">
      <svg ref={svgRef} className="w-full h-[240px]" />
    </div>
  );
};
