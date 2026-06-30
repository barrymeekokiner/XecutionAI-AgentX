import React from 'react';
import { RiskReportData } from '../types';
import { AlertTriangle, ShieldAlert, ZapOff, ShieldCheck } from 'lucide-react';

interface Props {
  report: RiskReportData;
}

export const RiskReport: React.FC<Props> = ({ report }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vulnerabilities */}
        <div className="bg-brand-alert/5 border border-brand-alert/20 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-brand-alert uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Vulnerabilities
          </h3>
          <ul className="space-y-2">
            {report.vulnerabilities.map((v, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-brand-alert text-[10px] font-mono mt-0.5">•</span>
                <p className="text-[10px] text-white/60 font-mono leading-tight">{v}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottlenecks */}
        <div className="bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-widest flex items-center gap-2">
            <ZapOff className="w-4 h-4" />
            Bottlenecks
          </h3>
          <ul className="space-y-2">
            {report.bottlenecks.map((v, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-brand-secondary text-[10px] font-mono mt-0.5">•</span>
                <p className="text-[10px] text-white/60 font-mono leading-tight">{v}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Failure Points */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Critical Failure Points
          </h3>
          <ul className="space-y-2">
            {report.failurePoints.map((v, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-white/20 text-[10px] font-mono mt-0.5">•</span>
                <p className="text-[10px] text-white/60 font-mono leading-tight">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-center gap-4">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <h4 className="text-[10px] text-white font-bold uppercase tracking-widest">Neural Mitigation Active</h4>
          <p className="text-[9px] text-white/40 uppercase font-mono mt-0.5">Automated patches ready for deployment across 12 sectors.</p>
        </div>
      </div>
    </div>
  );
};
