import { AutomationNodeType } from '@/automations/types';
import { IAction, ITrigger, IWorkflowNode } from 'ui-modules';

function setNestedField(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;

  keys.slice(0, -1).forEach((key) => {
    if (!current[key]) current[key] = {};
    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Generates a connection object or configuration for an awaiting node in an automation flow.
 *
 * @param node - The action or trigger node object to generate the connection for.
 * @param nodeType - A string representing the type of the node (e.g., 'action', 'trigger').
 * @param actionId - The ID of the action to connect or link.
 * @param connectionFieldName - Optional field name that specifies the connection property on the node.
 * @returns The generated connection object or configuration (adjust return type as needed).
 */

export const generateAwaitingNodeConnection = (
  node: IAction | ITrigger,
  nodeType: string,
  actionId: string,
  connectionFieldName?: string,
) => {
  let fieldName = nodeType === 'trigger' ? 'actionId' : 'nextActionId';
  let fieldValue = actionId;

  if (connectionFieldName) {
    fieldName = `config`;

    fieldValue = setNestedField(
      { ...(node?.config || {}) },
      connectionFieldName,
      actionId,
    );
  }

  return { ...node, [fieldName]: fieldValue } as any;
};

export const handleConnectionAwaitingNode = ({
  triggers,
  actions,
  id,
  awaitingToConnectNodeId,
  type,
}: {
  id: string;
  awaitingToConnectNodeId?: string;
  triggers: ITrigger[];
  type:
    | AutomationNodeType.Action
    | AutomationNodeType.Trigger
    | AutomationNodeType.Workflow;
  actions: IAction[];
  workflows?: IWorkflowNode[];
}) => {
  if (awaitingToConnectNodeId && type !== AutomationNodeType.Workflow) {
    const [awaitingNodeType, nodeId, connectionFieldName] =
      awaitingToConnectNodeId.split('__') as [
        AutomationNodeType,
        string,
        string | undefined,
      ];

    const isValidNodeType = [
      AutomationNodeType.Trigger,
      AutomationNodeType.Action,
    ].includes(awaitingNodeType);

    if (isValidNodeType && nodeId) {
      if (awaitingNodeType === AutomationNodeType.Trigger) {
        triggers = triggers.map((trigger) =>
          trigger.id === nodeId
            ? generateAwaitingNodeConnection(
                trigger,
                awaitingNodeType,
                id,
                connectionFieldName,
              )
            : trigger,
        );
      } else {
        actions = actions.map((action) =>
          action.id === nodeId
            ? generateAwaitingNodeConnection(
                action,
                awaitingNodeType,
                id,
                connectionFieldName,
              )
            : action,
        );
      }
    }
  }
};
