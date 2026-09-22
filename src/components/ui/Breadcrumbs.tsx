import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppIcon } from './AppIcon';
import { useAuth } from '../../stores/auth.store';
import { useNavigation } from '../../features/navigation/hooks/useNavigation';
import type { NavigationNode } from '../../types/api/navigation.types';

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

function matchNode(node: NavigationNode, pathname: string): boolean {
  const url = node.url ?? '#';
  if (!url || url === '#') return false;
  const normalized = normalizePath(url);
  const current = normalizePath(pathname);
  if (normalized === current) return true;
  if (normalized.endsWith('*')) return current.startsWith(normalized.slice(0, -1));
  return current.startsWith(`${normalized}/`) || current === normalized;
}

function collectBreadcrumbs(nodes: NavigationNode[], pathname: string, breadcrumbs: string[] = []): string[] {
  for (const node of nodes) {
    const current = [...breadcrumbs, node.name];
    if (matchNode(node, pathname)) {
      return current;
    }

    if (node.children?.length) {
      const childMatch = collectBreadcrumbs(node.children, pathname, current);
      if (childMatch.length > 0) {
        return childMatch;
      }
    }
  }

  return [];
}

export function Breadcrumbs() {
  const location = useLocation();
  const { user, activeOrganization } = useAuth();
  const { data: navData } = useNavigation(
    activeOrganization?.uuid ?? null,
    !!user,
  );

  const items = useMemo(() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const menuLabels = navData ? collectBreadcrumbs(navData, location.pathname) : [];

    if (menuLabels.length > 0) {
      const labels = menuLabels.slice(1);
      return labels.map((label, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return { label, to, isLast: index === labels.length - 1 };
      });
    }

    const routeMap: Record<string, string> = {
      courses: 'Courses',
      progress: 'Progress',
      assessments: 'Assessments',
      'ai-tutor': 'AI Tutor',
      instructor: 'Instructor',
      'question-bank': 'Question Bank',
      learning: 'Learning Player',
      profile: 'Profile',
      'security': 'Security',
      'sessions': 'Sessions',
    };

    return pathnames.map((value, index) => {
      const isLast = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const rawLabel = routeMap[value] ?? value;
      const label = rawLabel.length > 20 ? `...${rawLabel.slice(-6)}` : rawLabel;
      return { label, to, isLast };
    });
  }, [location.pathname, navData]);

  return (
    <nav className="flex items-center space-x-1 text-sm text-slate-500 overflow-hidden" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center p-1 rounded-md hover:bg-slate-100 hover:text-indigo-600 transition-colors shrink-0">
        <AppIcon name="house" className="w-4 h-4" />
      </Link>

      {items.length > 0 && items.map(({ label, to, isLast }) => (
        <div key={to} className="flex items-center space-x-1 overflow-hidden">
          <AppIcon name="chevron-right" className="w-4 h-4 text-slate-300 shrink-0" />
          {isLast ? (
            <span className="font-medium text-slate-900 truncate px-1" aria-current="page">
              {label}
            </span>
          ) : (
            <Link to={to} className="px-1 rounded-md hover:bg-slate-100 hover:text-indigo-600 transition-colors truncate">
              {label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
