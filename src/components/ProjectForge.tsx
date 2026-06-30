import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Layers, 
  Database, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Terminal,
  Download,
  CheckCircle2,
  Cpu,
  Github,
  Cloud,
  ChevronRight,
  Eye,
  FileCode
} from 'lucide-react';

interface ProjectFile {
  name: string;
  language: string;
  content: string;
  description: string;
}

interface ProjectModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  files: ProjectFile[];
}

export const ProjectForge: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('frontend');
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);

  const modules: ProjectModule[] = [
    {
      id: 'frontend',
      name: 'Frontend Core',
      icon: <Code2 className="w-4 h-4" />,
      description: 'React 18 + Vite + Tailwind CSS Architecture',
      files: [
        {
          name: 'App.tsx',
          language: 'typescript',
          description: 'Main application entry point with route orchestration.',
          content: `import React from 'react';\nimport { Dashboard } from './components/Dashboard';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white font-sans">\n      <Dashboard />\n    </div>\n  );\n}`
        },
        {
          name: 'tailwind.config.js',
          language: 'javascript',
          description: 'Optimized design tokens and theme configuration.',
          content: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ["./src/**/*.{ts,tsx}"],\n  theme: { extend: { colors: { brand: "#00f2ff" } } }\n}`
        }
      ]
    },
    {
      id: 'backend',
      name: 'API Service',
      icon: <Terminal className="w-4 h-4" />,
      description: 'Node.js + Express + TypeScript Backend',
      files: [
        {
          name: 'server.ts',
          language: 'typescript',
          description: 'Express server with middleware and security layers.',
          content: `import express from 'express';\nconst app = express();\napp.use(express.json());\napp.listen(3000, () => console.log('Server online'));`
        }
      ]
    },
    {
      id: 'database',
      name: 'Database Schema',
      icon: <Database className="w-4 h-4" />,
      description: 'Firestore / Drizzle ORM Schema definitions',
      files: [
        {
          name: 'schema.ts',
          language: 'typescript',
          description: 'Normalized data structures for core business logic.',
          content: `export interface UserProfile {\n  uid: string;\n  email: string;\n  tier: 'free' | 'pro';\n  createdAt: number;\n}`
        }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Deployment',
      icon: <Cloud className="w-4 h-4" />,
      description: 'Cloud Run & GitHub Actions CI/CD',
      files: [
        {
          name: 'Dockerfile',
          language: 'dockerfile',
          description: 'Optimized multi-stage build for production deployment.',
          content: `FROM node:20-slim AS builder\nWORKDIR /app\nCOPY . .\nRUN npm install && npm run build\n\nFROM node:20-slim\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCMD ["npm", "start"]`
        },
        {
          name: 'cloudrun.yaml',
          language: 'yaml',
          description: 'Infrastructure as Code for Google Cloud Run.',
          content: `apiVersion: serving.knative.dev/v1\nkind: Service\nmetadata:\n  name: saas-engine\nspec:\n  template:\n    spec:\n      containers:\n      - image: gcr.io/project/saas-engine`
        }
      ]
    }
  ];

  const exportProject = () => {
    const projectData = modules.reduce((acc: any, mod) => {
      acc[mod.name] = mod.files.reduce((fileAcc: any, file) => {
        fileAcc[file.name] = file.content;
        return fileAcc;
      }, {});
      return acc;
    }, {});

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural-project-forge-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentModule = modules.find(m => m.id === activeModule) || modules[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Sidebar Nav */}
      <div className="lg:col-span-3 space-y-4">
        <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-primary" />
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Autonomous Forge</h3>
          </div>
          <p className="text-[8px] text-brand-primary/60 font-mono leading-tight">Neural Application Generation Active</p>
        </div>

        <div className="space-y-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod.id);
                setSelectedFile(null);
              }}
              className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                activeModule === mod.id 
                  ? 'bg-brand-primary border-brand-primary text-black' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeModule === mod.id ? 'bg-black/20' : 'bg-white/5'}`}>
                  {mod.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{mod.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeModule === mod.id ? 'translate-x-1' : 'group-hover:translate-x-1 opacity-20'}`} />
            </button>
          ))}
        </div>

        <button 
          onClick={exportProject}
          className="w-full mt-8 p-4 bg-brand-secondary/20 hover:bg-brand-secondary/30 border border-brand-secondary/40 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold text-brand-secondary uppercase tracking-widest transition-all"
        >
          <Download className="w-4 h-4" />
          Export Full Project
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-9 space-y-6">
        <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">{currentModule.name}</h3>
              <p className="text-[10px] text-white/40 italic">{currentModule.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-[8px] text-green-400 font-bold uppercase">Ready for Deployment</span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12">
            {/* File List */}
            <div className="md:col-span-4 border-r border-white/10 p-4 space-y-2 bg-black/20">
              <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest block mb-4">Source Files</span>
              {currentModule.files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                    selectedFile?.name === file.name
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${selectedFile?.name === file.name ? 'text-brand-primary' : 'text-white/20'}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono">{file.name}</span>
                    <span className="text-[7px] uppercase opacity-40">{file.language}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Code Viewer */}
            <div className="md:col-span-8 p-6 flex flex-col bg-black/40 relative">
              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div
                    key={selectedFile.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-brand-primary" />
                        <span className="text-[9px] text-white/60 font-mono italic">{selectedFile.description}</span>
                      </div>
                      <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <Download className="w-3 h-3 text-white/40" />
                      </button>
                    </div>
                    <div className="p-4 bg-black border border-white/5 rounded-xl font-mono text-[10px] text-brand-primary/80 leading-relaxed overflow-x-auto whitespace-pre">
                      {selectedFile.content}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                    <div className="p-4 bg-white/5 rounded-full">
                      <Eye className="w-8 h-8 text-white/10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">No File Selected</p>
                      <p className="text-[8px] text-white/20 max-w-[200px]">Select a neural output file to inspect the generated architecture.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Grid Background Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-github-color/10 rounded-xl">
              <Github className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">GitHub Repository</p>
              <p className="text-[8px] text-white/40 font-mono italic">saas-forge/generated-neural-v1</p>
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 rounded-xl">
              <Cloud className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Cloud Run Instance</p>
              <p className="text-[8px] text-white/40 font-mono italic">deploy.saas.engine.v1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
