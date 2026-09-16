type AppIconProps = {
  name: string;
  className?: string;
  variant?: 'solid' | 'regular' | 'light' | 'duotone';
};

export function AppIcon({
  name,
  className = '',
  variant = 'solid',
}: AppIconProps) {
  const normalizedName = name.trim();
  const variantClass = {
    solid: 'fas',
    regular: 'far',
    light: 'fal',
    duotone: 'fad',
  }[variant];

  return <i className={`${variantClass} fa-${normalizedName} ${className}`.trim()} />;
}
