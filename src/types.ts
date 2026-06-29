export type ThemeType = 'neon' | 'solaris' | 'arctic' | 'crimson' | 'emerald' | 'monochrome';

export interface AgentLog {
  id: string;
  timestamp: number;
  agent: 'ORCHESTRATOR' | 'LIQUIDITY' | 'DEVELOPER' | 'SRE' | 'COMPRESSOR' | 'SYSTEM' | 'MARKETING';
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface LiquidityAsset {
  asset: string;
  classification: string;
  platform: string;
  priceTiers: string;
  // Numerical metrics for sorting and charting
  speedScore: number; // 1-10
  valueScore: number; // 1-10
  marketValue: number;
  flashValue: number;
  maxExtraction: number;
}

export interface OutreachScript {
  subject: string;
  body: string;
  target: string;
}

export interface LiquidityPlan {
  assetTable: LiquidityAsset[];
  marketMap: string;
  executionSequence: string[];
  executionTimes: number[]; // Days per step
  outreachScripts: OutreachScript[];
}

export interface SaaSBuildPlan {
  architecture: string;
  codeScaffold: string;
  dbSchema: string;
  stripeFlow: string;
  deploymentScript: string;
}

export interface RiskReportData {
  vulnerabilities: string[];
  bottlenecks: string[];
  failurePoints: string[];
}

export interface VibePrompt {
  id: string;
  phase: string;
  content: string;
  isCompleted: boolean;
}

export interface MarketingStrategy {
  marketplaceOptimization: string;
  seoKeywords: string[];
  conversionFunnel: string[];
  analyticsPayload: string;
}

export interface ExecutionResult {
  id: string;
  timestamp: number;
  input: string;
  mode: string;
  actualizedCashout?: number;
  liquidityPlan?: LiquidityPlan;
  saasBuildPlan?: SaaSBuildPlan;
  saasBlueprint?: {
    systemPrompt: string;
    vibePrompts: VibePrompt[];
  };
  marketingStrategy?: MarketingStrategy;
  riskReport: RiskReportData;
  fastActionChecklist: string[];
  agentLogs: AgentLog[];
  metrics?: {
    estimatedTokens: number;
    latencyMs: number;
  };
}
