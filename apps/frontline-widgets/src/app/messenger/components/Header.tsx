import { useAtom } from 'jotai';
import { IHeaderItem } from '../types';
import { HEADER_ITEMS } from '../constants';
import { IconChevronLeft } from '@tabler/icons-react';
import { activeTabAtom, setActiveTabAtom, resetTabAtom } from '../atoms';
import { Badge } from 'erxes-ui';

export const Header = () => {
  const [activeTab] = useAtom(activeTabAtom);
  const [, setActiveTab] = useAtom(setActiveTabAtom);
  const [, resetTab] = useAtom(resetTabAtom);
  const render = () => {
    switch (activeTab) {
      case 'chat':
        return <HeaderStart />;
      case '':
        return <HeroSection />;
      default:
        return <HeaderStart />;
    }
  };

  return <div className="flex flex-col gap-4 p-4">{render()}</div>;
};

export function HeroSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="gap-2 flex flex-col">
        <div className="font-semibold text-foreground text-base">
          Need help?
        </div>
        <div className="text-accent-foreground font-medium text-sm">
          Get help with setting up using erxes. We're available between 9.00 am
          and 6.00 pm (GMT +8). We'll get back to you as soon as possible.
        </div>
      </div>
      <HeaderItemsList />
    </div>
  );
}

export function HeaderStart() {
  const [activeTab] = useAtom(activeTabAtom);
  const [, resetTab] = useAtom(resetTabAtom);

  const title = HEADER_ITEMS.find((item) => item.value === activeTab)?.title;
  return (
    <div
      role="heading"
      aria-level={1}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="button"
          tabIndex={0}
          aria-label="Back"
          className="flex items-center gap-2"
          onClick={() => resetTab()}
        >
          <IconChevronLeft size={16} />
        </button>
        <div className="text-base text-zinc-900 font-semibold">
          {title ?? 'Chat'}
        </div>
      </div>
      <HeaderTabList />
    </div>
  );
}

export function HeaderItemLabel({ title, Icon, value }: IHeaderItem) {
  const [activeTab] = useAtom(activeTabAtom);
  const [, setActiveTab] = useAtom(setActiveTabAtom);

  return (
    <Badge
      variant="secondary"
      onClick={() => setActiveTab(value as string)}
      className="py-2 cursor-pointer"
    >
      <Icon size={16} className="stroke-zinc-900" />
      <div className="text-[13px] leading-none font-semibold text-zinc-900">
        {title}
      </div>
    </Badge>
  );
}

export function HeaderTabItem({ Icon, value }: IHeaderItem) {
  const [activeTab] = useAtom(activeTabAtom);
  const [, setActiveTab] = useAtom(setActiveTabAtom);

  return (
    <button
      type="button"
      role="tab"
      tabIndex={0}
      aria-selected={activeTab === value}
      className="flex items-center gap-2 bg-none rounded-[4px] p-2 stroke-zinc-900 aria-selected:stroke-[#6366F1]"
      onClick={() => setActiveTab(value as string)}
    >
      <Icon size={16} className="stroke-inherit" />
    </button>
  );
}

export function HeaderItemsList() {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {HEADER_ITEMS.map((item) => (
        <HeaderItemLabel
          key={item.title}
          title={item.title}
          value={item.value}
          Icon={item.Icon}
        />
      ))}
    </div>
  );
}

export function HeaderTabList() {
  return (
    <div className="flex items-center gap-1" role="tablist">
      {HEADER_ITEMS.map((item) => (
        <HeaderTabItem key={item.title} value={item.value} Icon={item.Icon} />
      ))}
    </div>
  );
}
