export type ThemeType = 'neon' | 'solaris' | 'arctic' | 'crimson' | 'emerald' | 'monochrome';

export interface SaaSGenome {
  demandScore: number;
  difficultyScore: number;
  monetizationScore: number;
  retentionPrediction: number;
  viralityScore: number;
  founderFitScore: number;
  insights: string[];
}

export interface AgentPerformanceMetrics {
  role: string;
  avgResponseTime: number;
  successRate: number;
  errorRate: number;
  decisionFrequency: number;
  activeTasks: number;
}

export interface AgentMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: number;
  marker?: 'consensus' | 'conflict' | 'neutral';
  reasoning?: string;
  metadata?: any;
}

export interface AgentStatus {
  status: 'idle' | 'thinking' | 'working' | 'paused';
  load: number; // 0 to 100
  lastActive: number;
}

export type AgentRole = 'CEO' | 'CTO' | 'Growth' | 'Finance' | 'Security' | 'Investor' | 'MarketResearch' | 'MARKETING' | 'ORCHESTRATOR' | 'DEVELOPER' | 'SRE' | 'COMPRESSOR' | 'SYSTEM';

export interface MarketplaceItem {
  id: string;
  type: 'template' | 'agent' | 'workflow';
  name: string;
  description: string;
  price: number;
  creatorId: string;
  creatorName: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  thumbnailUrl?: string;
  sales: number;
  revenueShare: number; // percentage
}

export interface CreatorProfile {
  uid: string;
  displayName: string;
  bio: string;
  totalSales: number;
  totalRevenue: number;
  rating: number;
  publishedItems: string[];
}

export interface TeamMember {
  uid: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: number;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  memberUids: string[];
  members: TeamMember[];
  billingTier: 'standard' | 'premium' | 'enterprise';
  billingDetails?: {
    interval: 'month' | 'year';
    seats: number;
    status: 'active' | 'past_due' | 'canceled';
    nextBillingDate: number;
  };
  whiteLabelConfig?: {
    logo?: string;
    primaryColor?: string;
    domain?: string;
    companyName?: string;
  };
  usageHistory: {
    month: string;
    executions: number;
    tokens: number;
    cost: number;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  actor: {
    uid: string;
    email: string;
  };
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ApiKeyConfig {
  id: string;
  key: string;
  status: 'active' | 'rate_limited' | 'expired';
  lastUsed: number;
  usageCount: number;
}

export interface UsageQuota {
  executions: {
    current: number;
    limit: number;
  };
  storage: {
    current: number;
    limit: number;
  };
  apiCalls: {
    current: number;
    limit: number;
  };
  tokens: {
    current: number;
    limit: number;
  };
  projectedCost: number;
}

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

export interface SaaSGenome {
  dna: {
    painLevel: number;
    virality: number;
    retention: number;
    monetization: number;
  };
  coreLoop: {
    steps: string[];
    description: string;
  };
  growthPattern: string;
}

export interface CouncilOpinion {
  role: 'CEO' | 'CTO' | 'Growth' | 'Finance' | 'Security' | 'Investor';
  opinion: string;
  decision: 'PROCEED' | 'REVISE' | 'REJECT';
}

export interface RevenueProjection {
  months: {
    month: string;
    users: number;
    mrr: number;
  }[];
  metrics: {
    cac: string;
    ltv: string;
    paybackPeriod: string;
  };
}

export interface MarketIntelligence {
  opportunityScore: number;
  market: string;
  demand: string;
  competition: string;
  estimatedARR: string;
  buildDifficulty: number;
  insights: {
    reddit: string;
    productHunt: string;
    googleTrends: string;
    githubTrends: string;
    competitors: string;
    complaints: string;
  };
}

export interface MarketScoreDetail {
  factor: string;
  score: number;
  weight: number;
  justification: string;
}

export interface TrendIndicator {
  trend: string;
  momentum: number; // 0 to 1
  sentiment: 'positive' | 'neutral' | 'negative';
  source: string;
}

export interface CompetitorDetail {
  name: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
}

export interface MarketIntelligenceEngineReport {
  id: string;
  timestamp: number;
  query: string;
  overallScore: number;
  scoringBreakdown: MarketScoreDetail[];
  trends: TrendIndicator[];
  competitors: CompetitorDetail[];
  revenuePotential: {
    low: string;
    target: string;
    high: string;
    timeToFirstDollar: string;
  };
  recommendation: string;
}

export interface FinancialProjection {
  mrr: number;
  arr: number;
  cac: number;
  ltv: number;
  churn: number;
  growthRate: number;
  breakEvenMonths: number;
  investorScore: number;
  riskAssessment: string;
}

export interface ExecutionResult {
  id: string;
  timestamp: number;
  input: string;
  mode: string;
  teamId?: string;
  actualizedCashout?: number;
  liquidityPlan?: LiquidityPlan;
  saasBuildPlan?: SaaSBuildPlan;
  marketIntelligence?: MarketIntelligence;
  saasGenome?: SaaSGenome;
  councilDebate?: CouncilOpinion[];
  revenueProjection?: RevenueProjection;
  financialSimulation?: FinancialProjection;
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

export interface AppSettings {
  apiKey: string;
  model: string;
  autoRefine: boolean;
  persistenceMode: 'local' | 'cloud';
  tier: 'free' | 'standard' | 'premium' | 'enterprise';
  customSystemInstruction?: string;
  // New settings
  verbosity: 'minimal' | 'balanced' | 'comprehensive';
  neuralIntensity: number; // 0-100
  experimentalFeatures: boolean;
  autoSequencing: boolean;
  autoScaling: boolean;
  gpuThreshold: number;
  computeThreshold: number;
  // Custom persistent thresholds
  customCpuThreshold?: number;
  customMemoryThreshold?: number;
  manualAgentOverride: boolean;
  activeTeamId?: string;
}

export interface ResourceMetric {
  timestamp: number;
  cpu: number;
  memory: number;
  efficiency: number;
  buildId: string;
}

export interface SystemAlert {
  id: string;
  type: 'cpu' | 'memory' | 'gpu' | 'compute';
  message: string;
  timestamp: number;
  isRead: boolean;
}

export interface TelemetryLog {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
}

export interface NeuralSimulationResult {
  probabilityOfSuccess: number; // 0-100
  simulatedTimeframe: string;
  criticalFailurePath: string;
  recommendedPivot: string;
  marketAlignmentScore: number;
  revenueProjection: {
    low: number;
    median: number;
    high: number;
  };
}

export interface PersonaPreset {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
}

export interface SimulationResult {
  personaId: string;
  personaName: string;
  result: ExecutionResult;
  timestamp: number;
}
