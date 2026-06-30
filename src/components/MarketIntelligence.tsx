import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Sword, 
  DollarSign, 
  Hammer, 
  Search,
  MessageSquare,
  Globe,
  Github,
  AlertCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { MarketIntelligence as MarketIntelligenceType } from '../types';

interface MarketIntelligenceProps {
  data: MarketIntelligenceType;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Opportunity Score */}
        <div className="bg-brand-secondary/5 border border-brand-secondary/20 p-8 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
             <BarChart3 className="w-24 h-24" />
           </div>
           <div className="relative z-10 space-y-4">
             <h3 className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.3em] flex items-center gap-2">
               <Zap className="w-4 h-4" />
               Opportunity Score
             </h3>
             <div className="flex items-baseline gap-2">
               <span className="text-6xl font-black font-mono tracking-tighter text-white">{data.opportunityScore}</span>
               <span className="text-white/20 font-mono text-xl">/100</span>
             </div>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${data.opportunityScore}%` }}
                 className="h-full bg-brand-secondary shadow-[0_0_15px_rgba(var(--brand-secondary-rgb),0.5)]"
               />
             </div>
           </div>
        </div>

        {/* Market Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-brand-primary/10 rounded-lg">
                 <Globe className="w-4 h-4 text-brand-primary" />
               </div>
               <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Market Focus</h4>
             </div>
             <p className="text-xl font-bold text-white tracking-tight">{data.market}</p>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <p className="text-[8px] text-white/20 uppercase font-bold">Demand</p>
                 <p className="text-xs text-brand-secondary font-mono uppercase">{data.demand}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[8px] text-white/20 uppercase font-bold">Competition</p>
                 <p className="text-xs text-brand-alert font-mono uppercase">{data.competition}</p>
               </div>
             </div>
           </div>

           <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-brand-secondary/10 rounded-lg">
                 <DollarSign className="w-4 h-4 text-brand-secondary" />
               </div>
               <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Revenue Potential</h4>
             </div>
             <p className="text-2xl font-black font-mono text-white tracking-tighter">{data.estimatedARR}</p>
             <div className="flex items-center gap-2 text-[9px] text-white/20 uppercase font-bold">
               <Hammer className="w-3 h-3" />
               Build Difficulty: {data.buildDifficulty}/10
             </div>
           </div>
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <Search className="w-4 h-4 text-brand-secondary" />
            Grounding Intelligence Feed
          </h3>
          
          <div className="space-y-4">
            <IntelligenceCard 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="Reddit Sentiment" 
              content={data.insights.reddit} 
              color="text-[#FF4500]"
            />
            <IntelligenceCard 
              icon={<TrendingUp className="w-4 h-4" />} 
              label="Product Hunt Trends" 
              content={data.insights.productHunt} 
              color="text-[#DA552F]"
            />
            <IntelligenceCard 
              icon={<Github className="w-4 h-4" />} 
              label="OSS Market Activity" 
              content={data.insights.githubTrends} 
              color="text-white"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <Sword className="w-4 h-4 text-brand-alert" />
            Competitive Landscape
          </h3>
          
          <div className="space-y-4">
             <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
               <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Competitors</h4>
               <p className="text-xs text-white/70 leading-relaxed font-mono">{data.insights.competitors}</p>
             </div>
             
             <div className="bg-brand-alert/5 border border-brand-alert/10 p-6 rounded-2xl space-y-4">
               <div className="flex items-center gap-2 text-brand-alert">
                 <AlertCircle className="w-4 h-4" />
                 <h4 className="text-[10px] font-bold uppercase tracking-widest">Critical Pain Points</h4>
               </div>
               <p className="text-xs text-white/70 leading-relaxed font-mono">{data.insights.complaints}</p>
             </div>

             <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-4">
               <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Search Volume Analysis</h4>
               <p className="text-xs text-white/70 leading-relaxed font-mono">{data.insights.googleTrends}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntelligenceCard = ({ icon, label, content, color }: { icon: any, label: string, content: string, color: string }) => (
  <div className="bg-black/40 border border-white/5 p-5 rounded-2xl flex gap-4 hover:border-white/10 transition-colors group">
    <div className={`shrink-0 p-3 bg-white/5 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{label}</p>
      <p className="text-xs text-white/80 leading-relaxed font-mono">{content}</p>
    </div>
  </div>
);
