import { AutomationNodeType } from '@/automations/types';
import { Edge } from '@xyflow/react';
import { IAction, ITrigger, IWorkflowNode, OptionalConnect } from 'ui-modules';

export const generateEdges = (
  triggers: ITrigger[],
  actions: IAction[],
  workFlows: IWorkflowNode[] = [],
): Edge[] => {
  const generatedEdges: Edge[] = [];

  // Common style & props reused across edges
  const commonStyle = { strokeWidth: 2 };
  const commonEdgeDoc = {
    updatable: 'target' as const,
    sourceHandle: 'right',
    targetHandle: 'left',
  };

  // Pre-index workflows for O(1) lookup
  const workflowMap = new Map<string, IWorkflowNode>(
    workFlows.map((wf) => [wf.id, wf]),
  );

  // --- Helper functions ---

  const buildPrimaryEdge = (
    nodeType: AutomationNodeType,
    sourceId: string,
    targetId: string,
  ): Edge => ({
    ...commonEdgeDoc,
    id: `${nodeType}-${sourceId}`,
    source: sourceId,
    target: targetId,
    style: commonStyle,
    type: 'primary',
    data: { type: nodeType },
  });

  const buildIfEdges = (
    nodeType: AutomationNodeType,
    edge: IAction,
    config: Record<string, any>,
  ): Edge[] => {
    const { yes, no } = config;
    return (['yes', 'no'] as const).flatMap((key) =>
      config[key]
        ? [
            {
              ...commonEdgeDoc,
              id: `${nodeType}-${edge.id}-${key}`,
              source: edge.id,
              sourceHandle: `${key}-right`,
              target: config[key],
              style: commonStyle,
              type: 'primary',
              data: { type: nodeType },
            },
          ]
        : [],
    );
  };

  const buildOptionalEdges = (
    nodeType: AutomationNodeType,
    edge: IAction,
    optionalConnects: OptionalConnect[],
  ): Edge[] =>
    optionalConnects.flatMap(({ actionId, sourceId, optionalConnectId }) =>
      actionId
        ? [
            {
              ...commonEdgeDoc,
              id: `${nodeType}-${edge.id}-${optionalConnectId}`,
              source: edge.id,
              sourceHandle: `${sourceId}-${optionalConnectId}-right`,
              target: actionId,
              animated: true,
              style: commonStyle,
              type: 'primary',
              data: { type: nodeType },
            },
          ]
        : [],
    );

  const buildWorkflowEdges = (
    nodeType: AutomationNodeType,
    edge: IAction,
  ): Edge[] => {
    if (nodeType !== AutomationNodeType.Action) return [];
    if (!edge.workflowId) return [];

    const workflow = workflowMap.get(edge.workflowId);
    if (!workflow?.config?.connections) return [];

    return workflow.config.connections
      .filter((conn: any) => conn.sourceActionId === edge.id)
      .map((conn: any) => {
        const { handle, sourceActionId, targetActionId } = conn;
        return {
          id: `workflow-${workflow.automationId}-${targetActionId}`,
          source: sourceActionId,
          target: workflow.id, // node ID
          sourceHandle: handle, // e.g. "right"
          targetHandle: `workflow-${workflow.automationId}-${targetActionId}-left`,
          type: 'primary',
          updatable: 'target' as const,
          style: commonStyle,
          data: {
            workflowId: workflow.id,
            targetActionId: targetActionId,
            handle: handle,
          },
        };
      });
  };

  // --- Main Loop ---
  for (const { type, edges } of [
    { type: AutomationNodeType.Trigger, edges: triggers },
    { type: AutomationNodeType.Action, edges: actions },
  ]) {
    const targetField =
      type === AutomationNodeType.Trigger ? 'actionId' : 'nextActionId';

    for (const edge of edges) {
      const target = (edge as any)[targetField];
      const { optionalConnects = [], ...config } = edge?.config || {};

      if (type === AutomationNodeType.Action) {
        if (edge.type === 'if') {
          generatedEdges.push(...buildIfEdges(type, edge as IAction, config));
          continue;
        }

        if (optionalConnects.length > 0) {
          generatedEdges.push(
            ...buildOptionalEdges(type, edge as IAction, optionalConnects),
          );
        }

        if (edge.workflowId) {
          generatedEdges.push(...buildWorkflowEdges(type, edge as IAction));
        }
      }

      if (target) {
        generatedEdges.push(buildPrimaryEdge(type, edge.id.toString(), target));
      }
    }
  }

  return generatedEdges;
};
