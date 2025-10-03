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
        'py-2 flex items-center gap-2 cursor-pointer rounded-sm bg-sidebar border-none',
        disabled && 'cursor-default',
      )}
    >
      <Icon size={16} className="stroke-foreground" />
      <div className="text-sm leading-none font-semibold text-foreground">
        {title}
      </div>
    </Badge>
  );
}
