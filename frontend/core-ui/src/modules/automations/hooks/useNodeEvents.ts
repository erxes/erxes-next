import { useAutomation } from '@/automations/context/AutomationProvider';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { toggleAutomationBuilderOpenSidebar } from '@/automations/states/automationState';
import { AutomationNodeType, NodeData } from '@/automations/types';
import {
  TAutomationBuilderForm,
  TAutomationNodeState,
} from '@/automations/utils/AutomationFormDefinitions';
import { Node } from '@xyflow/react';
import { useSetAtom } from 'jotai';
import { useFormContext } from 'react-hook-form';

export const useNodeEvents = () => {
  const toggleSideBarOpen = useSetAtom(toggleAutomationBuilderOpenSidebar);
  const { setQueryParams } = useAutomation();
  const { setValue } = useFormContext<TAutomationBuilderForm>();
  const { getList } = useAutomationNodes();

  const onNodeDragStop = (_: any, node: Node<NodeData>) => {
    const nodeType = node.data.nodeType;

    const list = getList(nodeType);

    if (!list?.length) {
      return;
    }

    setValue(
      `${nodeType}s`,
      list.map((item) =>
        item.id === node.id ? { ...item, position: node.position } : item,
      ) as Extract<TAutomationNodeState, { type: typeof nodeType }>[],
    );
  };

  const onNodeDoubleClick = (event: any, node: Node<NodeData>) => {
    const target = event.target as HTMLElement;

    const isCollapsibleTrigger = target.closest('[data-collapsible-trigger]');
    const isButton = target.closest('button');
    if (
      isCollapsibleTrigger ||
      isButton ||
      node.type === AutomationNodeType.Workflow
    ) {
      return;
    }

    toggleSideBarOpen();
    setQueryParams({ activeNodeId: node.id });
  };

  return {
    onNodeDoubleClick,
    onNodeDragStop,
  };
};
