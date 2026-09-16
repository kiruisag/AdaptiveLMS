import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppIcon } from '../ui/AppIcon';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Force a full reload to ensure a clean state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 w-full h-full bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AppIcon name="triangle-exclamation" className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h2>
            <p className="text-slate-500 mb-6">
              We encountered an unexpected error while loading this page. Our team has been notified.
            </p>
            
            {this.state.error && (
              <div className="bg-slate-50 p-4 rounded-lg text-left overflow-x-auto mb-8 border border-slate-100">
                <p className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <AppIcon name="rotate-right" className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
