import { Button } from '@/components/ui/button';
import { useMessenger } from '../../hooks/useMessenger';
import { IHeaderItem } from '../../types';

interface HeaderTabItemProps extends IHeaderItem {}

export function HeaderTabItem({ Icon, value }: HeaderTabItemProps) {
  const { activeTab, switchToTab } = useMessenger();

  return (
    <Button
      type="button"
      variant="ghost"
      role="tab"
      tabIndex={0}
      aria-selected={activeTab === value}
      className="flex items-center gap-2 bg-none rounded-[4px] p-2 stroke-zinc-900 aria-selected:stroke-[#6366F1]"
      onClick={() => switchToTab(value as any)}
    >
      <Icon size={16} className="stroke-inherit" />
    </Button>
  );
}
