import { NodeData } from '@/automations/types';
import { onDisconnect } from '@/automations/utils/automationConnectionUtils';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { IconScissors } from '@tabler/icons-react';
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  Node,
  useReactFlow,
} from '@xyflow/react';
import { Button } from 'erxes-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';

const PrimaryEdge: FC<EdgeProps> = (edge) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
  } = edge;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { getNodes, setEdges } = useReactFlow<
    Node<NodeData>,
    Edge<EdgeProps>
  >();
  const [triggers = [], actions = []] = useWatch<TAutomationBuilderForm>({
    name: ['triggers', 'actions'],
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          className="absolute text-xs pointer-events-auto nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {selected && (
            <Button
              variant="outline"
              className="rounded-full"
              size="icon"
              onClick={() => {
                onDisconnect({
                  edge,
                  setEdges,
                  nodes: getNodes(),
                  triggers,
                  actions,
                });
              }}
            >
              <IconScissors className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default PrimaryEdge;
