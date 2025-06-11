import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { ReactFlow, Background, ConnectionMode, Controls } from '@xyflow/react';
import {
  generateEdges,
  generateNodes,
} from '@/automations/utils/automationBuilderUtils';
import ActionNode from '../nodes/Action';
import TriggerNode from '../nodes/Trigger';
import PrimaryEdge from '../edges/primary';
import { IAction, ITrigger } from 'ui-modules';
import { IAutomationHistory } from '@/automations/types';

const nodeTypes = {
  trigger: TriggerNode as any,
  action: ActionNode as any,
};
const edgeTypes = {
  primary: PrimaryEdge,
};

export const AutomationHistoryByFlow = ({
  constants,
  history,
}: {
  history: IAutomationHistory;
  constants: { triggersConst: ITrigger[]; actionsConst: IAction[] };
}) => {
  const { watch } = useFormContext<TAutomationProps>();

  const { triggers = [], actions = [] } = watch('detail') || {};

  const additionalContent = () => {
    return null;
  };

  return (
    <div className="h-full sdhasjdksa">
      <ReactFlow
        nodes={generateNodes(
          { triggers: triggers, actions: actions },
          { constants, additionalContent },
        )}
        edges={generateEdges({ triggers, actions })}
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
