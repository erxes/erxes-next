import { NodeDropdownActions } from '@/automations/components/builder/nodes/NodeDropdownActions';
import { IconArrowsSplit2 } from '@tabler/icons-react';
import { Node, NodeProps } from '@xyflow/react';
import { cn } from 'erxes-ui';
import { memo } from 'react';

const WorkflowNode = ({ data, selected, id }: NodeProps<Node<any>>) => {
  console.log({ data });
  return (
    <div className="flex flex-col ">
      <div className="w-2/5 ml-1 bg-warning/10 text-warning text-center px-2 py-1 rounded-t-md">
        <p className="font-medium font-bold">Workflow</p>
      </div>
      <div
        className={cn(
          'rounded-md shadow-md bg-background w-[280px] relative font-mono',
          selected ? 'ring-2 ring-warning ring-offset-2' : '',
          'transition-all duration-200',
          data?.error ? 'ring-2 ring-red-300 ring-offset-2' : '',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-200 gap-8">
          <div className="flex items-center gap-2 text-warning">
            <div className="size-6 rounded-full flex items-center justify-center">
              <IconArrowsSplit2 />
            </div>
            <p className="font-medium">{data.name}</p>
          </div>

          <div className="flex items-center gap-1">
            <NodeDropdownActions id={id} data={data} />
          </div>
        </div>
        <div className="p-3">
          <span className="text-xs text-accent-foreground ">
            {data.description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(WorkflowNode);
