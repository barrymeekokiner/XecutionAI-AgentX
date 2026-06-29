import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Stripe from 'stripe';

dotenv.config();

// Lazy Stripe Init
let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to get AI instance with optional custom key
const getAI = (req: express.Request) => {
  const customKey = req.headers["x-gemini-key"] as string;
  const customModel = req.headers["x-gemini-model"] as string || "gemini-3.1-flash";
  const userTier = req.headers["x-user-tier"] as string || "free";
  const customInstruction = req.headers["x-custom-instruction"] as string;

  // Tier-based model enforcement (for system key usage)
  let actualModel = customModel;
  
  if (!customKey) {
    // If using system key, restrict premium models to premium users
    if (userTier === 'free' && (customModel.includes('3.5') || customModel.includes('pro'))) {
      actualModel = "gemini-3.1-flash"; 
    }
  }

  const client = customKey ? new GoogleGenAI({ apiKey: customKey }) : ai;
  return { client, model: actualModel, customInstruction };
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Stripe API Routes ---
  
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const s = getStripe();
      if (!s) return res.status(503).json({ error: "Stripe not configured" });

      const { tier } = req.body;
      // In a real app, these would be your actual Stripe Price IDs
      const priceId = tier === 'premium' ? 'price_premium_id' : 'price_standard_id';
      
      const session = await s.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: tier === 'premium' ? 'XecutionAI AgentX Premium' : 'XecutionAI AgentX Standard',
                description: tier === 'premium' ? 'Unlock Gemini 3.5 & Ultra Models' : 'Enhanced Processing Limits',
              },
              unit_amount: tier === 'premium' ? 2900 : 1500, // $29.00 or $15.00
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/?upgrade=success&tier=${tier}`,
        cancel_url: `${req.headers.origin}/?upgrade=cancel`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- API Routes ---

  // Simple In-memory Quota Guard
  let isQuotaExhausted = false;
  let quotaResetTime = 0;

  const checkQuota = () => {
    if (isQuotaExhausted && Date.now() < quotaResetTime) {
      return false;
    }
    isQuotaExhausted = false;
    return true;
  };

  const handleQuotaError = (error: any) => {
    if (error.status === "RESOURCE_EXHAUSTED" || error.message?.toLowerCase().includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      isQuotaExhausted = true;
      // Exponentially backoff if already exhausted? For now, 60s is a good block
      quotaResetTime = Date.now() + 60000; 
    }
  };

  app.post("/api/verify", async (req, res) => {
    try {
      if (!checkQuota()) {
        return res.status(429).json({ error: "System gateway saturated. Retrying in 60s." });
      }
      const { client, model } = getAI(req);
      // Just try to list models or do a very small generation to verify
      await client.models.generateContent({
        model,
        contents: "ping",
        config: { maxOutputTokens: 1 }
      });
      res.json({ status: "ok", model });
    } catch (error: any) {
      console.error("Verification Error:", error);
      handleQuotaError(error);
      const status = error.status === "RESOURCE_EXHAUSTED" || error.message?.includes('Quota exceeded') ? 429 : 400;
      res.status(status).json({ error: error.message || "Verification failed" });
    }
  });

  app.get("/api/trends", async (req, res) => {
    try {
      if (!checkQuota()) throw new Error("Quota exceeded");
      
      const { client, model } = getAI(req);
      const systemInstruction = "You are the XecutionAI AgentX Core Intelligence. Your purpose is to identify high-value, non-obvious, and trending Micro-SaaS sectors or Liquidity asset classes for mid-2026. Focus on 'Alpha' opportunities—things that are just emerging but technically feasible. Vary the sectors significantly. Be extremely concise.";
      const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            value: { type: Type.STRING },
            mode: { type: Type.STRING } // 'liquidity' | 'saas' | 'both'
          },
          required: ["label", "value", "mode"]
        }
      };

      const response = await client.models.generateContent({
        model,
        contents: "Generate 8 unique, high-growth blueprints for 2026 execution. Include a mix of SaaS and Liquidation plays. Return as JSON array.",
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          tools: [{ googleSearch: {} }]
        }
      });

      const result = JSON.parse(response.candidates?.[0]?.content?.parts?.[0]?.text || "[]");
      res.json(result);
    } catch (error: any) {
      console.error("Trends Error:", error);
      handleQuotaError(error);
      const status = error.status === "RESOURCE_EXHAUSTED" || error.message?.includes('Quota exceeded') ? 429 : 500;
      // High-quality diversified fallback library
      const fallbacks = [
        { label: "AI Domain Portfolio", value: "ASSETS: 52 premium .ai domains. GOAL: Rapid flip.", mode: "liquidity" },
        { label: "GPU Lease Exit", value: "ACCESS: Unused H100 cluster capacity. GOAL: OTC lease-swap.", mode: "liquidity" },
        { label: "Deepfake Guard SaaS", value: "IDEA: Real-time deepfake detection API.", mode: "saas" },
        { label: "SaaS Micro-Acquisition", value: "ASSET: Stagnant CRM SaaS (1.2k users). GOAL: Relaunch with AI core.", mode: "both" },
        { label: "Voice AI Agent Dev", value: "IDEA: Healthcare voice agent for appointments. STACK: Daily + Vapi.", mode: "saas" },
        { label: "Patent Portfolio", value: "ASSET: 12 utility patents (Quantum crypto). GOAL: Strategic sale.", mode: "liquidity" },
        { label: "Compute Arbitrage", value: "ASSET: Reserved spot instances. GOAL: Sublease to training startups.", mode: "liquidity" },
        { label: "Legacy Migration AI", value: "IDEA: AI tool to convert COBOL/Legacy code to TypeScript.", mode: "saas" },
        { label: "Real Estate Vision", value: "IDEA: Automated virtual staging for empty property listings.", mode: "saas" },
        { label: "BioTech IP Play", value: "ASSET: CRISPR delivery patents. GOAL: Strategic Pharma licensing.", mode: "liquidity" }
      ];
      // Return 8 random items from fallbacks
      res.json(fallbacks.sort(() => Math.random() - 0.5).slice(0, 8));
    }
  });

  app.post("/api/refine", async (req, res) => {
    const { input } = req.body;
    if (!input) return res.json({ suggestions: [] });

    try {
      if (!checkQuota()) return res.json({ suggestions: [] });

      const { client, model } = getAI(req);
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                append: { type: Type.STRING }
              }
            }
          },
          detectedMode: { type: Type.STRING }
        },
        required: ["suggestions"]
      };

      const response = await client.models.generateContent({
        model,
        contents: `Analyze this input: "${input}". Provide 3-4 short refinement suggestions (e.g. "Add Stripe subscription logic") and detect if it sounds more like 'liquidity', 'saas', or 'both'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema
        }
      });

      res.json(JSON.parse(response.candidates?.[0]?.content?.parts?.[0]?.text || "{}"));
    } catch (error: any) {
      console.error("Refine Error:", error);
      handleQuotaError(error);
      res.json({ suggestions: [] });
    }
  });  // --- Autonomous Execution Endpoint (Streaming) ---
  app.post("/api/execute-stream", async (req, res) => {
    const { input, mode } = req.body;
    const type = mode || 'both';
    
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const startTime = Date.now();
    try {
      if (!checkQuota()) {
        return res.status(429).json({ error: "System gateway saturated. Neural sync required (60s)." });
      }

      const { client, model, customInstruction } = getAI(req);
      
      const systemInstruction = `
        You are XecutionAI AgentX, a fully autonomous one-click AI agent asset liquidity and SaaS creation studio.
        ${customInstruction ? `\nUSER OVERRIDE PERSONA: ${customInstruction}\n` : ""}
        You coordinate several specialized agents:
        1. MASTER ORCHESTRATOR: Parses input and routes to correct subsystems.
        2. LIQUIDITY INTELLIGENCE: Converts assets -> fastest cash pathways. Speed > Value.
        3. SOFTWARE ARCHITECT: Design high-scale micro-SaaS structures.
        4. SRE & RISK: Identifies failure points and security leaks.
        5. EXECUTION COMPRESSOR: Optimizes for minimal steps and maximum conversion speed.
        6. VIBE CODER: Generates a sequence of phased prompts for a user to issue to an AI coding assistant (like Gemini/Cursor) to build the app from scratch.
        7. MARKETING AGENT: Optimizes for marketplaces, traffic acquisition, SEO, and analytics setup.

        OBJECTIVE: Convert the provided input into an immediate execution plan. No theory.
        
        When in SAAS mode, you MUST include:
        - saasBlueprint: Technical build steps.
        - marketingStrategy: A detailed plan for launching and scaling.
          - marketplaceOptimization: How to list on Acquire.com, Product Hunt, etc.
          - seoKeywords: Top 10 high-intent keywords.
          - conversionFunnel: Steps to turn traffic into paying users.
        - systemPrompt: A specialized instruction for an AI assistant to "dress it" for the specific project.
        - vibePrompts: An array of 5-8 phased prompts. 
          - The FIRST prompt MUST be a "Full Blueprint" request that establishes the entire project architecture.
          - Subsequent prompts should guide the development step-by-step (e.g., "Phase 2: Authentication & Database", "Phase 3: Core Dashboard UI").
          - Each prompt should be actionable and detailed.
.
        
        For LIQUIDITY:
        - executionTimes: Provide estimated days for each step in executionSequence (must be same length).
        - outreachScripts: Create ready-to-copy email/message drafts for potential buyers/platforms.
        
        SCHEMA CONSTRAINTS:
        - Return valid JSON matching the schema.
        - liquidityPlan is NULL if mode is 'saas'.
        - saasBuildPlan and saasBlueprint are NULL if mode is 'liquidity'.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          liquidityPlan: {
            type: Type.OBJECT,
            properties: {
              assetTable: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    asset: { type: Type.STRING },
                    flashValue: { type: Type.NUMBER },
                    liquiditySpeed: { type: Type.STRING },
                    channel: { type: Type.STRING }
                  }
                }
              },
              executionSequence: { type: Type.ARRAY, items: { type: Type.STRING } },
              executionTimes: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              outreachScripts: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          saasBuildPlan: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              stack: { type: Type.ARRAY, items: { type: Type.STRING } },
              coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
              monetization: { type: Type.STRING },
              deploymentScript: { type: Type.STRING }
            }
          },
          saasBlueprint: {
            type: Type.OBJECT,
            properties: {
              systemPrompt: { type: Type.STRING },
              vibePrompts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    phase: { type: Type.STRING },
                    content: { type: Type.STRING },
                    isCompleted: { type: Type.BOOLEAN }
                  }
                }
              }
            }
          },
          marketingStrategy: {
            type: Type.OBJECT,
            properties: {
              marketplaceOptimization: { type: Type.STRING },
              seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              conversionFunnel: { type: Type.ARRAY, items: { type: Type.STRING } },
              analyticsPayload: { type: Type.STRING }
            }
          },
          riskReport: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              failurePoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          fastActionChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
          agentLogs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                agent: { type: Type.STRING },
                message: { type: Type.STRING },
                status: { type: Type.STRING },
                timestamp: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["riskReport", "fastActionChecklist", "agentLogs"]
      };

      const prompt = `
        USER INPUT: ${input}
        EXECUTION MODE: ${type}
        
        Generate the complete execution plan based on the agents' intelligence.
      `;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await client.models.generateContentStream({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });

      let fullText = "";
      for await (const chunk of stream) {
        const textChunk = chunk.text;
        fullText += textChunk;
        res.write(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`);
      }

      const latencyMs = Date.now() - startTime;
      const estimatedTokens = Math.ceil((prompt.length + fullText.length) / 3.8);

      res.write(`data: ${JSON.stringify({ 
        done: true, 
        metrics: { estimatedTokens, latencyMs } 
      })}\n\n`);
      res.end();

    } catch (error: any) {
      console.error("Gemini Streaming Error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message || "Failed to stream autonomous plan" })}\n\n`);
      res.end();
    }
  });

  app.post("/api/execute", async (req, res) => {
    const { type, input } = req.body; // type: 'liquidity' | 'saas' | 'both'
    
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const startTime = Date.now();
    try {
      if (!checkQuota()) {
        return res.status(429).json({ error: "System gateway saturated. Neural sync required (60s)." });
      }
      const { client, model, customInstruction } = getAI(req);
      // In a real multi-agent system, we'd have multiple calls. 
      // To keep it responsive and unified, we'll use a structured prompt that simulates the agents' collaboration.
      
      const systemInstruction = `
        You are XecutionAI AgentX, a fully autonomous one-click AI agent asset liquidity and SaaS creation studio.
        ${customInstruction ? `\nUSER OVERRIDE PERSONA: ${customInstruction}\n` : ""}
        You coordinate several specialized agents:
        1. MASTER ORCHESTRATOR: Parses input and routes to correct subsystems.
        2. LIQUIDITY INTELLIGENCE: Converts assets -> fastest cash pathways. Speed > Value.
        3. SOFTWARE ARCHITECT: Design high-scale micro-SaaS structures.
        4. SRE & RISK: Identifies failure points and security leaks.
        5. EXECUTION COMPRESSOR: Optimizes for minimal steps and maximum conversion speed.
        6. VIBE CODER: Generates a sequence of phased prompts for a user to issue to an AI coding assistant (like Gemini/Cursor) to build the app from scratch.
        7. MARKETING AGENT: Optimizes for marketplaces, traffic acquisition, SEO, and analytics setup.

        OBJECTIVE: Convert the provided input into an immediate execution plan. No theory.
        
        When in SAAS mode, you MUST include:
        - saasBlueprint: Technical build steps.
        - marketingStrategy: Detailed launch and scale plan.
          - marketplaceOptimization: How to list on Acquire.com, Product Hunt, etc.
          - seoKeywords: Top 10 high-intent keywords.
          - conversionFunnel: Steps to turn traffic into paying users.
        - systemPrompt: A specialized instruction for an AI assistant to "dress it" for the specific project.
        - vibePrompts: An array of 5-8 phased prompts.
        
        For LIQUIDITY:
        - executionTimes: Provide estimated days for each step in executionSequence (must be same length).
        - outreachScripts: Create ready-to-copy email/message drafts for potential buyers/platforms.
        - assetTable: Provide numerical estimates for flashValue (lowest), marketValue (mid), and maxExtraction (highest). Scores are 1-10.
        
        FORMAT: Return a JSON object matching the requested schema.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          liquidityPlan: {
            type: Type.OBJECT,
            properties: {
              assetTable: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    asset: { type: Type.STRING }, 
                    classification: { type: Type.STRING }, 
                    platform: { type: Type.STRING }, 
                    priceTiers: { type: Type.STRING },
                    speedScore: { type: Type.NUMBER },
                    valueScore: { type: Type.NUMBER },
                    marketValue: { type: Type.NUMBER },
                    flashValue: { type: Type.NUMBER },
                    maxExtraction: { type: Type.NUMBER }
                  } 
                } 
              },
              marketMap: { type: Type.STRING },
              executionSequence: { type: Type.ARRAY, items: { type: Type.STRING } },
              executionTimes: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              outreachScripts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    body: { type: Type.STRING },
                    target: { type: Type.STRING }
                  }
                }
              }
            }
          },
          saasBuildPlan: {
            type: Type.OBJECT,
            properties: {
              architecture: { type: Type.STRING },
              codeScaffold: { type: Type.STRING },
              dbSchema: { type: Type.STRING },
              stripeFlow: { type: Type.STRING },
              deploymentScript: { type: Type.STRING }
            }
          },
          saasBlueprint: {
            type: Type.OBJECT,
            properties: {
              systemPrompt: { type: Type.STRING },
              vibePrompts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    phase: { type: Type.STRING },
                    content: { type: Type.STRING },
                    isCompleted: { type: Type.BOOLEAN }
                  }
                }
              }
            }
          },
          marketingStrategy: {
            type: Type.OBJECT,
            properties: {
              marketplaceOptimization: { type: Type.STRING },
              seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              conversionFunnel: { type: Type.ARRAY, items: { type: Type.STRING } },
              analyticsPayload: { type: Type.STRING }
            }
          },
          riskReport: {
            type: Type.OBJECT,
            properties: {
              vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
              failurePoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          fastActionChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          agentLogs: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { agent: { type: Type.STRING }, message: { type: Type.STRING } } }
          }
        },
        required: ["riskReport", "fastActionChecklist", "agentLogs"]
      };

      const prompt = `
        USER INPUT: ${input}
        EXECUTION MODE: ${type}
        
        Generate the complete execution plan based on the agents' intelligence.
      `;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const result = JSON.parse(text);
      
      const latencyMs = Date.now() - startTime;
      const estimatedTokens = Math.ceil((prompt.length + text.length) / 3.8); // Rough heuristic

      res.json({
        ...result,
        metrics: {
          estimatedTokens,
          latencyMs
        }
      });

    } catch (error: any) {
      console.error("Gemini Execution Error:", error);
      res.status(500).json({ error: error.message || "Failed to execute autonomous plan" });
    }
  });

  // --- Vite / Static Assets ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Liquidity & SaaS OS running on http://localhost:${PORT}`);
  });
}

startServer();
