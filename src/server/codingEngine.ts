import { GoogleGenAI } from "@google/genai";
import { AGENT_DEFINITIONS } from "./agents";

export interface CodingFile {
  path: string;
  language: string;
  content: string;
  explanation?: string;
}

export interface CodingResponse {
  implementationPlan: string;
  files: CodingFile[];
  complexity: number;
  decision: "PROCEED" | "REVISE" | "REJECT";
}

export class CodingEngine {
  private ai: any;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  private routeToModel(tier: string): string {
    if (tier === 'premium') return 'gemini-1.5-pro';
    return 'gemini-1.5-flash';
  }

  async steerCoding(input: string, currentFiles: CodingFile[], tier: string): Promise<CodingResponse> {
    const modelName = this.routeToModel(tier);
    const definition = AGENT_DEFINITIONS['Developer'];
    
    const model = this.ai.getGenerativeModel({ 
      model: modelName,
      systemInstruction: definition.systemInstruction
    });

    const prompt = `
      User Instruction: ${input}
      
      Current File Structure and Content:
      ${JSON.stringify(currentFiles, null, 2)}
      
      Tasks:
      1. Analyze the user instruction and the current state of the code.
      2. If the user wants to add a feature, modify an existing one, or fix a bug, generate the necessary changes.
      3. Provide the FULL content for any modified or new files.
      4. Ensure all code is production-ready, type-safe, and follows best practices for React/TypeScript/Tailwind.
      5. Include an implementation plan explaining what was changed and why.
      
      Always return the files in the requested schema.
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: definition.responseSchema
        }
      });

      const text = result.response.text();
      return JSON.parse(text) as CodingResponse;
    } catch (error) {
      console.error("[CodingEngine] Error during steering:", error);
      throw error;
    }
  }
}
