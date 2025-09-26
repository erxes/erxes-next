import { useAutomationConnections } from '@/automations/components/builder/hooks/useAutomationConnections';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { NodeData } from '@/automations/types';
import { onDisconnect } from '@/automations/utils/automationConnectionUtils';
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
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

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
  const { handleDisconnect } = useAutomationConnections(edge);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <AnimatePresence>
        <motion.g
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BaseEdge id={id} path={edgePath} />
        </motion.g>
      </AnimatePresence>

      <EdgeLabelRenderer>
        <div
          className="absolute text-xs pointer-events-auto nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <AnimatePresence>
            {selected && (
              <motion.div
                key="scissors"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full"
                  size="icon"
                  onClick={handleDisconnect}
                >
                  <IconScissors className="w-4 h-4 text-red-500" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default PrimaryEdge;
