import { Type } from "@google/genai";

export type AgentRole = 'CEO' | 'CTO' | 'Growth' | 'Finance' | 'Security' | 'MarketResearch' | 'Legal' | 'Compliance' | 'Operations';

export interface AgentDefinition {
  role: AgentRole;
  name: string;
  systemInstruction: string;
  responseSchema: any;
}

export const AGENT_DEFINITIONS: Record<AgentRole, AgentDefinition> = {
  CEO: {
    role: 'CEO',
    name: 'Visionary Strategist',
    systemInstruction: `You are the CEO Agent. Your goal is to ensure product-market fit and overall vision alignment. 
    Focus on high-level strategy, competitive positioning, and long-term viability. 
    You prioritize speed-to-market and perceived user value.`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        strategicAlignment: { type: Type.STRING },
        visionScore: { type: Type.NUMBER },
        keyMilestones: { type: Type.ARRAY, items: { type: Type.STRING } },
        decision: { type: Type.STRING, enum: ["PROCEED", "REVISE", "REJECT"] }
      }
    }
  },
  CTO: {
    role: 'CTO',
    name: 'Technical Architect',
    systemInstruction: `You are the CTO Agent. You evaluate technical feasibility, architectural integrity, and scalability.
    Identify technical debt risks, stack recommendations, and infrastructure bottlenecks.
    You are critical of "hype-driven" tech and prioritize stability.`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        technicalFeasibility: { type: Type.STRING },
        stackRecommendation: { type: Type.ARRAY, items: { type: Type.STRING } },
        architectureRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        decision: { type: Type.STRING, enum: ["PROCEED", "REVISE", "REJECT"] }
      }
    }
  },
  Growth: {
    role: 'Growth',
    name: 'Virality Engine',
    systemInstruction: `You are the Growth Agent. Your obsession is user acquisition, retention, and viral coefficients.
    Design PLG (Product Led Growth) loops and referral mechanisms. 
    Identify acquisition channels and predicted CAC.`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        growthLoops: { type: Type.ARRAY, items: { type: Type.STRING } },
        acquisitionChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
        predictedVirality: { type: Type.NUMBER },
        decision: { type: Type.STRING, enum: ["PROCEED", "REVISE", "REJECT"] }
      }
    }
  },
  Finance: {
    role: 'Finance',
    name: 'Margin Protector',
    systemInstruction: `You are the Finance Agent. You focus on unit economics, MRR projections, and burn rates.
    Evaluate monetization strategies, pricing tiers, and LTV/CAC ratios.
    You are the voice of caution regarding profitability.`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        monetizationModel: { type: Type.STRING },
        expectedMargins: { type: Type.NUMBER },
        revenueRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        decision: { type: Type.STRING, enum: ["PROCEED", "REVISE", "REJECT"] }
      }
    }
  },
  Security: {
    role: 'Security',
    name: 'Risk Shield',
    systemInstruction: `You are the Security Agent. You identify vulnerabilities, data privacy concerns, and compliance risks (GDPR, SOC2).
    Focus on authentication flaws, API security, and data encryption.
    You will block builds if major security holes exist.`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        securityPosture: { type: Type.STRING },
        vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        complianceRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
        decision: { type: Type.STRING, enum: ["PROCEED", "REVISE", "REJECT"] }
      }
    }
  },
  MarketResearch: {
    role: 'MarketResearch',
    name: 'Market Grounder',
    systemInstruction: `You are the Market Research Agent. You provide real-world data and competitive landscape analysis.
    Identify existing incumbents, market gaps, and user pain points.
    Your job is to keep the council grounded in reality.`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        marketSize: { type: Type.STRING },
        competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
        marketGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        decision: { type: Type.STRING, enum: ["PROCEED", "REVISE", "REJECT"] }
      }
    }
  },
  Legal: {
    role: 'Legal',
    name: 'Jurisprudence Oracle',
    systemInstruction: "You are the Legal Agent. Analyze licensing terms, intellectual property protection, and marketplace transaction security.",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        opinion: { type: Type.STRING },
        riskLevel: { type: Type.NUMBER },
        complianceCheck: { type: Type.BOOLEAN }
      },
      required: ["opinion", "riskLevel", "complianceCheck"]
    }
  },
  Compliance: {
    role: 'Compliance',
    name: 'Enterprise Guardian',
    systemInstruction: "You are the Compliance Agent. Ensure all generated SaaS architectures adhere to SOC2, GDPR, and enterprise security standards.",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        opinion: { type: Type.STRING },
        score: { type: Type.NUMBER },
        violations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["opinion", "score", "violations"]
    }
  },
  Operations: {
    role: 'Operations',
    name: 'Systems Architect',
    systemInstruction: "You are the Operations Agent. Focus on infrastructure scalability, white-labeling capability, and team orchestration efficiency.",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        opinion: { type: Type.STRING },
        scalabilityScore: { type: Type.NUMBER },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["opinion", "scalabilityScore", "recommendations"]
    }
  }
};
