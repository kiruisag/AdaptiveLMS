import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppIcon } from './AppIcon';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map known route segments to human-readable labels
  const routeMap: Record<string, string> = {
    'courses': 'Courses',
    'progress': 'Progress',
    'assessments': 'Assessments',
    'ai-tutor': 'AI Tutor',
    'instructor': 'Instructor',
    'question-bank': 'Question Bank',
    'learning': 'Learning Player',
  };

  const getLabel = (segment: string) => {
    if (routeMap[segment]) return routeMap[segment];
    // If it looks like a long UUID, truncate it slightly for better display
    if (segment.length > 20) return `...${segment.substring(segment.length - 6)}`;
    // Otherwise capitalize the first letter
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-slate-500 overflow-hidden" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center p-1 rounded-md hover:bg-slate-100 hover:text-indigo-600 transition-colors shrink-0">
        <AppIcon name="house" className="w-4 h-4" />
      </Link>
      
      {pathnames.length > 0 && pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = getLabel(value);

        return (
          <div key={to} className="flex items-center space-x-1 overflow-hidden">
            <AppIcon name="chevron-right" className="w-4 h-4 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-medium text-slate-900 truncate px-1" aria-current="page">
                {label}
              </span>
            ) : (
              <Link 
                to={to} 
                className="px-1 rounded-md hover:bg-slate-100 hover:text-indigo-600 transition-colors truncate"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
