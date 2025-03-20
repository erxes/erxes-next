import { IconSettings } from '@tabler/icons-react';
import { Button, Separator, Sidebar } from 'erxes-ui/components';

export const SettingsHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-[52px] box-border flex-shrink-0 bg-sidebar w-full">
      <div className="flex gap-2 px-3 flex-auto items-center">
        <Sidebar.Trigger />
        <Separator.Inline />
        <Button
          variant="ghost"
          className="font-semibold flex items-center gap-2"
        >
          <IconSettings className="w-4 h-4" />
          Settings
        </Button>
        <Separator.Inline />
        {children}
      </div>
      <Separator className="w-full" />
    </div>
  );
};
