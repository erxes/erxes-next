import { Badge } from '@/components/ui/badge';
import { useMessenger } from '../../hooks/useMessenger';
import { IHeaderItem } from '../../types';

interface HeaderItemLabelProps extends IHeaderItem {}

export function HeaderItemLabel({ title, Icon, value }: HeaderItemLabelProps) {
  const { switchToTab } = useMessenger();

  return (
    <Badge
      variant="secondary"
      onClick={() => switchToTab(value as any)}
      className="py-2 cursor-pointer"
    >
      <Icon size={16} className="stroke-zinc-900" />
      <div className="text-[13px] leading-none font-semibold text-zinc-900">
        {title}
      </div>
    </Badge>
  );
}
