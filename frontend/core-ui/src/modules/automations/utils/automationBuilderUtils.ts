import { Edge, Node, Position } from '@xyflow/react';
import { IAction, ITrigger } from 'ui-modules';
import { AutomationConstants, IAutomation } from '../types';

type MyNodeData = {
  x: number;
  y: number;
  data: {
    automation: IAutomation;
    type: string;
    nodeType: string;
    actionType: string;
    triggerType?: string;
    icon: string;
    label: string;
    description: string;
    config: any;
    toggleDrawer: ({
      type,
      awaitingNodeId,
    }: {
      type: string;
      awaitingNodeId?: string;
    }) => void;
    onDoubleClick: (type: string, id: string) => void;
    removeItem: (type: string, id: string) => void;
    constants: AutomationConstants;
    forceToolbarVisible: boolean;
    toolbarPosition: Position;
    additionalContent?: (id: string, type: string) => React.ReactNode;
    addWorkFlowAction: (workflowId: string, actions: IAction[]) => void;
    removeWorkFlowAction?: (workflowId: string) => void;
  };
};

export const generatNodePosition = (
  nodes: IAction[] & ITrigger[],
  node: IAction & ITrigger,
  generatedNodes: Node<MyNodeData>[],
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
  generatedNodes: Node<MyNodeData>[],
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
      ...props,
    },
    position: generatNodePosition(nodes, node, generatedNodes),
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
  // if (triggers.length === 0 && actions.length === 0) {
  //   return [
  //     {
  //       id: 'scratch-node',
  //       type: 'scratch',
  //       data: props,
  //       position: { x: 0, y: 0 },
  //     },
  //   ];
  // }

  const generatedNodes: Node<MyNodeData>[] = [];

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
  onDisconnect,
}: {
  triggers: ITrigger[];
  actions: IAction[];
  workFlowActions?: { workflowId: string; actions: IAction[] }[];
  onDisconnect?: (edge: Edge) => void;
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
          onDisconnect,
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
  currentAction: IAction,
  actions: IAction[],
  triggers: ITrigger[],
): string => {
  const trigger = triggers.find((t) => t.actionId === currentAction.id);
  if (trigger) {
    return trigger.type;
  }

  // Find the parent action that leads to this current action
  const parentAction = actions.find((a) => a.nextActionId === currentAction.id);
  if (parentAction) {
    // Recursively call the function with the parent action
    return getContentType(parentAction, actions, triggers);
  }

  // Fallback if nothing found in the chain
  return triggers[0]?.type;
};
