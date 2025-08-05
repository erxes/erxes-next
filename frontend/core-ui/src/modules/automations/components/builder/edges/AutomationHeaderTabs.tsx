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
    <Tabs.List size="sm" className="h-8 ">
      <Tabs.Trigger
        size="sm"
        value="builder"
        className="h-8 py-2 px-6"
        onClick={() => toggleTabs('builder')}
      >
        Builder
      </Tabs.Trigger>
      <Tabs.Trigger
        size="sm"
        value="history"
        className="h-8 py-2 px-6"
        onClick={() => toggleTabs('history')}
      >
        History
      </Tabs.Trigger>
    </Tabs.List>
  );
};
