import { GoogleGenAI, Type } from "@google/genai";
import { SaaSGenome } from "../types";

export class GenomeEngine {
  private ai: any;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateGenome(input: string, mode: string = 'saas'): Promise<SaaSGenome> {
    const model = this.ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the SaaS Genome Engine. You decompose product ideas into their core genetic markers: Demand, Difficulty, Monetization, Retention, Virality, and Founder Fit."
    });

    const schema = {
      type: Type.OBJECT,
      properties: {
        demandScore: { type: Type.NUMBER },
        difficultyScore: { type: Type.NUMBER },
        monetizationScore: { type: Type.NUMBER },
        retentionPrediction: { type: Type.NUMBER },
        viralityScore: { type: Type.NUMBER },
        founderFitScore: { type: Type.NUMBER },
        insights: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["demandScore", "difficultyScore", "monetizationScore", "retentionPrediction", "viralityScore", "founderFitScore", "insights"]
    };

    const prompt = `Analyze the SaaS Genome for: "${input}" (Mode: ${mode}).
    Provide specific scores from 0-100 for each marker.
    Include 3 critical genetic insights.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(result.response.text());
  }
}
