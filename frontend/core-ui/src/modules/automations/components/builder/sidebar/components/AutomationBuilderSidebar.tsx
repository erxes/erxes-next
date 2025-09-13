import { useAutomationBuilderSidebarHooks } from '@/automations/components/builder/sidebar/hooks/useAutomationBuilderSidebarHooks';
import { useAutomation } from '@/automations/context/AutomationProvider';
import { AutomationsHotKeyScope, NodeData } from '@/automations/types';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import {
  Button,
  Card,
  Separator,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  useSetHotkeyScope,
} from 'erxes-ui';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { AutomationActionContentSidebar } from './content/AutomationActionContentSidebar';
import { AutomationTriggerContentSidebar } from './content/AutomationTriggerContentSidebar';
import { AutomationNodeLibrarySidebar } from './library/AutomationNodeLibrarySidebar';

export const AutomationBuilderSidebar = () => {
  const { awaitingToConnectNodeId } = useAutomation();
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();
  const setHotkeyScope = useSetHotkeyScope();

  const {
    isOpenSideBar,
    activeNode,
    handleBack,
    handleClose,
    toggleSideBarOpen,
  } = useAutomationBuilderSidebarHooks();

  useEffect(() => {
    if (!isOpenSideBar && awaitingToConnectNodeId) {
      toggleSideBarOpen();
    }
  }, [awaitingToConnectNodeId]);

  const onOpen = () => {
    toggleSideBarOpen();
    setHotkeyScopeAndMemorizePreviousScope(AutomationsHotKeyScope.Builder);
  };

  const onClose = () => {
    if (isOpenSideBar) {
      setHotkeyScope(AutomationsHotKeyScope.Builder);
      toggleSideBarOpen();
    }
  };

  useScopedHotkeys(`mod+g`, () => onOpen(), AutomationsHotKeyScope.Builder);
  useScopedHotkeys(`esc`, () => onClose(), AutomationsHotKeyScope.Builder);

  return (
    <AnimatePresence>
      {isOpenSideBar && (
        <div
          key="sidebar"
          className="
          absolute right-16 top-0 min-w-80 max-w-2xl w-fit h-full bg-sidebar rounded-none flex flex-col z-50 border-l"
        >
          {activeNode && (
            <>
              <Card.Header className="font-mono flex flex-row justify-between items-center min-w-80 max-w-2xl pl-2 py-4 pr-6">
                <div className="px-6 flex flex-col min-w-80 max-w-96">
                  <h2 className="font-semibold leading-none tracking-tight text-xl w-full">
                    {activeNode?.label || ''}
                  </h2>
                  <span className="text-sm text-muted-foreground font-medium w-full">
                    {activeNode?.description || ''}
                  </span>
                </div>
                <div className="flex flex-row gap-2 self-start mt-0">
                  <Button size="icon" variant="ghost" onClick={handleBack}>
                    <IconArrowLeft />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleClose}>
                    <IconX />
                  </Button>
                </div>
              </Card.Header>
              <Separator />
            </>
          )}

          <Card.Content className="min-w-80 max-w-2xl w-full flex-1 overflow-auto p-0">
            <AutomationBuilderSidebarContent activeNode={activeNode} />
          </Card.Content>
        </div>
      )}
    </AnimatePresence>
  );
};

const AutomationBuilderSidebarContent = ({
  activeNode,
}: {
  activeNode?: NodeData;
}) => {
  if (activeNode) {
    const { nodeType = '' } = activeNode || {};
    if (nodeType === 'trigger') {
      return <AutomationTriggerContentSidebar activeNode={activeNode} />;
    }

    if (nodeType === 'action') {
      return <AutomationActionContentSidebar />;
    }
  }

  return <AutomationNodeLibrarySidebar />;
};
