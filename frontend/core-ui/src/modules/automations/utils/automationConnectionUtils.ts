import { CONNECTION_PROPERTY_NAME_MAP } from '@/automations/constants';
import { AutomationNodeType, NodeData } from '@/automations/types';
import { TAutomationWorkflow } from '@/automations/utils/automationFormDefinitions';
import {
  Connection,
  Edge,
  EdgeProps,
  getOutgoers,
  Node,
  useReactFlow,
} from '@xyflow/react';
import { SetStateAction } from 'jotai';
import { Dispatch } from 'react';
import {
  TAutomationAction,
  TAutomationTrigger,
  TAutomationWorkflowNode,
  TAutomationOptionalConnect,
} from 'ui-modules';

export const connectionHandler = (
  triggers: TAutomationTrigger[],
  actions: TAutomationAction[],
  info: any,
  actionId: string,
  workFlows: TAutomationWorkflow[],
) => {
  const { sourceId, type, connectType, optionalConnectId } = info || {};

  if (type === 'trigger') {
    const trigger = triggers.find((t) => t.id.toString() === sourceId);

    if (trigger) {
      trigger.actionId = actionId;
    }
    return { triggers, actions, workFlows };
  }
  const sourceAction = actions.find((a) => a.id.toString() === sourceId);

  if (!sourceAction) {
    return { triggers, actions, workFlows };
  }

  if (sourceAction.type === 'if' && info.sourceHandle) {
    if (!sourceAction.config) {
      sourceAction.config = {};
    }

    const [sourceHandle] = info.sourceHandle.split('-');

    sourceAction.config[sourceHandle] = actionId;
    return { triggers, actions, workFlows };
  }

  if (connectType === 'optional') {
    const sourceConfig = sourceAction?.config || {};

    const optionalConnects = sourceConfig?.optionalConnects || [];

    //update optionalConnects if optional connect exists in sourceAction
    let updatedOptionalConnects = optionalConnects.map(
      (optConnect: TAutomationOptionalConnect) =>
        optConnect.sourceId === sourceId &&
        optConnect.optionalConnectId === info.optionalConnectId
          ? { ...optConnect, actionId }
          : optConnect,
    );

    // add optionalConnect if optional connect not exists in sourceAction
    if (
      !optionalConnects.some(
        (optConnect: TAutomationOptionalConnect) =>
          optConnect.sourceId === sourceId &&
          optConnect.optionalConnectId === info?.optionalConnectId,
      )
    ) {
      updatedOptionalConnects.push({
        sourceId,
        actionId,
        optionalConnectId: info?.optionalConnectId,
      });
    }

    // disconnect optionalConnect if optional connect exists in sourceAction but info.optionalConnectId is undefined

    if (
      optionalConnects.some(
        (optConnect: TAutomationOptionalConnect) =>
          optConnect.sourceId === sourceId &&
          optConnect.optionalConnectId === optionalConnectId,
      )
    ) {
      updatedOptionalConnects = optionalConnects.filter(
        (optConnect: TAutomationOptionalConnect) =>
          optConnect.optionalConnectId !== optionalConnectId,
      );
    }

    sourceAction.config = {
      ...sourceConfig,
      optionalConnects: updatedOptionalConnects,
    };
    return { triggers, actions, workFlows };
  }
  if (connectType === 'workflow') {
    const workFlow = workFlows.find(
      ({ automationId }) => automationId === info.automationId,
    );

    if (workFlow) {
      if (!workFlow.config) {
        workFlow.config = {};
      }
      const existingConnections = workFlow.config.connections || [];
      const { sourceId, sourceHandle, actionId } = info;

      let updatedConnections = existingConnections.map((conn: any) =>
        conn.sourceActionId === sourceId && conn.handle === sourceHandle
          ? { ...conn, targetActionId: actionId }
          : conn,
      );

      if (
        !existingConnections.some(
          (conn: any) =>
            conn.sourceActionId === sourceId && conn.handle === sourceHandle,
        )
      ) {
        updatedConnections.push({
          sourceActionId: sourceId,
          handle: sourceHandle,
          targetActionId: actionId,
        });
      }

      workFlow.config = {
        ...workFlow.config,
        connections: updatedConnections,
      };
      const sourceAction = actions.find((a) => a.id.toString() === sourceId);
      if (sourceAction) {
        sourceAction.workflowId = workFlow.id; // save workflow reference
      }
    }
    return { triggers, actions, workFlows };
  }

  if (info?.sourceType === AutomationNodeType.Workflow) {
    const sourceWorkflow = workFlows.find(({ id }) => id === info.sourceId);
    if (sourceWorkflow) {
      if (!sourceWorkflow.config) {
        sourceWorkflow.config = {};
      }
      sourceWorkflow.nextActionId = info.targetId;
    }
    return { triggers, actions, workFlows };
  }
  sourceAction.nextActionId = actionId;
  return { triggers, actions, workFlows };
};

export const generateConnectInfo = (
  params: Connection,
  source?: Node<NodeData>,
) => {
  const { sourceHandle, targetHandle } = params;

  let info: any = {
    ...params,
    sourceId: params.source,
    targetId: params.target,
    type: source?.data?.nodeType,
  };

  if (sourceHandle) {
    if (sourceHandle.includes(params?.source)) {
      const [_sourceId, optionalConnectId] = sourceHandle.split('-');
      info.optionalConnectId = optionalConnectId;
      info.connectType = 'optional';
    }
  }
  if (targetHandle?.includes('workflow')) {
    const [_, automationId, actionId] = targetHandle.split('-');
    info.automationId = automationId;
    info.actionId = actionId;
    info.connectType = 'workflow';
  }

  if (source?.type === AutomationNodeType.Workflow) {
    info.sourceType = AutomationNodeType.Workflow;
  }

  return info;
};

export const checkIsValidConnect = ({
  nodes,
  edges,
  connection,
  triggersConst,
  actionsConst,
}: {
  nodes: Node<NodeData>[];
  connection: Connection;
  edges: Edge[];
  triggersConst: any[];
  actionsConst: any[];
}) => {
  const target = nodes.find((node) => node.id === connection.target);
  const source = nodes.find((node) => node.id === connection.source);

  const hasCycle = (node: Node<NodeData>, visited = new Set()) => {
    if (node?.data?.nodeType === 'trigger') return true;
    if (visited.has(node.id)) return false;

    visited.add(node.id);

    for (const outgoer of getOutgoers(node, nodes, edges)) {
      if (outgoer.id === connection.source) return true;
      if (hasCycle(outgoer, visited)) return true;
    }
  };

  if (!target || !source) {
    return false;
  }

  const allNodes = [...triggersConst, ...actionsConst];
  const sourceDef = allNodes.find((n) => n.type === source.data?.type);

  if (
    sourceDef?.connectableActionTypes &&
    !sourceDef.connectableActionTypes.includes(target.data?.type)
  ) {
    return false;
  }

  return !hasCycle(target);
};

export const onDisconnect = ({
  edge,
  setEdges,
  updateNodeData,
  nodes,
  triggers,
  actions,
  workflows,
}: {
  edge: EdgeProps;
  setEdges: Dispatch<SetStateAction<Edge<EdgeProps>[]>>;
  updateNodeData: (
    id: string,
    dataUpdate: Partial<Node['data']> | ((node: Node) => Partial<Node['data']>),
    options?: {
      replace: boolean;
    },
  ) => void;
  nodes: Node<NodeData>[];
  triggers: TAutomationTrigger[];
  actions: TAutomationAction[];
  workflows: TAutomationWorkflowNode[];
}) => {
  setEdges((eds: Edge<EdgeProps>[]) => eds.filter((e) => e.id !== edge.id));
  const info: any = { source: edge.source, target: undefined };

  const sourceNode = nodes.find((n) => n.id === edge.source);

  if ((edge?.sourceHandleId || '').includes(sourceNode?.id || '')) {
    const [_action, _sourceId, optionalConnectId] = (edge.id || '').split('-');
    info.optionalConnectId = optionalConnectId;
    info.connectType = 'optional';
  }

  connectionHandler(
    triggers,
    actions,
    generateConnectInfo(
      {
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandleId || '',
        targetHandle: edge.targetHandleId || '',
      },
      sourceNode,
    ),
    info.targetId,
    workflows,
  );
  if (sourceNode) {
    const { id, data } = sourceNode;

    const propertyName = CONNECTION_PROPERTY_NAME_MAP[data.nodeType];

    updateNodeData(id, { ...data, [propertyName]: undefined });
  }
};
