import ActionNode from '@/automations/components/builder/nodes/ActionNode';
import { PlaceHolderNode } from '@/automations/components/builder/nodes/PlaceHolderNode';
import TriggerNode from '@/automations/components/builder/nodes/TriggerNode';
import WorkflowNode from '@/automations/components/builder/nodes/WorkflowNode';

export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  workflow: WorkflowNode,
  scratch: PlaceHolderNode,
};
