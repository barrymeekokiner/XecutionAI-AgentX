import { z } from 'zod';

export const analyzePlanSchema = z.object({
  plan: z.any(),
  context: z.string().optional(),
});

export const marketAnalyzeSchema = z.object({
  query: z.string().min(3),
  tier: z.enum(['free', 'standard', 'premium']).optional(),
});

export const financialSimulateSchema = z.object({
  input: z.string().min(3),
  mode: z.string().optional(),
});

export const saasGenomeSchema = z.object({
  input: z.string().min(3),
  mode: z.string().optional(),
});

export const executeStreamSchema = z.object({
  input: z.string().min(3),
  mode: z.enum(['saas', 'liquidity', 'both']).optional(),
});

export const upgradeSchema = z.object({
  tier: z.enum(['standard', 'premium']),
});
