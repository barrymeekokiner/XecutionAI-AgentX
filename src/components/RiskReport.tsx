import React from 'react';
import { RiskReportData } from '../types';
import { ShieldAlert, AlertTriangle, Activity } from 'lucide-react';

interface Props {
  report: RiskReportData;
}

export const RiskReport: React.FC<Props> = ({ report }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/5 border border-brand-alert/20 rounded-lg p-4">
        <h4 className="text-[9px] font-bold mb-3 text-brand-alert uppercase tracking-[0.2em] flex items-center gap-2">
          <ShieldAlert className="w-3 h-3" />
          Threat Matrix
        </h4>
        <ul className="space-y-1.5 font-mono">
          {report.vulnerabilities.map((v, i) => (
            <li key={i} className="text-white/80 text-[10px] flex gap-2 border-b border-white/5 pb-1 last:border-0">
              <span className="text-brand-alert">ERR_</span>
              {v}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 border border-[#ffcc00]/20 rounded-lg p-4">
        <h4 className="text-[9px] font-bold mb-3 text-[#ffcc00] uppercase tracking-[0.2em] flex items-center gap-2">
          <AlertTriangle className="w-3 h-3" />
          Flow Bottlenecks
        </h4>
        <ul className="space-y-1.5 font-mono">
          {report.bottlenecks.map((b, i) => (
            <li key={i} className="text-white/80 text-[10px] flex gap-2 border-b border-white/5 pb-1 last:border-0">
              <span className="text-[#ffcc00]">LAG_</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h4 className="text-[9px] font-bold mb-3 text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity className="w-3 h-3" />
          System Faults
        </h4>
        <ul className="space-y-1.5 font-mono">
          {report.failurePoints.map((f, i) => (
            <li key={i} className="text-white/60 text-[10px] flex gap-2 border-b border-white/5 pb-1 last:border-0">
              <span className="text-white/20">TRP_</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
