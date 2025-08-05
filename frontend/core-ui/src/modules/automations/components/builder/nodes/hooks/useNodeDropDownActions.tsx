import { useAutomation } from '@/automations/context/AutomationProvider';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
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
  const { queryParams, setQueryParams } = useAutomation();

  const { setValue, getValues } = useFormContext<TAutomationBuilderForm>();
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);

  const fieldName = fields[nodeType] as 'triggers' | 'actions';
  const actionFieldName =
    fieldName === 'triggers' ? 'actionId' : 'nextActionId';

  const onRemoveNode = () => {
    const nodes = getValues(`${fieldName}`) || [];
    const updatedNodes = nodes
      .map((node: any) =>
        node[actionFieldName] === id
          ? { ...node, [actionFieldName]: undefined }
          : node,
      )
      .filter((node) => node.id !== id);

    setValue(`${fieldName}`, updatedNodes);

    if (queryParams?.activeNodeId === id) {
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
