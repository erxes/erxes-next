import { getNewId } from '@/automations/utils/automationConnectionUtils';
import { ICustomer } from '@/contacts/types/customerType';
import { IUser } from '@/settings/team-member/types';
import { useQuery } from '@apollo/client';
import { Edge, Node } from '@xyflow/react';
import { IAction, ITrigger } from 'ui-modules';
import { GET_CUSTOMERS_EMAIL, GET_TEAM_MEMBERS_EMAIL } from '../graphql/utils';
import { AutomationDropHandlerParams, NodeData, TDraggingNode } from '../types';
import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';

export const generateNodePosition = (
  nodes: IAction[] & ITrigger[],
  node: IAction & ITrigger,
  generatedNodes: Node<NodeData>[],
) => {
  if (node.position) {
    if (
      generatedNodes.find(
        (generatedNode) =>
          generatedNode?.position?.x === node?.position?.x &&
          generatedNode?.position?.y === node?.position?.y,
      )
    ) {
      return {
        x: (node?.position?.x || 0) + 10,
        y: (node?.position?.y || 0) + 10,
      };
    }
    return node.position;
  }

  const targetField = node.type === 'trigger' ? 'actionId' : 'nextActionId';

  const prevNode = nodes.find((n: any) => n[targetField] === node.id);

  if (!prevNode) {
    return { x: 0, y: 0 };
  }

  const { position } = prevNode;

  return {
    x: position?.x + 500,
    y: position?.y,
  };
};

export const generateNode = (
  node: IAction & ITrigger,
  nodeType: string,
  nodes: IAction[] & ITrigger[],
  props: any,
  generatedNodes: Node<NodeData>[],
  parentId?: string,
) => {
  const {
    isAvailableOptionalConnect,
    id,
    label,
    description,
    icon,
    config,
    isCustom,
    nextActionId,
    actionId,
  } = node;

  const doc: any = {
    id,
    data: {
      label,
      description,
      icon,
      nodeType,
      type: node.type,
      isAvailableOptionalConnect,
      config,
      isCustom,
      nextActionId,
      actionId,
      ...props,
    },
    position: generateNodePosition(nodes, node, generatedNodes),
    isConnectable: true,
    type: nodeType,
    style: {
      zIndex: -1,
    },
  };

  // if (node.type === 'workflow') {
  //   doc.style = {
  //     backgroundColor: rgba(colors.colorPrimary, 0.12),
  //     border: `1px solid ${colors.borderPrimary}`,
  //     borderRadius: '8px',
  //     zIndex: -1,
  //   };
  // }

  if (parentId) {
    doc.parentId = parentId;
    doc.extent = 'parent';
    doc.expandParent = true;
    doc.draggable = false;
    doc.selectable = false;
    doc.connectable = false;
  }

  return doc;
};

export const generateNodes = (
  {
    actions = [],
    triggers = [],
    workFlowActions,
  }: {
    actions: IAction[];
    triggers: ITrigger[];
    workFlowActions?: { workflowId: string; actions: IAction[] }[];
  },
  props: any,
) => {
  if (triggers.length === 0 && actions.length === 0) {
    return [
      {
        id: 'scratch-node',
        type: 'scratch',
        data: props,
        position: { x: 0, y: 0 },
      },
    ];
  }

  const generatedNodes: Node<NodeData>[] = [];

  for (const { type, nodes = [] } of [
    { type: 'trigger', nodes: triggers },
    { type: 'action', nodes: actions },
  ]) {
    nodes.forEach((node, index) => {
      generatedNodes.push({
        ...generateNode(
          node,
          type,
          nodes,
          { ...props, nodeIndex: index },
          generatedNodes,
        ),
      });
    });
  }

  for (const { workflowId, actions } of workFlowActions || []) {
    for (const action of actions) {
      generatedNodes.push(
        generateNode(action, 'action', actions, props, [], workflowId),
      );
    }
  }

  return generatedNodes;
};

export const generateEdges = ({
  actions,
  triggers,
  workFlowActions,
}: {
  triggers: ITrigger[];
  actions: IAction[];
  workFlowActions?: { workflowId: string; actions: IAction[] }[];
}): Edge[] => {
  let generatedEdges: any = [];

  const commonStyle = {
    strokeWidth: 2,
  };

  const commonEdgeDoc = {
    updatable: 'target',
    sourceHandle: 'right',
    targetHandle: 'left',
  };

  for (const { type, edges } of [
    { type: 'trigger', edges: triggers },
    { type: 'action', edges: actions },
  ]) {
    const targetField = type === 'trigger' ? 'actionId' : 'nextActionId';

    for (const edge of edges) {
      const target = (edge as any)[targetField];

      const edgeObj = {
        ...commonEdgeDoc,
        id: `${type}-${edge.id}`,
        source: edge.id,
        target: target,
        style: { ...commonStyle },
        type: 'primary',
        data: {
          type,
        },
      };

      const {
        optionalConnects = [],
        workflowConnections = [],
        ...config
      } = edge?.config || {};

      if (edge.type === 'if') {
        const { yes, no } = config;

        for (const [key, value] of Object.entries({ yes, no })) {
          generatedEdges.push({
            ...edgeObj,
            id: `${type}-${edge.id}-${key}-${edgeObj.sourceHandle}`,
            sourceHandle: `${key}-${edgeObj.sourceHandle}`,
            target: value,
          });
        }
        continue;
      }

      if (!!optionalConnects?.length) {
        for (const {
          actionId,
          sourceId,
          optionalConnectId,
        } of optionalConnects) {
          if (!actionId) {
            continue;
          }
          generatedEdges.push({
            ...edgeObj,
            id: `${type}-${edge.id}-${optionalConnectId}`,
            sourceHandle: `${sourceId}-${optionalConnectId}-${edgeObj.sourceHandle}`,
            target: actionId,
            animated: true,
            style: { ...commonStyle },
          });
        }
      }

      if (type === 'action' && edge.workflowId && target) {
        const workflow = (workFlowActions || [])?.find(
          ({ workflowId, actions }) =>
            workflowId === edge.workflowId &&
            actions.some((ac) => ac.id === target),
        );

        if (workflow) {
        }
      }

      if (edgeObj.type === 'workflow') {
        if (
          workFlowActions?.find(
            ({ workflowId }) => edge.workflowId === workflowId,
          ) &&
          workflowConnections.length
        ) {
          for (const conn of workflowConnections) {
            generatedEdges.push({
              ...edgeObj,
              id: `${edge.workflowId}-${conn.id}`,
              target: conn.targetId,
              source: conn.sourceId,
              animated: true,
              style: { ...commonStyle },
            });
          }
        } else {
          const workflow = (workFlowActions || [])?.some(({ actions }) =>
            actions.some((action) => action.id !== target),
          );
          if (workflow) {
            edgeObj.target = undefined;
          }
        }
      }
      if (
        edge?.workflowId &&
        !(workFlowActions || [])?.some(
          (workFlowAction) => workFlowAction?.workflowId === edge?.workflowId,
        )
      ) {
        edgeObj.target = edge?.workflowId;
      }

      if (!edgeObj?.target) {
        continue;
      }

      generatedEdges.push(edgeObj);
    }
  }
  for (const { actions } of workFlowActions || []) {
    const workflowEdges = generateEdges({ actions, triggers: [] });
    generatedEdges = [...generatedEdges, ...workflowEdges];
  }

  return generatedEdges;
};

export const deepCleanNulls = (input: any): any => {
  if (Array.isArray(input)) {
    return input.map(deepCleanNulls);
  } else if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        value === null ? undefined : deepCleanNulls(value),
      ]),
    );
  }
  return input;
};

export const getContentType = (
  currentActionId: string,
  actions: IAction[],
  triggers: ITrigger[],
): ITrigger | undefined => {
  const trigger = triggers.find((t) => t.actionId === currentActionId);
  if (trigger) {
    return trigger;
  }

  // Find the parent action that leads to this current action
  const parentAction = actions.find((a) => a.nextActionId === currentActionId);
  if (parentAction) {
    // Recursively call the function with the parent action
    return getContentType(parentAction.id, actions, triggers);
  }

  // Fallback if nothing found in the chain
  return triggers[0];
};

export const getTriggerOfAction = (
  currentActionId: string,
  actions: IAction[],
  triggers: ITrigger[],
) => {
  // Build a map of nextActionId → actionId
  const reverseMap = new Map<string, string>();

  for (const { id, nextActionId } of actions) {
    if (nextActionId) {
      reverseMap.set(nextActionId, id);
    }
  }

  let cursor = currentActionId;

  // Walk backward
  while (cursor) {
    const trigger = triggers.find((t) => t.actionId === cursor);
    if (trigger) return trigger.type;

    cursor = reverseMap.get(cursor) ?? '';
  }

  return undefined;
};

export const generateSendEmailRecipientMails = ({
  attributionMails,
  customMails = [],
  customer = [],
  teamMember = [],
}: any) => {
  let mails = [];

  if (attributionMails) {
    mails.push(attributionMails);
  }
  if (customMails.length) {
    mails = [...mails, ...customMails];
  }

  if (customer.length) {
    const { data } = useQuery(GET_CUSTOMERS_EMAIL);

    const customerMails = (data?.list || [])
      .map(({ primaryEmail }: ICustomer) => primaryEmail)
      .filter((email: string) => email);
    mails = [...mails, ...customerMails];
  }
  if (teamMember.length) {
    const { data } = useQuery(GET_TEAM_MEMBERS_EMAIL);

    const teamMemberMails = (data?.list || [])
      .map(({ email }: IUser) => email)
      .filter((email: string) => email);
    mails = [...mails, ...teamMemberMails];
  }

  return mails;
};

export const automationDropHandler = ({
  event,
  reactFlowInstance,
  triggers,
  actions,
}: AutomationDropHandlerParams) => {
  event.preventDefault();

  const draggingNode = event.dataTransfer.getData(
    'application/reactflow/draggingNode',
  );

  const {
    nodeType,
    type,
    label,
    description,
    icon,
    isCustom,
    awaitingToConnectNodeId,
  } = JSON.parse(draggingNode || '{}') as TDraggingNode;

  if (!nodeType) {
    return {
      actions,
      triggers,
    };
  }

  const position = reactFlowInstance.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  const id = getNewId([...triggers, ...actions].map((a) => a.id));

  if (awaitingToConnectNodeId) {
    const [awaitingNodeType, nodeId, connectionFieldName] =
      awaitingToConnectNodeId.split('__') as [
        'trigger' | 'action',
        string,
        string | undefined,
      ];

    const isValidNodeType = ['trigger', 'action'].includes(awaitingNodeType);

    if (isValidNodeType && nodeId) {
      if (awaitingNodeType === 'trigger') {
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

  if (nodeType === 'trigger') {
    triggers = [
      ...triggers,
      {
        id,
        type,
        config: {},
        icon,
        label,
        description,
        isCustom,
        position,
      },
    ];
  } else {
    actions = [
      ...actions,
      {
        id,
        type,
        config: {},
        icon,
        label,
        description,
        isCustom,
        position,
      },
    ];
  }

  return {
    actions,
    triggers,
  };
};

const generateAwaitingNodeConnection = (
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

  return { ...node, [fieldName]: fieldValue };
};

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
