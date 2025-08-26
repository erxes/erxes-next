import { TDroppedNode } from '@/automations/components/builder/sidebar/states/automationNodeLibrary';
import {
  AutomationDropHandlerParams,
  AutomationNodesType,
  AutomationNodeType,
} from '@/automations/types';
import { handleConnectionAwaitingNode } from '@/automations/utils/automationBuilderUtils/awaitingConnectionHandler';
import { generateNode } from '@/automations/utils/automationBuilderUtils/generateNodes';
import { TAutomationNodeState } from '@/automations/utils/AutomationFormDefinitions';
import {
  generateAutomationElementId,
  IAction,
  ITrigger,
  IWorkflowNode,
} from 'ui-modules';

/**
 * Handles the drop event on the automation canvas, allowing
 * users to add triggers or actions by dragging them onto the flow.
 *
 * @param params - The parameters including the drop event, react flow instance,
 * triggers list, and actions list.
 */

export const automationDropHandler = ({
  triggers,
  actions,
  workflows,
  event,
  reactFlowInstance,
  addNodes,
  getNodes,
}: AutomationDropHandlerParams): {
  [AutomationNodesType.Actions]: IAction[];
  [AutomationNodesType.Triggers]: ITrigger[];
  [AutomationNodesType.Workflows]?: IWorkflowNode[];
  newNodeId?: string;
} => {
  event.preventDefault();

  const draggingNode = JSON.parse(
    event.dataTransfer.getData('application/reactflow/draggingNode') || '{}',
  ) as TDroppedNode;

  const { nodeType, awaitingToConnectNodeId } = draggingNode;

  if (!nodeType) {
    return {
      actions,
      triggers,
      workflows,
    };
  }

  const position = reactFlowInstance?.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  const id = generateAutomationElementId(
    [...triggers, ...actions, ...(workflows || [])].map((a) => a.id),
  );

  handleConnectionAwaitingNode({
    triggers,
    actions,
    workflows,
    awaitingToConnectNodeId,
    type: nodeType,
    id,
  });

  if (nodeType === AutomationNodeType.Trigger) {
    const { icon, type, label, description, isCustom } = draggingNode;
    const newNode = {
      id,
      type,
      nodeType,
      config: {},
      icon,
      label,
      description,
      isCustom,
      position,
    };
    const generatedNode = generateNode(
      newNode as Extract<
        TAutomationNodeState,
        { nodeType: AutomationNodeType.Trigger }
      >,
      AutomationNodeType.Trigger,
      triggers || [],
      { nodeIndex: (triggers || []).length },
      getNodes(),
    );
    addNodes(generatedNode);
    triggers = [...triggers, newNode];
  }
  if (nodeType === AutomationNodeType.Workflow) {
    const { name, description, automationId } = draggingNode;

    const newNode = {
      id,
      name: name,
      description,
      position,
      config: {},
      automationId: automationId,
    };

    const generatedNode = generateNode(
      newNode as Extract<
        TAutomationNodeState,
        { nodeType: AutomationNodeType.Workflow }
      >,
      AutomationNodeType.Workflow,
      workflows || [],
      { nodeIndex: (workflows || []).length },
      getNodes(),
    );
    addNodes(generatedNode);
    workflows = [...(workflows || []), newNode];
  }
  if (nodeType === AutomationNodeType.Action) {
    const { icon, label, isCustom, description, type } = draggingNode;
    const newNode = {
      id,
      type,
      nodeType,
      config: {},
      icon,
      label,
      description,
      isCustom,
      position,
    };

    const generatedNode = generateNode(
      newNode as Extract<
        TAutomationNodeState,
        { nodeType: AutomationNodeType.Action }
      >,
      AutomationNodeType.Action,
      actions || [],
      { nodeIndex: (actions || []).length },
      getNodes(),
    );
    addNodes(generatedNode);
    actions = [...actions, newNode];
  }

  return { triggers, actions, workflows, newNodeId: id };
};
