import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-brand-alert/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-brand-alert" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">System Malfunction</h1>
              <p className="text-white/40 text-sm uppercase tracking-widest leading-relaxed">
                Critical core failure detected. Execution environment corrupted.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-lg">
              <p className="text-[10px] font-mono text-brand-alert uppercase text-left break-all">
                ERR: {this.state.error?.message || "Unknown Runtime Exception"}
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-black font-bold uppercase tracking-widest rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
              Initialize System Reset
            </button>
            
            <p className="text-[9px] text-white/20 uppercase tracking-widest font-mono">
              Session logs preserved in sandbox cache
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
