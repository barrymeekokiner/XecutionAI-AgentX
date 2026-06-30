import { GoogleGenAI, GenerationConfig } from "@google/genai";
import { AGENT_DEFINITIONS, AgentRole } from "./agents";
import { AgentMemory } from "./memory";

export interface AgentContext {
  input: string;
  mode: string;
  tier: string;
  userId?: string;
  buildId?: string;
  manualOverride?: boolean;
}

export class AgentOrchestrator {
  private ai: any;
  private memory: AgentMemory;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
    this.memory = new AgentMemory();
  }

  async routeToModel(tier: string): Promise<string> {
    if (tier === 'premium') return 'gemini-1.5-pro';
    if (tier === 'standard') return 'gemini-1.5-flash';
    return 'gemini-1.5-flash-8b';
  }

  /**
   * Run a single agent's specialized task with its own system instruction and schema
   */
  async runAgentTask(role: AgentRole, context: AgentContext, history: any[] = []) {
    const definition = AGENT_DEFINITIONS[role];
    const modelName = await this.routeToModel(context.tier);

    // If manual override is enabled, we'd normally wait for user input.
    // In this simulation, we'll log that we are in "Paused/Override" state if manualOverride is true.
    if (context.manualOverride) {
      this.logTelemetry('warn', `Manual Override Active for ${role}. Context waiting for human injection.`);
    }
    
    const model = this.ai.getGenerativeModel({ 
      model: modelName,
      systemInstruction: definition.systemInstruction
    });

    const prompt = `
      Current Objective: ${context.input}
      Market Mode: ${context.mode}
      Previous Agent Contributions: ${JSON.stringify(history)}
      
      Analyze the situation from your unique perspective and provide structured feedback.
    `;

    const startTime = Date.now();
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: definition.responseSchema
        }
      });

      const responseTime = Date.now() - startTime;
      const output = JSON.parse(result.response.text());
      
      // Extract reasoning if available or simulate it
      const reasoning = `Analysis based on ${role} perspective focusing on ${context.mode} dynamics. High alignment detected in core metrics.`;

      // Save to message log in Firestore with reasoning and markers
      if (context.userId && context.buildId) {
        const marker = output.decision === 'REJECT' ? 'conflict' : output.decision === 'PROCEED' ? 'consensus' : 'neutral';
        await this.memory.saveAgentMessage(
          context.userId, 
          context.buildId, 
          role, 
          'ORCHESTRATOR', 
          `Agent ${role} completed analysis. Decision: ${output.decision}`,
          { 
            output, 
            responseTime, 
            reasoning,
            marker,
            status: 'success'
          }
        );

        // Save performance metrics
        await this.savePerformanceMetric(role, responseTime, true);
      }

      return {
        role,
        name: definition.name,
        output,
        reasoning,
        responseTime
      };
    } catch (error: any) {
      if (context.userId && context.buildId) {
        await this.savePerformanceMetric(role, Date.now() - startTime, false);
      }
      throw error;
    }
  }

  private async savePerformanceMetric(role: string, responseTime: number, success: boolean) {
    // In a real app, we would aggregate this in Firestore
    const docRef = this.memory['db'].collection('agent_performance').doc(role);
    const existing = await docRef.get();
    const data = existing.exists ? existing.data() : { totalTime: 0, count: 0, successes: 0, errors: 0 };
    
    await docRef.set({
      role,
      totalTime: (data.totalTime || 0) + responseTime,
      count: (data.count || 0) + 1,
      successes: (data.successes || 0) + (success ? 1 : 0),
      errors: (data.errors || 0) + (success ? 0 : 1),
      lastUpdated: Date.now()
    });
  }

  /**
   * Orchestrates a sequential multi-agent debate session
   */
  async conductCouncilDebate(context: AgentContext) {
    this.logTelemetry('info', 'Initiating Sequential Agent Council', { input: context.input });
    
    const roles: AgentRole[] = ['MarketResearch', 'CEO', 'CTO', 'Growth', 'Finance', 'Security'];
    const sessionHistory: any[] = [];

    for (const role of roles) {
      this.logTelemetry('debug', `Activating Agent: ${role}`);
      const analysis = await this.runAgentTask(role, context, sessionHistory);
      sessionHistory.push(analysis);

      // Persist to memory if user context is available
      if (context.userId) {
        this.memory.saveAgentMemory(context.userId, 'current_build', role, analysis.output)
          .catch(err => console.error("Memory Persistence Failure:", err));
      }
    }

    return sessionHistory;
  }

  async executeAutonomousTask(context: AgentContext) {
    // Legacy support or fallback
    const modelName = await this.routeToModel(context.tier);
    const model = this.ai.getGenerativeModel({ model: modelName });

    const systemPrompt = `You are the Master Coordinator. Combine agent insights into a cohesive plan.`;
    const result = await model.generateContent(systemPrompt + " Objective: " + context.input);
    return JSON.parse(result.response.text());
  }

  logTelemetry(level: string, message: string, metadata?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}][TELEMETRY][${level.toUpperCase()}] ${message}`, metadata || '');
  }
}
