import { useAutomationBuilderSidebarHooks } from '@/automations/components/builder/sidebar/hooks/useAutomationBuilderSidebarHooks';
import { NodeData } from '@/automations/types';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { Button, Card, Separator } from 'erxes-ui';
import { useEffect } from 'react';
import { AutomationActionContentSidebar } from './AutomationActionContentSidebar';
import { AutomationNodeLibrarySidebar } from './AutomationNodeLibrarySidebar';
import { AutomationTriggerContentSidebar } from './AutomationTriggerContentSidebar';
import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';

const AutomationBuilderSidebarContent = ({
  activeNode,
}: {
  activeNode: NodeData | null;
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

export const AutomationBuilderSidebar = () => {
  const { awaitingToConnectNodeId } = useAutomation();
  const {
    getNodes,
    isMinimized,
    activeNode,
    queryParams,
    handleBack,
    handleClose,
    setValue,
  } = useAutomationBuilderSidebarHooks();

  useEffect(() => {
    if (!!queryParams.activeNodeId && !activeNode) {
      const nodes = getNodes();
      const node = nodes.find((node) => node.id === queryParams.activeNodeId);
      if (node) {
        setValue('activeNode', { ...node.data, id: node.id });
      }
    }

    if (isMinimized && awaitingToConnectNodeId) {
      setValue('isMinimized', false);
    }
  }, [
    activeNode,
    queryParams.activeNodeId,
    isMinimized,
    awaitingToConnectNodeId,
  ]);

  if (isMinimized) {
    return null;
  }

  return (
    <Card className="absolute right-0 min-w-80 max-w-2xl w-fit h-full bg-sidebar rounded-none flex flex-col">
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

      {/* Make this the scrollable area */}
      <Card.Content className="min-w-80 max-w-2xl w-full flex-1 overflow-auto p-0">
        <AutomationBuilderSidebarContent activeNode={activeNode} />
      </Card.Content>
    </Card>
  );
};
