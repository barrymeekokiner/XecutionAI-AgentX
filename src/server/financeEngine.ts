import { GoogleGenAI, Type } from "@google/genai";
import { FinancialProjection } from "../types";

export class FinanceEngine {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  async generateFinancials(input: string, mode: string = 'saas'): Promise<FinancialProjection> {
    const schema = {
      type: Type.OBJECT,
      properties: {
        mrr: { type: Type.NUMBER, description: "Monthly Recurring Revenue in USD" },
        arr: { type: Type.NUMBER, description: "Annual Recurring Revenue in USD" },
        cac: { type: Type.NUMBER, description: "Customer Acquisition Cost" },
        ltv: { type: Type.NUMBER, description: "Lifetime Value" },
        churn: { type: Type.NUMBER, description: "Monthly Churn rate (0-100)" },
        growthRate: { type: Type.NUMBER, description: "Month-over-month growth rate (0-100)" },
        breakEvenMonths: { type: Type.NUMBER, description: "Months to break even" },
        investorScore: { type: Type.NUMBER, description: "Overall investability score (0-100)" },
        riskAssessment: { type: Type.STRING, description: "Brief financial risk assessment" }
      },
      required: ["mrr", "arr", "cac", "ltv", "churn", "growthRate", "breakEvenMonths", "investorScore", "riskAssessment"]
    };

    const prompt = `Analyze financial viability and project unit economics for: "${input}" (Mode: ${mode}).
    Provide conservative yet realistic SaaS metrics.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash-8b",
      contents: prompt,
      config: {
        systemInstruction: "You are the Neural Financial Engine. You specialize in predicting SaaS unit economics and investor-ready financial outcomes based on product descriptions and market dynamics.",
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text || '{}');
  }
}
