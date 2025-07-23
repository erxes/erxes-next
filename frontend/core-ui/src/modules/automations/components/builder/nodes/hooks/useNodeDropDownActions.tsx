import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const fields = {
  trigger: 'triggers',
  action: 'actions',
};

export const useNodeDropDownActions = (
  id: string,
  nodeType: 'trigger' | 'action',
) => {
  const { setQueryParams } = useAutomation();

  const { setValue, getValues } = useFormContext<TAutomationProps>();
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);

  const fieldName = fields[nodeType] as 'triggers' | 'actions';
  const actionFieldName =
    fieldName === 'triggers' ? 'actionId' : 'nextActionId';

  const onRemoveNode = () => {
    const nodes = getValues(`detail.${fieldName}`) || [];
    const updatedNodes = nodes
      .map((node: any) =>
        node[actionFieldName] === id
          ? { ...node, [actionFieldName]: undefined }
          : node,
      )
      .filter((node) => node.id !== id);

    setValue(`detail.${fieldName}`, updatedNodes);
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
