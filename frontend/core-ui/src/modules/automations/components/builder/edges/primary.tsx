import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { IconScissors } from '@tabler/icons-react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { Button } from 'erxes-ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

type T = {
  name: 'actions' | 'triggers';
  field: 'nexActionId' | 'actionID';
  list: any[];
};

const Edge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  source,
  sourceHandleId,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const type = (data || {}).type as 'action' | 'trigger';
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');

  const types = {
    action: { list: actions, name: 'actions', field: 'nextActionId' },
    trigger: { list: triggers, name: 'triggers', field: 'actionId' },
  };

  const { name, list = [], field } = types[type] as T;

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
                setValue(
                  `detail.${name}`,
                  list.map((item) =>
                    item.id === source ? { ...item, [field]: undefined } : item,
                  ),
                );
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

export default Edge;
