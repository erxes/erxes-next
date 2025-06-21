import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { IconLinkPlus, IconPlus } from '@tabler/icons-react';
import { Handle, Position } from '@xyflow/react';
import { Button, cn } from 'erxes-ui';
import React, { memo, useCallback, useMemo } from 'react';

interface NodeOutputHandlerProps extends React.HTMLAttributes<HTMLDivElement> {
  handlerId: string;
  nodeType: 'trigger' | 'action';
  showAddButton: boolean;
  addButtonClassName?: string;
}

const AwaitToConnectButton = memo(
  ({
    nodeType,
    nodeHandleId,
    showAddButton,
    addButtonClassName,
  }: {
    nodeType: string;
    showAddButton: boolean;
    addButtonClassName?: string;
    nodeHandleId: string;
  }) => {
    if (!showAddButton) {
      return null;
    }

    const { awaitingToConnectNodeId, setAwaitingToConnectNodeId } =
      useAutomation();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setAwaitingToConnectNodeId(
          awaitingToConnectNodeId === nodeHandleId ? '' : nodeHandleId,
        );
      },
      [awaitingToConnectNodeId, nodeHandleId],
    );
    return (
      <div
        className={`absolute flex items-center top-1/2 -translate-y-1/2 translate-x-[15px] pointer-events-none`}
      >
        <div className={`bg-accent-foreground h-[1px] w-10 -z-1`} />
        <div className="nodrag nopan pointer-events-auto">
          <Button
            onClick={handleClick}
            size="sm"
            variant="ghost"
            className={cn(
              'rounded border border-2 border-dashed text-accent-foreground',
              addButtonClassName,
            )}
          >
            {awaitingToConnectNodeId === nodeHandleId ? (
              <IconLinkPlus
                className={`text-${
                  nodeType === 'trigger' ? 'primary' : 'success'
                }`}
              />
            ) : (
              <IconPlus />
            )}
          </Button>
        </div>
      </div>
    );
  },
);

export const NodeOutputHandler = memo(
  React.forwardRef<HTMLDivElement, NodeOutputHandlerProps>(
    function NodeOutputHandler(props, ref) {
      const {
        className,
        addButtonClassName,
        showAddButton,
        nodeType,
        handlerId,
        onClick,
        children,
        ...rest
      } = props;

      const nodeHandleId = `${nodeType}__${handlerId}`;

      return (
        <Handle
          key="right"
          id="right"
          type="source"
          position={Position.Right}
          className={cn('!w-4 !h-4 -z-10', className)}
          {...rest}
        >
          <>
            <AwaitToConnectButton
              showAddButton={showAddButton}
              addButtonClassName={addButtonClassName}
              nodeType={nodeType}
              nodeHandleId={nodeHandleId}
            />
            {children}
          </>
        </Handle>
      );
    },
  ),
);
