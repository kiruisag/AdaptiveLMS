import React from 'react';
import { useUiStore } from '../../stores/ui.store';
import { LoadingSpinner } from './LoadingSpinner';

export function GlobalLoadingOverlay() {
  const { globalLoadingCount } = useUiStore();

  if (globalLoadingCount === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300">
      <LoadingSpinner size="xl" text="Processing request..." />
    </div>
  );
}
