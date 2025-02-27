import * as React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, VariantProps } from 'class-variance-authority';

import { Color, stringToHslColor, twColorClassNames } from './colors';
import { cn } from '../lib/utils';
import { useAtomValue } from 'jotai';
import { themeState } from 'erxes-ui/state';

export const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border-0',
  {
    variants: {
      size: {
        xs: 'size-3 text-[8px]',
        sm: 'size-3.5 text-[10px]',
        default: 'size-4 text-xs',
        lg: 'size-6 text-sm',
        xl: 'size-8 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export type AvatarProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> &
  VariantProps<typeof avatarVariants>;

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ className, size }), className)}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    color?: Color;
    colorSeed?: string;
  }
>(({ className, color, colorSeed, style, ...props }, ref) => {
  const theme = useAtomValue(themeState);
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full  bg-[--avatar-bg] text-[--avatar-text] uppercase',
        twColorClassNames[color as Color],
        className,
      )}
      style={
        {
          '--avatar-bg':
            theme === 'dark'
              ? stringToHslColor(colorSeed ?? '', 75, 20)
              : stringToHslColor(colorSeed ?? '', 75, 90),
          '--avatar-text':
            theme === 'dark'
              ? stringToHslColor(colorSeed ?? '', 75, 90)
              : stringToHslColor(colorSeed ?? '', 75, 20),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
