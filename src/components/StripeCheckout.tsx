import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Zap, CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const stripePromise = loadStripe('pk_test_placeholder'); // In a real app, this would be an env var

interface StripeCheckoutProps {
  tier: 'standard' | 'premium';
  onSuccess: (tier: string) => void;
  onCancel: () => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ tier, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // In a real implementation, this would call your backend to create a Checkout Session
    // For this prototype, we simulate a successful checkout after a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    onSuccess(tier);
  };

  const details = {
    standard: {
      price: '$49/mo',
      features: ['100 Executions/mo', 'Priority Neural Tunnel', 'Standard Model Access', 'Email Support']
    },
    premium: {
      price: '$199/mo',
      features: ['Unlimited Executions', 'Ultra-Low Latency', 'All Premium Models', '24/7 Priority Support', 'Custom Persona Library']
    }
  };

  const current = details[tier];

  return (
    <div className="bg-black/90 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <CreditCard className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-black">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">XecutionAI {tier}</h3>
            <p className="text-brand-primary font-mono text-sm">{current.price}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {current.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
              <span className="text-xs text-white/60 uppercase tracking-widest">{f}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center gap-4">
          <Shield className="w-5 h-5 text-brand-secondary" />
          <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
            Secure encryption via Stripe. Your data is protected by enterprise-grade security protocols.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-brand-primary text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:shadow-[0_0_20px_#00ff9d] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm Upgrade
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
