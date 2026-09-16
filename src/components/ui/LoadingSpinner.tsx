import React from 'react';
import { AppIcon } from './AppIcon';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <AppIcon name="spinner" className={cn('animate-spin text-indigo-600', sizeClasses[size])} />
      {text && <span className="text-sm font-medium text-slate-500 animate-pulse">{text}</span>}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center p-8">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
