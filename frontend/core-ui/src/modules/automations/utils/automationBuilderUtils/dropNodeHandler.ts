import { TDroppedNode } from '@/automations/components/builder/sidebar/states/automationNodeLibrary';
import { AUTOMATION_NODE_TYPE_LIST_PROERTY } from '@/automations/constants';
import {
  AutomationDropHandlerParams,
  AutomationNodesType,
  AutomationNodeType,
} from '@/automations/types';
import { handleConnectionAwaitingNode } from '@/automations/utils/automationBuilderUtils/awaitingConnectionHandler';
import { generateNode } from '@/automations/utils/automationBuilderUtils/generateNodes';
import {
  TAutomationBuilderForm,
  TAutomationNodeState,
} from '@/automations/utils/automationFormDefinitions';
import { XYPosition } from '@xyflow/react';
import { generateAutomationElementId } from 'ui-modules';

/**
 * Handles the drop event on the automation canvas, allowing
 * users to add triggers or actions by dragging them onto the flow.
 *
 * @param params - The parameters including the drop event, react flow instance,
 * triggers list, and actions list.
 */

const generateNewNode = ({
  draggingNode,
  id,
  position,
}: {
  draggingNode: TDroppedNode;
  id: string;
  position?: XYPosition;
}) => {
  const nodeType = draggingNode.nodeType;

  if (nodeType === AutomationNodeType.Trigger) {
    const { icon, type, label, description, isCustom } = draggingNode;
    return {
      id,
      type,
      config: {},
      icon,
      label,
      description,
      isCustom,
      position,
    };
  }

  if (nodeType === AutomationNodeType.Action) {
    const { icon, label, isCustom, description, type } = draggingNode;
    return {
      id,
      type,
      config: {},
      icon,
      label,
      description,
      isCustom,
      position,
    };
  }
  if (nodeType === AutomationNodeType.Workflow) {
    const { name, description, automationId } = draggingNode;

    return {
      id,
      name: name,
      description,
      position,
      config: {},
      automationId,
    };
  }
};

export const automationDropHandler = ({
  triggers,
  actions,
  workflows,
  event,
  reactFlowInstance,
  getNodes,
}: AutomationDropHandlerParams): {
  // [AutomationNodesType.Actions]: TAutomationBuilderForm[AutomationNodesType.Actions];
  // [AutomationNodesType.Triggers]: TAutomationBuilderForm[AutomationNodesType.Triggers];
  // [AutomationNodesType.Workflows]?: TAutomationBuilderForm[AutomationNodesType.Workflows];
  newNodeId?: string;
  generatedNode?: any;
  newNode: any;
  nodeType: AutomationNodeType;
} => {
  event.preventDefault();

  const draggingNode = JSON.parse(
    event.dataTransfer.getData('application/reactflow/draggingNode') || '{}',
  ) as TDroppedNode;

  const { nodeType, awaitingToConnectNodeId } = draggingNode;

  // if (!nodeType) {
  //   return null as any
  // }

  const position = reactFlowInstance?.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  const id = generateAutomationElementId(
    [...triggers, ...actions, ...(workflows || [])].map((a) => a.id),
  );

  const map = { triggers, actions, workflows };

  const nodes = map[AUTOMATION_NODE_TYPE_LIST_PROERTY[nodeType]] || [];

  const newNode = generateNewNode({ draggingNode, id, position });
  const generatedNode = generateNode(
    { ...newNode, nodeType } as Extract<
      TAutomationNodeState,
      { nodeType: typeof nodeType }
    >,
    AutomationNodeType.Trigger,
    nodes,
    { nodeIndex: nodes.length },
    getNodes(),
  );

  handleConnectionAwaitingNode({
    triggers,
    actions,
    workflows,
    awaitingToConnectNodeId,
    type: nodeType,
    id,
  });

  return { newNodeId: id, generatedNode, newNode, nodeType };
};
