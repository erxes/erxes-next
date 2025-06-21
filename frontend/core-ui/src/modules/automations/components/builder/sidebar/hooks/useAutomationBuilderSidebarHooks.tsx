import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useReactFlow } from '@xyflow/react';
import { useFormContext } from 'react-hook-form';

export const useAutomationBuilderSidebarHooks = () => {
  const { getNodes } = useReactFlow();
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const { queryParams, setQueryParams } = useAutomation();
  const [isMinimized, activeNode] = watch(['isMinimized', 'activeNode']);

  const handleClose = () => {
    setValue('activeNode', null);
    setValue('isMinimized', true);
    setQueryParams({
      activeNodeId: null,
    });
  };

  const handleBack = () => {
    setValue('activeNode', null);
    setQueryParams({
      activeNodeId: null,
      activeNodeTab: activeNode?.nodeType || null,
    });
  };

  return {
    getNodes,
    isMinimized,
    activeNode,
    queryParams,
    handleBack,
    handleClose,
    setValue,
  };
};
