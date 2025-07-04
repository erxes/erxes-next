import { ConnectionLineComponentProps } from '@xyflow/react';
import { cn } from 'erxes-ui';

// const checkIsOptionalConnect = (id = '') => {
//   const hasTwoHyphens = id.split('-').length - 1 === 2;

//   const endsWithRight = id.endsWith('right');

//   return hasTwoHyphens && endsWithRight;
// };

const ConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  ...props
}: ConnectionLineComponentProps) => {
  const { fromHandle, fromNode, toNode, connectionStatus } = props;
  //   const isOptionalConnect = checkIsOptionalConnect(fromHandle?.id);

  //   const isNear = Math.abs(toX - handleX) < 20 && Math.abs(toY - handleY) < 20;

  return (
    <g>
      <path
        fill="none"
        className={cn({
          'stroke-success': fromNode.type === 'action',
          'stroke-primary': fromNode.type === 'trigger',
          'stroke-red-300':
            fromNode?.data?.type === 'if' && fromHandle.id === 'no-right',
        })}
        strokeWidth={2}
        d={`M${fromX},${fromY} C${fromX + 50},${fromY} ${
          toX - 50
        },${toY} ${toX},${toY}`}
      />

      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={10}
        className={cn('fill-white stroke-success stroke-2', {
          'stroke-red-300':
            fromNode?.data?.type === 'if' && fromHandle.id === 'no-right',
        })}
        strokeWidth={4}
      />
    </g>
  );
};

export default ConnectionLine;
