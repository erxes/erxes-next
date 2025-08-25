import { useAutomation } from '@/automations/context/AutomationProvider';
import {
  AutomationNodesType,
  AutomationNodeType,
  NodeData,
} from '@/automations/types';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { Node, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const fields: Record<AutomationNodeType, AutomationNodesType> = {
  [AutomationNodeType.Trigger]: AutomationNodesType.Triggers,
  [AutomationNodeType.Action]: AutomationNodesType.Actions,
  [AutomationNodeType.Workflow]: AutomationNodesType.Workflows,
};

export const useNodeDropDownActions = (
  id: string,
  nodeType: AutomationNodeType,
) => {
  const { queryParams, setQueryParams } = useAutomation();
  const { setNodes } = useReactFlow<Node<NodeData>>();

  const { setValue, getValues } = useFormContext<TAutomationBuilderForm>();
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);

  const fieldName = fields[nodeType] as AutomationNodesType;
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

    setNodes((nodes) => nodes.filter((n) => n.id !== id));
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
