import { useAutomation } from '@/automations/context/AutomationProvider';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { NodeData } from '@/automations/types';
import { generateEdges } from '@/automations/utils/automationBuilderUtils/generateEdges';
import {
  checkIsValidConnect,
  connectionHandler,
  generateConnect,
} from '@/automations/utils/automationConnectionUtils';
import { addEdge, Connection, Node, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

export const useNodeConnect = () => {
  const { triggers, actions, workflows, setNodesChangeToState } =
    useAutomationNodes();
  const { getNodes, getEdges, getNode, setEdges } =
    useReactFlow<Node<NodeData>>();

  const nodes = getNodes();
  const edges = getEdges();

  const { triggersConst, actionsConst } = useAutomation();
  const onConnection = (info: any) => {
    const {
      triggers: updatedTriggers,
      actions: updatedActions,
      workFlows: updateWorkflows,
    } = connectionHandler(triggers, actions, info, info.targetId, workflows);

    setNodesChangeToState({
      newTriggers: updatedTriggers,
      newActions: updatedActions.map((action) => ({
        ...action,
        config: action.config || {},
      })),
      newWorkflows: updateWorkflows,
    });
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const source = getNode(params.source);
      setEdges((eds) => {
        const updatedEdges = addEdge({ ...params }, eds);

        console.log({ params, source, updatedEdges });

        onConnection(generateConnect(params, source));

        return updatedEdges;
      });
    },
    [nodes],
  );

  const isValidConnection = useCallback(
    (connection: Connection) =>
      checkIsValidConnect({
        nodes,
        edges,
        connection,
        triggersConst,
        actionsConst,
      }),
    [nodes, edges],
  );

  return {
    isValidConnection,
    onConnect,
    onConnection,
  };
};
