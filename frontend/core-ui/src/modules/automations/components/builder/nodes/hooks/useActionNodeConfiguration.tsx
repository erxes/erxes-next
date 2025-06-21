import { useAutomationTrigger } from '@/automations/components/builder/hooks/useAutomationTrigger';
import {
  coreActionNames,
  coreActions,
} from '@/automations/components/builder/nodes/actions/coreActions';
import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { NodeData } from '@/automations/types';
import { Handle, Position } from '@xyflow/react';
import {
  AutomaitionActionNodeConfigProps,
  getAutomationTypes,
} from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const useActionNodeConfiguration = (data: NodeData) => {
  const { id, type = '', config } = data || {};
  const [pluginName, moduleName] = getAutomationTypes(type);
  const { trigger } = useAutomationTrigger(id);

  const isCoreAction = coreActionNames.includes(type);

  let Component = null;

  const actionNodeProps: AutomaitionActionNodeConfigProps = {
    componentType: 'actionNodeConfiguration',
    type,
    config,
    trigger,
  };

  if (!isCoreAction && pluginName !== 'core') {
    const { actionsConst = [] } = useAutomation();

    const { isAvailableOptionalConnect } =
      actionsConst.find(({ type: actionType }) => actionType === type) || {};

    Component = (
      <RenderPluginsComponent
        pluginName={`${pluginName}_ui`}
        remoteModuleName="automations"
        moduleName={moduleName}
        props={{
          ...actionNodeProps,
          OptionConnectHandle: OptionConnectHandle({
            id,
            isAvailableOptionalConnect,
          }),
        }}
      />
    );
  } else {
    if (type in coreActions) {
      const CoreActionComponent = coreActions[type as keyof typeof coreActions];
      Component = (
        <div className="px-4 py-2">
          <CoreActionComponent config={config} />
        </div>
      );
    }
  }

  return { Component };
};

const OptionConnectHandle = ({
  id,
  isAvailableOptionalConnect,
}: {
  id: string;
  isAvailableOptionalConnect?: boolean;
}) => {
  if (!isAvailableOptionalConnect) {
    return null;
  }

  return ({ optionalId }: { optionalId: string }) => (
    <Handle
      key={`${id}-${optionalId}-right`}
      id={`${id}-${optionalId}-right`}
      type="source"
      position={Position.Right}
      className={
        '!right-4 !w-4 !h-4 !bg-background !border !border-2 !rounded-full !border-accent-foreground !z-4'
      }
      isConnectable
      title="optional-connect"
    />
  );
};
