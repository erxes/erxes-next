import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { useReactFlow } from '@xyflow/react';
import { Button, Card, Separator } from 'erxes-ui/components';
import { useMultiQueryState } from 'erxes-ui/hooks';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { NodeData } from '../../types';
import { ActionDetail } from './nodes/actions';
import { TriggerDetail } from './nodes/triggers';
import { AutomationSidebarDefaultContent } from './sidebar/AutomationSidebarDefaultContent';

const AutomationBuilderSidebarContent = ({
  activeNode,
}: {
  activeNode: NodeData;
}) => {
  const { nodeType = '' } = activeNode || {};
  if (nodeType === 'trigger') {
    return <TriggerDetail activeNode={activeNode} />;
  }

  if (nodeType === 'action') {
    return <ActionDetail />;
  }

  return <AutomationSidebarDefaultContent />;
};

const useAutomationBuilderSidebarHooks = () => {
  const { getNodes } = useReactFlow();
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const [queries, setQueries] = useMultiQueryState<{
    activeNodeId: string;
    activeNodeTab: 'trigger' | 'action';
  }>(['activeNodeId', 'activeNodeTab']);

  const isMinimized = watch('isMinimized');
  const activeNode = watch('activeNode');

  const handleClose = () => {
    setValue('activeNode', null);
    setValue('isMinimized', true);
    setQueries({
      activeNodeId: null,
    });
  };
  const handleBack = () => {
    setValue('activeNode', null);
    setQueries({
      activeNodeId: null,
      activeNodeTab: activeNode?.nodeType || null,
    });
  };

  return {
    getNodes,
    isMinimized,
    activeNode,
    queries,
    handleBack,
    handleClose,
    setValue,
  };
};

export const AutomationBuilderSidebar = () => {
  const {
    getNodes,
    isMinimized,
    activeNode,
    queries,
    handleBack,
    handleClose,
    setValue,
  } = useAutomationBuilderSidebarHooks();
  useEffect(() => {
    if (!!queries.activeNodeId && !activeNode) {
      const nodes = getNodes();
      const node = nodes.find((node) => node.id === queries.activeNodeId);
      if (node) {
        setValue('activeNode', { ...node.data, id: node.id });
      }
    }
  }, [activeNode, queries.activeNodeId]);

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
      <Card.Content className="min-w-80 max-w-2xl w-full flex-1 overflow-auto">
        <AutomationBuilderSidebarContent activeNode={activeNode} />
      </Card.Content>
    </Card>
  );
};
