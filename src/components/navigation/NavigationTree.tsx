import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NavigationIcon } from './NavigationIcon';
import type { NavigationNode } from '../../types/api/navigation.types';

type Props = {
  nodes: NavigationNode[];
  level?: number;
  collapsed?: boolean;
  mobile?: boolean;
  openKeys?: Record<string, boolean>;
  setOpenKeys?: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  onSelect?: () => void;
};

function nodeMatchesPath(nodeUrl: string | null | undefined, pathname: string): boolean {
  if (!nodeUrl || nodeUrl === '#') return false;

  const normalizedNode = nodeUrl.replace(/\/+$/, '');
  const normalizedPath = pathname.replace(/\/+$/, '');

  if (!normalizedNode) return false;
  if (normalizedNode === normalizedPath) return true;
  if (normalizedNode.endsWith('*')) return normalizedPath.startsWith(normalizedNode.slice(0, -1));
  return normalizedPath === normalizedNode || normalizedPath.startsWith(`${normalizedNode}/`);
}

function isParentOfActive(node: NavigationNode, pathname: string): boolean {
  return Boolean(
    node.children?.some(
      (child) => nodeMatchesPath(child.url, pathname) || isParentOfActive(child, pathname),
    ),
  );
}

export function NavigationTree({
  nodes,
  level = 0,
  collapsed = false,
  mobile = false,
  openKeys,
  setOpenKeys,
  onSelect,
}: Props) {
  const location = useLocation();
  const pathname = location.pathname;

  const tree = useMemo(() => {
    return nodes.map((node) => {
      const children = node.children ?? [];
      const hasChildren = children.length > 0;
      const pathMatch = nodeMatchesPath(node.url, pathname);
      const parentExpanded = isParentOfActive(node, pathname);
      const open = Boolean((openKeys?.[node.key] ?? false) || pathMatch || parentExpanded);

      const itemClasses = [
        'flex w-full items-center justify-between rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        collapsed ? 'px-2 py-2' : 'px-2.5 py-2',
        pathMatch ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100',
      ].join(' ');

      const content = (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center text-slate-500">
            <NavigationIcon name={node.icon ?? 'folder'} className="h-4 w-4" />
          </span>
          {!collapsed && <span className="truncate text-sm font-medium">{node.name}</span>}
        </div>
      );

      const handleToggle = () => {
        if (!hasChildren || !setOpenKeys) return;
        setOpenKeys((prev) => ({ ...prev, [node.key]: !open }));
      };

      const linkClassName = [
        itemClasses,
        mobile ? 'text-left' : '',
      ].join(' ');

      return (
        <div key={node.key} className="relative space-y-1">
          {hasChildren ? (
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="tree"
              aria-current={pathMatch ? 'page' : undefined}
              className={linkClassName}
              onClick={handleToggle}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleToggle();
                }
              }}
            >
              {content}
              {!collapsed && (
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
              )}
            </button>
          ) : (
            <Link
              to={node.url ?? '#'}
              className={linkClassName}
              aria-current={pathMatch ? 'page' : undefined}
              onClick={() => onSelect?.()}
            >
              {content}
            </Link>
          )}

          {hasChildren && open && !collapsed && !mobile && (
            <div className="ml-2 mt-1 border-l border-slate-200 pl-2">
              <NavigationTree
                nodes={children}
                level={level + 1}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
                onSelect={onSelect}
              />
            </div>
          )}

          {hasChildren && open && collapsed && !mobile && (
            <div className="absolute left-full top-0 z-50 ml-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <NavigationTree
                nodes={children}
                level={level + 1}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
                onSelect={onSelect}
                collapsed={false}
                mobile={false}
              />
            </div>
          )}

          {hasChildren && open && mobile && (
            <div className="mt-1 ml-2 border-l border-slate-200 pl-2">
              <NavigationTree
                nodes={children}
                level={level + 1}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
                onSelect={onSelect}
                mobile
              />
            </div>
          )}
        </div>
      );
    });
  }, [collapsed, level, mobile, nodes, onSelect, openKeys, pathname, setOpenKeys]);

  return <div role="tree" className="space-y-1">{tree}</div>;
}
