import React, { FC } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { Button } from 'erxes-ui/components';
import { IconScissors } from '@tabler/icons-react';

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

  const { onDisconnect } = data || ({} as any);

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
                onDisconnect &&
                  onDisconnect({
                    id,
                    source,
                    sourceHandle: sourceHandleId,
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

export default Edge;
