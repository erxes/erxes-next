import { Handle, NodeProps, Position } from '@xyflow/react';
import { memo } from 'react';
import { IconAdjustmentsAlt, IconSunElectricity } from '@tabler/icons-react';
import { cn } from 'erxes-ui';
import { useFormContext } from 'react-hook-form';
import { ErrorState } from '../../../utils/ErrorState';
import { NodeDropdownActions } from './NodeDropdownActions';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { NodeData } from '@/automations/types';
import { TriggerNodeConfigurationContent } from '@/automations/components/builder/nodes/TriggerNodeConfigurationContent';

const renderContent = (data: NodeData) => {
  if (data?.error) {
    return (
      <ErrorState errorCode={'Invalid action'} errorDetails={data?.error} />
    );
  }

  if (!data?.isCustom) {
    return null;
  }

  if (!Object.keys(data?.config || {}).length) {
    return null;
  }

  const TriggerConfigContent = (
    <TriggerNodeConfigurationContent
      type={data.type || ''}
      config={data.config}
    />
  );
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-primary/90 pb-2">
        <IconAdjustmentsAlt className="w-4 h-4" />
        <p className="text-sm font-semibold">Configuration</p>
      </div>
      <div className="rounded border bg-muted overflow-x-auto text-muted-foreground text-xs font-mono">
        <TriggerNodeConfigurationContent
          type={data.type || ''}
          config={data.config}
        />
      </div>
    </div>
  );
};

const TriggerNode = ({ data, selected, id }: NodeProps<any>) => {
  const { setValue } = useFormContext<TAutomationProps>();

  const { beforeTitleContent } = data;

  return (
    <div className="flex flex-col ">
      <div className="w-1/4 ml-1 bg-primary/10 text-primary text-center px-2 py-1 rounded-t-md">
        <p className="font-medium font-bold">Trigger</p>
      </div>
      <div
        className={cn(
          'rounded-md shadow-md bg-background w-[280px] relative font-mono',
          selected ? 'ring-2 ring-primary ring-offset-2' : '',
          'transition-all duration-200',
          data?.error ? 'ring-2 ring-red-300 ring-offset-2' : '',
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-slate-200 gap-8">
          <div className="flex items-center gap-2 text-primary">
            {beforeTitleContent && beforeTitleContent(id, 'trigger')}
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center`}
            >
              <IconSunElectricity />
            </div>
            <div>
              <p className="font-medium ">{data.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <NodeDropdownActions id={id} data={data} setValue={setValue} />
          </div>
        </div>
        <div className="p-3">
          <span className="text-xs text-accent-foreground ">
            {data.description}
          </span>

          {renderContent(data)}
        </div>

        {/* Output handle */}
        <Handle
          key="right"
          id="right"
          type="source"
          position={Position.Right}
          className="!w-4 !h-4 -z-10 !bg-primary !border-white border-2 rounded-full"
        />
      </div>
    </div>
  );
};

export default memo(TriggerNode);
