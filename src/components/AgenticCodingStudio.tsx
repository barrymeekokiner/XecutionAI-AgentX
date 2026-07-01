import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Send, 
  Code2, 
  FileCode, 
  Play, 
  Save, 
  Loader2, 
  Sparkles, 
  ChevronRight,
  MessageSquare,
  Cpu,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CodingFile, CodingResponse } from '../server/codingEngine';

interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  plan?: string;
  files?: CodingFile[];
}

export const AgenticCodingStudio: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [files, setFiles] = useState<CodingFile[]>([
    {
      path: 'src/App.tsx',
      language: 'typescript',
      content: 'export default function App() {\n  return <div>Hello Vibe Coding</div>\n}'
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<CodingFile | null>(files[0]);
  const [activeTab, setActiveTab] = useState<'chat' | 'files'>('chat');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSteer = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: AgentMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/coding/steer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userMessage.content,
          currentFiles: files
        })
      });

      if (!response.ok) throw new Error('Failed to steer agent');

      const data: CodingResponse = await response.json();

      const agentMessage: AgentMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'agent',
        content: data.implementationPlan,
        timestamp: Date.now(),
        files: data.files
      };

      setMessages(prev => [...prev, agentMessage]);
      
      // Update files
      if (data.files && data.files.length > 0) {
        setFiles(prev => {
          const updated = [...prev];
          data.files.forEach(newFile => {
            const index = updated.findIndex(f => f.path === newFile.path);
            if (index >= 0) {
              updated[index] = newFile;
            } else {
              updated.push(newFile);
            }
          });
          return updated;
        });
      }
    } catch (error) {
      console.error("Steering Error:", error);
      const errorMessage: AgentMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'agent',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[800px] bg-slate-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <Cpu className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Neural Coding Studio
              <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full animate-pulse">Agentic Active</span>
            </h2>
            <p className="text-[10px] text-white/40 font-mono">STEER YOUR SAAS INTO REALITY</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 transition-all">
            <Save className="w-3 h-3" />
            Snapshot
          </button>
          <button className="px-3 py-1.5 bg-brand-primary text-black rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)]">
            <Play className="w-3 h-3" />
            Deploy App
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat/Steering */}
        <div className="w-[450px] border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/10 flex gap-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Agent Stream
            </button>
            <button 
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'files' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Source Graph
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4"
                >
                  <Sparkles className="w-12 h-12 text-brand-primary" />
                  <p className="text-xs font-mono">Ready for inception.<br/>State your SaaS vision to begin.</p>
                </motion.div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl border ${
                    msg.role === 'user' 
                      ? 'bg-brand-primary/5 border-brand-primary/20 text-white' 
                      : 'bg-white/5 border-white/10 text-white/80'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                        {msg.role === 'user' ? 'Architect' : 'Neural Agent'}
                      </span>
                      <span className="text-[8px] font-mono opacity-20">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                        <p className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Modified Assets</p>
                        <div className="grid grid-cols-1 gap-1">
                          {msg.files.map(f => (
                            <div key={f.path} className="flex items-center gap-2 p-1.5 bg-black/40 rounded border border-white/5">
                              <FileCode className="w-3 h-3 text-brand-primary/60" />
                              <span className="text-[10px] font-mono opacity-60 truncate">{f.path}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSteer())}
                placeholder="Describe a feature or steer the code..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 pr-12 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all resize-none h-24"
              />
              <button
                onClick={handleSteer}
                disabled={isProcessing || !input.trim()}
                className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
                  isProcessing ? 'bg-white/5 text-white/20' : 'bg-brand-primary text-black hover:scale-105 shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                }`}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]" />
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Engine Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-brand-primary animate-pulse shadow-[0_0_5px_#00ff9d]' : 'bg-white/10'}`} />
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">{isProcessing ? 'Agent Thinking' : 'Idle'}</span>
                </div>
              </div>
              <span className="text-[9px] text-white/20 font-mono uppercase">Vibe Control v2.4</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Code/Files */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="flex-1 flex overflow-hidden">
            {/* File Sidebar */}
            <div className="w-64 border-r border-white/5 p-4 flex flex-col gap-4 bg-black/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-60">Source Code</span>
                <span className="text-[10px] text-brand-primary font-mono">{files.length} Files</span>
              </div>
              <div className="space-y-1">
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-3 transition-all group ${
                      selectedFile?.path === file.path 
                        ? 'bg-white/10 border-white/10 text-white' 
                        : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 ${selectedFile?.path === file.path ? 'text-brand-primary' : 'text-white/20 group-hover:text-white/40'}`} />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono truncate max-w-[150px]">{file.path}</span>
                      <span className="text-[7px] uppercase tracking-widest opacity-40">{file.language}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Code View */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-black/60">
              {selectedFile ? (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-brand-primary/60" />
                      <span className="text-[11px] font-mono text-white/60">{selectedFile.path}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Neural Draft</span>
                      </div>
                      <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <Sparkles className="w-3.5 h-3.5 text-white/20" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed text-brand-primary/80 overflow-auto custom-scrollbar whitespace-pre">
                    {selectedFile.content}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20">
                  <Code2 className="w-16 h-16 mb-4" />
                  <p className="text-sm font-mono uppercase tracking-widest">Select a neural artifact to inspect</p>
                </div>
              )}

              {/* Decorative Elements */}
              <div className="absolute bottom-4 right-4 p-4 border border-white/5 rounded-xl bg-black/80 backdrop-blur-md max-w-[250px] space-y-2 pointer-events-none">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-brand-primary" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">Efficiency Metrics</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-[8px] text-white/20 uppercase font-mono">Performance</p>
                    <p className="text-xs font-mono text-brand-primary">99.2%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] text-white/20 uppercase font-mono">Complexity</p>
                    <p className="text-xs font-mono text-brand-primary">LOW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 bg-black/60 flex justify-between items-center px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full" />
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Production Stack: React 18 / Vite / TS / Tailwind</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-white/20" />
            <span className="text-[10px] text-white/40 font-mono tracking-tighter">PORT: 3000 ACTIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            <CheckCircle2 className="w-3 h-3 text-brand-primary" />
            <span className="text-[9px] text-white/60 font-mono">LINT: PASSED</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            <Zap className="w-3 h-3 text-brand-primary" />
            <span className="text-[9px] text-white/60 font-mono">BUILD: OPTIMIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
