import { IconChevronLeft } from '@tabler/icons-react';
import { Button } from '../../../ui/button';
import { useHeader } from '../hooks/useHeader';
import { HeaderTabList } from './header-tab-list';

export function HeaderStart() {
  const { goBack, getCurrentTitle } = useHeader();
  
  return (
    <div
      role="heading"
      aria-level={1}
      className="flex items-center justify-between"
    >
      <div className="flex items-center">
        <Button
          type="button"
          role="button"
          size="icon"
          variant="ghost"
          tabIndex={0}
          aria-label="Back"
          className="flex items-center gap-2 hover:bg-transparent size-8 text-accent-foreground"
          onClick={goBack}
        >
          <IconChevronLeft size={16} />
        </Button>
        <div className="text-base font-semibold">
          {getCurrentTitle()}
        </div>
      </div>
      <HeaderTabList />
    </div>
  );
}
