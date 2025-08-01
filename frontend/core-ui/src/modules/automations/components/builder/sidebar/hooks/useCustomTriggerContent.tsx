import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { NodeData } from '@/automations/types';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { toast } from 'erxes-ui';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { getAutomationTypes } from 'ui-modules';

export const useCustomTriggerContent = (activeNode: NodeData) => {
  const { setValue } = useFormContext<TAutomationProps>();
  const { setQueryParams } = useAutomation();
  const [pluginName, moduleName] = useMemo(
    () => getAutomationTypes(activeNode.type || ''),
    [activeNode.type],
  );

  const onSaveTriggerConfig = (config: any) => {
    setValue(`detail.triggers.${activeNode.nodeIndex}.config`, config);
    setQueryParams({ activeNodeId: null });
    toast({
      title: 'Trigger configuration added successfully.',
    });
  };

  return {
    onSaveTriggerConfig,
    pluginName,
    moduleName,
  };
};
