import { GoogleGenAI, Type } from "@google/genai";

export class MarketEngine {
  private ai: any;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeMarket(query: string, tier: string = 'free') {
    const modelName = tier === 'premium' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const model = this.ai.getGenerativeModel({ 
      model: modelName,
      systemInstruction: "You are the Market Intelligence Engine. Your goal is to provide deep, data-driven analysis of SaaS markets."
    });

    const schema = {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.NUMBER },
        scoringBreakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              factor: { type: Type.STRING },
              score: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              justification: { type: Type.STRING }
            }
          }
        },
        trends: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              trend: { type: Type.STRING },
              momentum: { type: Type.NUMBER },
              sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"] },
              source: { type: Type.STRING }
            }
          }
        },
        competitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              marketShare: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              pricing: { type: Type.STRING }
            }
          }
        },
        revenuePotential: {
          type: Type.OBJECT,
          properties: {
            low: { type: Type.STRING },
            target: { type: Type.STRING },
            high: { type: Type.STRING },
            timeToFirstDollar: { type: Type.STRING }
          }
        },
        recommendation: { type: Type.STRING }
      }
    };

    const prompt = `Perform a comprehensive market analysis for: "${query}".
    1. Score the opportunity across multiple factors (Market Size, Saturation, Ease of Entry, etc).
    2. Identify 3 key trends with momentum scores.
    3. Analyze 3 major competitors.
    4. Estimate revenue tiers.
    5. Provide a final strategic recommendation.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      query,
      ...JSON.parse(result.response.text())
    };
  }
}
