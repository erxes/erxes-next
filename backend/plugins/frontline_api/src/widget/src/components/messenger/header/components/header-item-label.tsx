import { cn } from '@/lib/utils';
import { Badge } from '../../../ui/badge';
import { useMessenger } from '../../hooks/useMessenger';
import { IHeaderItem } from '../../types';

export function HeaderItemLabel({ title, Icon, value, disabled }: IHeaderItem) {
  const { switchToTab } = useMessenger();

  return (
    <Badge
      variant="outline"
      aria-disabled={disabled}
      onClick={() => !disabled && switchToTab(value as any)}
      className={cn(
        'px-2 flex items-center gap-2 cursor-pointer rounded-sm bg-muted-background border-none text-accent-foreground',
        disabled && 'cursor-default',
      )}
    >
      <Icon size={16} className="my-1.5" />
      <div className="text-xs leading-none font-semibold">
        {title}
      </div>
    </Badge>
  );
}
