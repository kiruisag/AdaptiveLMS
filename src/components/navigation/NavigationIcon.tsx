import React from 'react';

interface NavigationIconProps {
  name?: string | null;
  className?: string;
}

export function NavigationIcon({
  name,
  className = 'text-base',
}: NavigationIconProps) {
  const iconClass = normalizeIcon(name);

  return (
    <i
      className={`${iconClass} ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Normalize backend Font Awesome icon definitions.
 *
 * Examples:
 *   fal fa-gauge-high
 *   fa-gauge-high
 *   gauge-high
 *
 * All are normalized to:
 *   fal fa-gauge-high
 */
function normalizeIcon(name?: string | null): string {
  if (!name) {
    return 'fal fa-folder';
  }

  const value = name.trim().toLowerCase();

  if (!value) {
    return 'fal fa-folder';
  }

  if (value.startsWith('fal fa-')) {
    return value;
  }

  if (value.startsWith('fa-')) {
    return `fal ${value}`;
  }

  return `fal fa-${value}`;
}