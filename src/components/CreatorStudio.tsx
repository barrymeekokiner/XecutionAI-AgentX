import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star,
  Layout, 
  Cpu, 
  Workflow, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Package,
  Globe,
  PieChart,
  Target,
  Clock
} from 'lucide-react';
import { MarketplaceItem } from '../types';

export const CreatorStudio: React.FC = () => {
  // Mock Published Items
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: '1',
      type: 'template',
      name: 'Ultra-SaaS FinTech Starter',
      description: 'Fully integrated Stripe, Plaid, and multi-currency support.',
      price: 199,
      creatorId: 'u1',
      creatorName: 'NeoArchitect',
      rating: 4.9,
      reviewsCount: 128,
      tags: ['fintech', 'stripe'],
      sales: 450,
      revenueShare: 15
    }
  ]);

  const stats = {
    totalRevenue: 89550,
    activeLicenses: 450,
    avgRating: 4.9,
    reach: 12500
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-secondary">
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Creator Portfolio</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            Creator <span className="text-brand-secondary">Studio</span>
          </h1>
          <p className="text-white/40 max-w-xl text-sm leading-relaxed">
            Manage your high-performance AI assets, track licensing revenue, and optimize your venture acquisition strategies.
          </p>
        </div>

        <button className="bg-brand-secondary text-black px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-secondary/20">
          <Plus className="w-5 h-5" />
          Publish New Asset
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: DollarSign, color: 'brand-primary' },
          { label: 'Active Licenses', value: stats.activeLicenses, trend: '+8.2%', icon: Package, color: 'brand-secondary' },
          { label: 'Portfolio Rating', value: stats.avgRating, trend: 'Top 1%', icon: StarIcon, color: 'orange-400' },
          { label: 'Network Reach', value: stats.reach.toLocaleString(), trend: '+24%', icon: Globe, color: 'blue-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest block">{stat.label}</span>
              <h3 className="text-2xl font-bold text-white font-mono">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Published Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Active Portfolio</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                <Layout className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                <PieChart className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-brand-secondary/30 transition-all group">
                <div className="w-full md:w-48 aspect-video bg-white/5 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-all shrink-0">
                  {item.type === 'template' && <Layout className="w-12 h-12 text-blue-400 opacity-20" />}
                  {item.type === 'agent' && <Cpu className="w-12 h-12 text-purple-400 opacity-20" />}
                  {item.type === 'workflow' && <Workflow className="w-12 h-12 text-orange-400 opacity-20" />}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white text-black p-3 rounded-full shadow-2xl">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                          item.type === 'template' ? 'bg-blue-500/10 text-blue-400' :
                          item.type === 'agent' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                          {item.type}
                        </span>
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <span className="text-[10px] font-mono text-white/20">ID: {item.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/5 rounded-lg text-red-500/20 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Sales', value: item.sales, icon: TrendingUp },
                      { label: 'List Price', value: `$${item.price}`, icon: DollarSign },
                      { label: 'Rev. Share', value: `${item.revenueShare}%`, icon: PieChart },
                      { label: 'Rating', value: item.rating, icon: StarIcon }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-white/20 uppercase font-bold">{stat.label}</span>
                          <stat.icon className="w-3 h-3 text-white/20" />
                        </div>
                        <span className="text-sm font-bold text-white font-mono">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics & Insights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-brand-secondary/5 to-transparent border border-white/10 rounded-2xl p-6 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Creator Insights</h3>
                <TrendingUp className="w-4 h-4 text-brand-secondary" />
             </div>

             <div className="space-y-4">
               {[
                 { label: 'Market Demand', value: 'High', color: 'text-brand-primary' },
                 { label: 'Conversion Rate', value: '4.2%', color: 'text-white' },
                 { label: 'Avg. Churn', value: '2.1%', color: 'text-brand-secondary' },
                 { label: 'SEO Visibility', value: '89%', color: 'text-brand-primary' }
               ].map((insight, i) => (
                 <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase">
                   <span className="text-white/20 tracking-widest">{insight.label}</span>
                   <span className={`${insight.color} font-mono`}>{insight.value}</span>
                 </div>
               ))}
             </div>

             <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-white/30 italic leading-relaxed">
                  "SaaS FinTech Starter is currently trending in #fintech. Consider increasing the price by 15%."
                </p>
             </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Payout Schedule</h3>
                <Clock className="w-4 h-4 text-white/20" />
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs text-white">15</div>
                   <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-white uppercase">Next Payout</h4>
                      <p className="text-[10px] text-white/20 font-mono">Est. $12,450.00</p>
                   </div>
                </div>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all">
                   View Transaction History
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <Star className={className} fill="currentColor" />
);
