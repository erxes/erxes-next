import { useHistoryBeforeTitleContent } from '@/automations/components/builder/history/hooks/useHistoryBeforeTitleContent';
import { useAutomation } from '@/automations/context/AutomationProvider';
import {
  generateEdges,
  generateNodes,
} from '@/automations/utils/automationBuilderUtils';
import { Background, ConnectionMode, Controls, ReactFlow } from '@xyflow/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { IAutomationHistory } from 'ui-modules';
import PrimaryEdge from '../../edges/PrimaryEdge';
import ActionNode from '../../nodes/ActionNode';
import TriggerNode from '../../nodes/TriggerNode';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};
const edgeTypes = {
  primary: PrimaryEdge,
};

export const AutomationHistoryByFlow = ({
  history,
}: {
  history: IAutomationHistory;
}) => {
  const { triggersConst, actionsConst } = useAutomation();
  const { control } = useFormContext<TAutomationBuilderForm>();
  const [triggers = [], actions = []] = useWatch({
    control,
    name: ['triggers', 'actions'],
  });

  const { beforeTitleContent } = useHistoryBeforeTitleContent(history);
  const nodes = generateNodes(triggers, actions, {
    constants: { triggersConst, actionsConst },
    beforeTitleContent,
  });

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={generateEdges(triggers, actions)}
        fitView
        fitViewOptions={{ padding: 4, minZoom: 0.8 }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={true}
        elementsSelectable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
      >
        <Background gap={16} size={3} />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
};
