import { AutomationNodeType } from '@/automations/types';
import { automationNodePositionSchema } from '@/automations/utils/AutomationFormDefinitions';
import { z } from 'zod';

const dragginWorkflowNode = z.object({
  type: z.literal(AutomationNodeType.Workflow),
  automationId: z.string(),
  name: z.string(),
  description: z.string(),
});

const draggingCommonNode = z.object({
  type: z.union([
    z.literal(AutomationNodeType.Trigger),
    z.literal(AutomationNodeType.Action),
  ]),
  label: z.string(),
  description: z.string(),
  icon: z.string(),
  isCustom: z.boolean().optional(),
});

const dragginNodeProps = z.discriminatedUnion('type', [
  dragginWorkflowNode,
  draggingCommonNode,
]);

const droppedNodeProps = z.intersection(
  dragginNodeProps,
  z.object({
    nodeType: z.nativeEnum(AutomationNodeType),
    awaitingToConnectNodeId: z.string().optional(),
  }),
  z.object({
    type: z.literal(AutomationNodeType.Workflow),
    automationId: z.string(),
    position: automationNodePositionSchema,
  }),
);

export type TDroppedNode = z.infer<typeof droppedNodeProps>;
export type TDraggingNode = z.infer<typeof dragginNodeProps>;
