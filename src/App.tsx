import React, { useEffect } from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { AppRouter } from './app/router';
import { GlobalLoadingOverlay } from './components/ui/GlobalLoadingOverlay';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { FloatingFeedback } from './components/ui/FloatingFeedback';
import { useUiStore } from './stores/ui.store';

export default function App() {
  const { initTheme } = useUiStore();
  
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <AppProvider>
      <GlobalLoadingOverlay />
      <FloatingFeedback />
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </main>
      </div>
    </AppProvider>
  );
}
