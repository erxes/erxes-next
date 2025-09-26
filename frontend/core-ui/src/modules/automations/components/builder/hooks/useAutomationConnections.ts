import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { NodeData } from '@/automations/types';
import { onDisconnect } from '@/automations/utils/automationConnectionUtils';
import { Edge, EdgeProps, Node, useReactFlow } from '@xyflow/react';

export const useAutomationConnections = (edge: EdgeProps) => {
  const { triggers, actions, workflows } = useAutomationNodes();

  const { getNodes, setEdges, updateNodeData } = useReactFlow<
    Node<NodeData>,
    Edge<EdgeProps>
  >();

  const handleDisconnect = () =>
    onDisconnect({
      edge,
      setEdges,
      updateNodeData,
      nodes: getNodes(),
      triggers,
      actions,
      workflows,
    });

  return { handleDisconnect };
};
