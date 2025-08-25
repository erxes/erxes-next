import {
  TAutomationBuilderForm,
  TAutomationNodeState,
} from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext, useWatch } from 'react-hook-form';
import { AutomationNodeType, NodeData } from '@/automations/types';
import { generateNode } from '@/automations/utils/automationBuilderUtils/generateNodes';
import { Node, useReactFlow } from '@xyflow/react';

export const useDefaultTriggerContent = ({
  activeNode,
}: {
  activeNode: NodeData;
}) => {
  const { control, getValues, setValue } =
    useFormContext<TAutomationBuilderForm>();
  const { getNodes, setNodes } = useReactFlow<Node<NodeData>>();

  const contentId = useWatch({
    control,
    name: `triggers.${activeNode.nodeIndex}`,
  })?.config?.contentId;

  const handleCallback = (contentId: string) => {
    const triggers = getValues('triggers');
    const updatedTriggers = triggers.map((trigger) =>
      trigger.id === activeNode.id
        ? { ...trigger, config: { ...(trigger?.config || {}), contentId } }
        : trigger,
    );

    const updatedNodes = updatedTriggers.map((trigger) =>
      generateNode(
        trigger as Extract<
          TAutomationNodeState,
          { nodeType: AutomationNodeType.Trigger }
        >,
        AutomationNodeType.Trigger,
        updatedTriggers || [],
        {},
        getNodes(),
      ),
    );

    setNodes((nodes) =>
      nodes.map((node) => {
        const updated = updatedNodes.find((n) => n.id === node.id);
        return updated ? updated : node;
      }),
    );

    setValue('triggers', updatedTriggers);
  };
  return {
    contentId,
    handleCallback,
  };
};
