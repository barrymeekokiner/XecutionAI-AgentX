import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ChevronRight,
  Globe,
  Lock,
  Cpu,
  Layout,
  Workflow
} from 'lucide-react';
import { MarketplaceItem } from '../types';

export const SaaSMarketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: '1',
      type: 'template',
      name: 'Ultra-SaaS FinTech Starter',
      description: 'Fully integrated Stripe, Plaid, and multi-currency support with custom dashboard.',
      price: 199,
      creatorId: 'c1',
      creatorName: 'NeoArchitect',
      rating: 4.9,
      reviewsCount: 128,
      tags: ['fintech', 'stripe', 'dashboard'],
      sales: 450,
      revenueShare: 15
    },
    {
      id: '2',
      type: 'agent',
      name: 'Market Intelligence Swarm',
      description: 'A cluster of 5 specialized agents that scrape, analyze, and predict market trends.',
      price: 49,
      creatorId: 'c2',
      creatorName: 'AgenticLabs',
      rating: 4.8,
      reviewsCount: 89,
      tags: ['ai', 'research', 'automation'],
      sales: 1200,
      revenueShare: 10
    },
    {
      id: '3',
      type: 'workflow',
      name: 'Zero-Touch Liquidity Funnel',
      description: 'Autonomous workflow that connects marketplace scrapers to liquidity extraction engines.',
      price: 299,
      creatorId: 'c3',
      creatorName: 'LiquidityPro',
      rating: 5.0,
      reviewsCount: 42,
      tags: ['liquidity', 'workflow', 'advanced'],
      sales: 210,
      revenueShare: 20
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'template' | 'agent' | 'workflow'>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-primary">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Neural Marketplace</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            Acquire <span className="text-brand-primary">Assets</span>. Scale <span className="text-brand-secondary">Visions</span>.
          </h1>
          <p className="text-white/40 max-w-xl text-sm leading-relaxed">
            The global repository for verified SaaS templates, autonomous agents, and enterprise-grade liquidity workflows. Built for high-velocity acquisition.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text"
              placeholder="Search assets, tags, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-brand-primary/50 focus:bg-white/10 transition-all outline-none"
            />
          </div>
          <button className="bg-brand-primary text-black px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
            Publish Asset
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'template', 'agent', 'workflow'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeFilter === filter 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-brand-primary/30 transition-all hover:shadow-2xl hover:shadow-brand-primary/5 relative overflow-hidden"
            >
              {/* Type Badge */}
              <div className="absolute top-6 right-6">
                <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                  item.type === 'template' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  item.type === 'agent' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                }`}>
                  {item.type === 'template' && <Layout className="w-3 h-3" />}
                  {item.type === 'agent' && <Cpu className="w-3 h-3" />}
                  {item.type === 'workflow' && <Workflow className="w-3 h-3" />}
                  {item.type}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ID: {item.id}</span>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="text-[10px] font-mono text-brand-primary font-bold">{item.sales} Sales</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{item.name}</h3>
                </div>

                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed min-h-[40px]">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/40 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest block">Investment</span>
                    <span className="text-2xl font-bold text-white font-mono">${item.price}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1 text-brand-primary justify-end">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold font-mono">{item.rating}</span>
                    </div>
                    <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest block">{item.reviewsCount} Reviews</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2">
                    Preview
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button className="flex-1 bg-brand-primary/10 hover:bg-brand-primary border border-brand-primary/20 hover:border-brand-primary py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-black transition-all flex items-center justify-center gap-2">
                    License
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white/40">{item.creatorName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-white/60 truncate">{item.creatorName}</span>
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-brand-secondary" />
                    <span className="text-[9px] font-bold text-brand-secondary uppercase">{item.revenueShare}% Share</span>
                  </div>
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full group-hover:bg-brand-primary/10 transition-all" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trust Bar */}
      <div className="pt-12 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Lock, label: 'Secure Transaction', desc: 'Neural-escrow enabled' },
            { icon: ShieldCheck, label: 'Verified Creators', desc: 'Identity & code verified' },
            { icon: Zap, label: 'Instant Deploy', desc: 'Sync directly to your OS' },
            { icon: Globe, label: 'Global Licensing', desc: 'Universal usage rights' },
          ].map((feature, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-white/40" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{feature.label}</h4>
                <p className="text-[10px] text-white/30 font-mono">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
