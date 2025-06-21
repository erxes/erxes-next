import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const fields = {
  trigger: 'triggers',
  action: 'actions',
};

export const useNodeDropDrownActions = (
  id: string,
  nodeType: 'trigger' | 'action',
) => {
  const { setQueryParams } = useAutomation();

  const { setValue, getValues } = useFormContext<TAutomationProps>();
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);

  const fieldName = fields[nodeType] as 'triggers' | 'actions';

  const onRemoveNode = () => {
    const nodes = getValues(`detail.${fieldName}`) || [];

    setValue(
      `detail.${fieldName}`,
      nodes.filter((node) => node.id !== id),
    );
    const activeNode = getValues('activeNode');

    if (activeNode?.id === id) {
      setValue('activeNode', null);
      setQueryParams({ activeNodeId: null });
    }
  };

  return {
    fieldName,
    isOpenDialog,
    isOpenDropDown,
    setOpenDialog,
    setOpenDropDown,
    onRemoveNode,
  };
};
