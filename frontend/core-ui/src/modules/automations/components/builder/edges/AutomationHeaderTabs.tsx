import { useAutomation } from '@/automations/context/AutomationProvider';
import { AutomationsHotKeyScope } from '@/automations/types';
import { Tabs, usePreviousHotkeyScope, useScopedHotkeys } from 'erxes-ui';

export const AutomationHeaderTabs = ({
  toggleTabs,
}: {
  toggleTabs: (tab: 'builder' | 'history') => void;
}) => {
  const { queryParams } = useAutomation();

  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  const openHistory = () => {
    console.log(queryParams.activeTab);
    if (queryParams.activeTab !== 'history') {
      toggleTabs('history');
      setHotkeyScopeAndMemorizePreviousScope(AutomationsHotKeyScope.Builder);
    }
  };

  const openBuilder = () => {
    if (queryParams.activeTab !== 'builder') {
      toggleTabs('builder');
      setHotkeyScopeAndMemorizePreviousScope(AutomationsHotKeyScope.Builder);
    }
  };

  useScopedHotkeys(
    `mod+shift+h`,
    () => openHistory(),
    AutomationsHotKeyScope.Builder,
  );

  useScopedHotkeys(
    `mod+shift+esc`,
    () => openBuilder(),
    AutomationsHotKeyScope.Builder,
  );

  return (
    <Tabs.List className="bg-accent rounded border-b-none px-1 border-none">
      <Tabs.Trigger
        className="w-24 font-normal after:content-none after:border-none after:shadow-none data-[state=active]:bg-background data-[state=active]:shadow data-[state=active]:text-foreground"
        value="builder"
        onClick={() => toggleTabs('builder')}
      >
        Builder
      </Tabs.Trigger>
      <Tabs.Trigger
        className="w-24 font-normal after:content-none after:border-none after:shadow-none data-[state=active]:bg-background data-[state=active]:shadow data-[state=active]:text-foreground"
        value="history"
        onClick={() => toggleTabs('history')}
      >
        History
      </Tabs.Trigger>
    </Tabs.List>
  );
};
