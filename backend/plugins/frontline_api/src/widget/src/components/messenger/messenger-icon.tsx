import { Spinner } from '@/components/ui/spinner';
import { IconMessage2, IconX } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { uiOptionsAtom, brandAtom } from './atoms';
import { cn, readImage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PopoverTrigger } from '@/components/ui/popover';
import { useMessenger } from '@/hooks/use-messenger';

export const MessengerIcon = ({ loading }: { loading: boolean }) => {
  const uiOptions = useAtomValue(uiOptionsAtom);
  const brand = useAtomValue(brandAtom);
  const { isOpen } = useMessenger();
  const { logo } = uiOptions || {};
  const { name, description } = brand || {};
  if (loading)
    return (
      <PopoverTrigger asChild>
        <Spinner size="sm" />
      </PopoverTrigger>
    );

  if (logo)
    return (
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'fixed bottom-4 right-4 z-50 size-12 flex items-center justify-center rounded-full shadow-xs shadow-muted bg-widget-bg text-accent hover:bg-widget-primary/80 hover:text-accent',
          )}
        >
          {isOpen ? (
            <IconX size={24} />
          ) : (
            <img
              src={readImage(logo)}
              alt={name || description || 'logo'}
              className="size-6"
            />
          )}
        </Button>
      </PopoverTrigger>
    );
  return (
    <PopoverTrigger asChild>
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          'fixed bottom-4 right-4 z-50 size-12 flex items-center justify-center rounded-full shadow-xs shadow-muted bg-widget-bg text-accent hover:bg-widget-primary/80 hover:text-accent',
        )}
      >
        {isOpen ? <IconX size={24} /> : <IconMessage2 size={24} />}
      </Button>
    </PopoverTrigger>
  );
};
