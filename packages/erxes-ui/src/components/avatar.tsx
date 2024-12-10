import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';
import { cn } from '../lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Color, stringToHslColor, twColorClassNames } from './colors';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'size-3 text-[8px]',
        sm: 'size-3.5 text-[10px]',
        default: 'size-4 text-xs',
        lg: 'size-6 text-sm',
        xl: 'size-10 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
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
>(({ className, color, colorSeed, style, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full  bg-[--avatar-bg] text-[--avatar-text] dark:bg-[--avatar-bg-dark] dark:text-[--avatar-text-dark]',
      twColorClassNames[color as Color],
      className
    )}
    style={
      {
        '--avatar-bg': stringToHslColor(colorSeed ?? '', 75, 90),
        '--avatar-text': stringToHslColor(colorSeed ?? '', 75, 20),
        '--avatar-bg-dark': stringToHslColor(colorSeed ?? '', 75, 20),
        '--avatar-text-dark': stringToHslColor(colorSeed ?? '', 75, 90),
        ...style,
      } as React.CSSProperties
    }
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
