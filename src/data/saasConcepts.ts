import { VibePrompt } from '../types';

export interface SaaSConcept {
  id: string;
  name: string;
  category: string;
  description: string;
  systemPrompt: string;
  vibePrompts: VibePrompt[];
}

export const SAAS_CONCEPTS: SaaSConcept[] = [
  {
    id: 'subscription-analytics',
    name: 'Subscription Metrics Dashboard',
    category: 'Analytics',
    description: 'A real-time dashboard for tracking SaaS MRR, Churn, and LTV using Stripe integration.',
    systemPrompt: 'You are an expert SaaS data architect. You specialize in building high-performance analytics dashboards using Next.js, Tailwind CSS, and Stripe API. Your code is clean, modular, and optimized for data visualization.',
    vibePrompts: [
      {
        id: 'p1',
        phase: 'Core Blueprint',
        content: 'Create a full technical blueprint for a subscription analytics dashboard. Include database schema for customers, subscriptions, and daily snapshots. Plan the integration with Stripe Webhooks.',
        isCompleted: false
      },
      {
        id: 'p2',
        phase: 'Data Ingestion',
        content: 'Implement the Stripe webhook handler and a background worker to sync historical subscription data into a local Postgres database.',
        isCompleted: false
      },
      {
        id: 'p3',
        phase: 'Visual Dashboard',
        content: 'Build the primary dashboard UI using Recharts. Show MRR growth, active subscriber count, and churn rate over the last 30 days.',
        isCompleted: false
      }
    ]
  },
  {
    id: 'ai-content-generator',
    name: 'AI Marketing Engine',
    category: 'AI/Content',
    description: 'An AI-powered tool that generates multi-channel marketing content from a single product description.',
    systemPrompt: 'You are a Senior AI Engineer specializing in LLM orchestration. You build tools that transform high-level concepts into granular marketing assets using Gemini 1.5 Pro and specialized prompt engineering.',
    vibePrompts: [
      {
        id: 'p1',
        phase: 'System Architecture',
        content: 'Design the orchestration layer for a multi-channel content generator. Plan how to handle prompt chaining for Twitter, LinkedIn, and Blog outputs.',
        isCompleted: false
      },
      {
        id: 'p2',
        phase: 'Gemini Integration',
        content: 'Implement the core AI service that takes a product description and returns structured JSON for various marketing channels.',
        isCompleted: false
      },
      {
        id: 'p3',
        phase: 'Content Workspace',
        content: 'Build a rich text editor workspace where users can refine, schedule, and export the generated content.',
        isCompleted: false
      }
    ]
  },
  {
    id: 'developer-crm',
    name: 'Developer Relationship CRM',
    category: 'DevTools',
    description: 'A specialized CRM for developer advocates to track GitHub activity and community engagement.',
    systemPrompt: 'You are a DevRel specialized full-stack engineer. You build tools that integrate deeply with GitHub and Discord to provide community insights.',
    vibePrompts: [
      {
        id: 'p1',
        phase: 'Integration Strategy',
        content: 'Define the schema for tracking GitHub stars, forks, and PRs across multiple repositories. Plan the OAuth flow for GitHub API access.',
        isCompleted: false
      },
      {
        id: 'p2',
        phase: 'Community Sync',
        content: 'Build the synchronization engine that pulls GitHub events and Discord messages into a unified activity feed.',
        isCompleted: false
      }
    ]
  },
  {
    id: 'ai-headless-cms',
    name: 'AI Knowledge Base CMS',
    category: 'Content/AI',
    description: 'A headless CMS that automatically vectorizes content for RAG applications and provides an AI-ready API.',
    systemPrompt: 'You are a Senior Backend Engineer specialized in Vector Databases and Headless CMS architectures. You prioritize speed, scalability, and seamless integration with LLM frameworks.',
    vibePrompts: [
      {
        id: 'p1',
        phase: 'Core Infrastructure',
        content: 'Design the schema for a headless CMS that supports multiple content types and automatic vector embeddings. Plan the integration with Pinecone or Weaviate.',
        isCompleted: false
      },
      {
        id: 'p2',
        phase: 'Vectorization Pipeline',
        content: 'Implement a background worker that triggers on content updates to regenerate embeddings using Gemini Text Embeddings API.',
        isCompleted: false
      },
      {
        id: 'p3',
        phase: 'AI-Ready API',
        content: 'Build the GraphQL/REST API that allows users to query content using semantic search out-of-the-box.',
        isCompleted: false
      }
    ]
  },
  {
    id: 'privacy-analytics',
    name: 'Privacy-First Web Analytics',
    category: 'Analytics',
    description: 'A cookie-less, lightweight web analytics platform focused on user privacy and high-speed reporting.',
    systemPrompt: 'You are a Privacy-First Software Architect. You build tools that respect user data while providing high-quality insights. You avoid all third-party tracking and focus on first-party data collection.',
    vibePrompts: [
      {
        id: 'p1',
        phase: 'Data Collector',
        content: 'Build a lightweight JS snippet that collects basic pageview and event data without using cookies or local storage for tracking.',
        isCompleted: false
      },
      {
        id: 'p2',
        phase: 'Ingestion Engine',
        content: 'Design a high-throughput ingestion API using Cloudflare Workers or Node.js that processes incoming events and stores them in ClickHouse or AlloyDB.',
        isCompleted: false
      },
      {
        id: 'p3',
        phase: 'Privacy Dashboard',
        content: 'Create a clean, minimal dashboard showing real-time visitors, top pages, and referrers without any PII leaks.',
        isCompleted: false
      }
    ]
  }
];
