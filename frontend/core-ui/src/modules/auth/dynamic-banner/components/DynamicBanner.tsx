import { cn } from 'erxes-ui';
// import { Logo } from '@/auth/components/Logo';
interface DynamicBannerProps {
  className?: string;
}

export const DynamicBanner = ({ className }: DynamicBannerProps) => {
  return (
    <div
      className={cn(
        'flex w-full h-screen justify-center bg-foreground',
        className,
      )}
    />
  );
};
