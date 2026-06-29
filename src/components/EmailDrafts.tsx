import React, { useState } from 'react';
import { Mail, Copy, Check, MessageSquare } from 'lucide-react';
import { OutreachScript } from '../types';

interface Props {
  scripts: OutreachScript[];
}

export const EmailDrafts: React.FC<Props> = ({ scripts }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
        <Mail className="w-3 h-3 text-brand-primary" />
        Outreach Command Center
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {scripts.map((script, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-white/[0.03] px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-brand-secondary" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">To: {script.target}</span>
              </div>
              <button 
                onClick={() => handleCopy(`Subject: ${script.subject}\n\n${script.body}`, idx)}
                className="flex items-center gap-1.5 text-[9px] text-brand-primary hover:text-white transition-colors"
              >
                {copiedIdx === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedIdx === idx ? 'COPIED' : 'COPY DRAFT'}
              </button>
            </div>
            <div className="p-4 space-y-3 font-mono">
              <div>
                <span className="text-[9px] text-white/20 block uppercase mb-1">Subject</span>
                <p className="text-xs text-brand-secondary font-bold">{script.subject}</p>
              </div>
              <div>
                <span className="text-[9px] text-white/20 block uppercase mb-1">Message Body</span>
                <p className="text-[11px] text-white/80 leading-relaxed whitespace-pre-wrap">{script.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
