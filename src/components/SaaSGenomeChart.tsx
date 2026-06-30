import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { SaaSGenome } from '../types';
import { motion } from 'motion/react';

interface SaaSGenomeChartProps {
  genome: SaaSGenome;
}

export const SaaSGenomeChart: React.FC<SaaSGenomeChartProps> = ({ genome }) => {
  const data = [
    { subject: 'Demand', A: genome.demandScore, fullMark: 100 },
    { subject: 'Difficulty', A: genome.difficultyScore, fullMark: 100 },
    { subject: 'Monetization', A: genome.monetizationScore, fullMark: 100 },
    { subject: 'Retention', A: genome.retentionPrediction, fullMark: 100 },
    { subject: 'Virality', A: genome.viralityScore, fullMark: 100 },
    { subject: 'Founder Fit', A: genome.founderFitScore, fullMark: 100 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="h-[400px] w-full bg-black/40 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-6">
          <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em]">Genetic SaaS Profile</h3>
          <p className="text-[8px] text-white/20 font-mono uppercase">Neural Decomposition Complete</p>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#ffffff10" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 700 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="SaaS Genome"
              dataKey="A"
              stroke="var(--brand-primary)"
              fill="var(--brand-primary)"
              fillOpacity={0.2}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {genome.insights.map((insight, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 group hover:border-brand-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <span className="text-[8px] font-bold text-white uppercase tracking-widest">Genetic Marker {i + 1}</span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed italic">"{insight}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
