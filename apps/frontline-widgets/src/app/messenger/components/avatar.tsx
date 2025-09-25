import { ReactNode, useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

const sizeMap = {
  xs: 'w-7 h-7',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

function getInitials(name: string) {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt,
  size = 'md',
  className = '',
  children,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-zinc-200 text-zinc-500 font-medium border border-zinc-100 ${sizeMap[size]} ${textSizeMap[size]} ${className}`}
        aria-label={alt}
        style={{
          width:
            size === 'xs' ? 28 : size === 'sm' ? 32 : size === 'md' ? 40 : 56,
          height:
            size === 'xs' ? 28 : size === 'sm' ? 32 : size === 'md' ? 40 : 56,
        }}
      >
        {children ?? getInitials(alt)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`inline-block rounded-full object-cover bg-zinc-200 border border-zinc-100 ${sizeMap[size]} ${className}`}
      loading="lazy"
      width={size === 'xs' ? 28 : size === 'sm' ? 32 : size === 'md' ? 40 : 56}
      height={size === 'xs' ? 28 : size === 'sm' ? 32 : size === 'md' ? 40 : 56}
      onError={() => setHasError(true)}
    />
  );
}

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({
  children,
  max,
  size = 'md',
  className = '',
}: AvatarGroupProps) {
  const avatars = Array.isArray(children) ? children : [children];
  const displayAvatars =
    typeof max === 'number' ? avatars.slice(0, max) : avatars;
  const extraCount =
    typeof max === 'number' && avatars.length > max ? avatars.length - max : 0;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((child, idx) => (
        <div key={idx} className="inline-block">
          {child}
        </div>
      ))}
      {extraCount > 0 && (
        <span
          className={`inline-flex items-center justify-center rounded-full bg-zinc-200 text-zinc-500 text-xs font-medium border border-zinc-100 ${sizeMap[size]}`}
        >
          +{extraCount}
        </span>
      )}
    </div>
  );
}
