import {
  CoreComponentType,
  isCoreAutomationActionType,
} from '@/automations/components/builder/nodes/actions/coreAutomationActions';
import { useAutomation } from '@/automations/context/AutomationProvider';
import { toggleAutomationBuilderOpenSidebar } from '@/automations/states/automationState';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { toast } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { useFormContext, useWatch } from 'react-hook-form';
import { getAutomationTypes } from 'ui-modules';

export const useAutomationActionContentSidebar = () => {
  const { queryParams, setQueryParams } = useAutomation();
  const { control, setValue } = useFormContext<TAutomationBuilderForm>();
  const toggleSideBarOpen = useSetAtom(toggleAutomationBuilderOpenSidebar);

  // Watch all actions once
  const actions = useWatch({ control, name: 'actions' }) || [];

  // Find the index of the active node by id
  const currentIndex = actions.findIndex(
    (action) => action.id === queryParams?.activeNodeId,
  );

  // Safely get currentAction, guard against -1
  const currentAction = currentIndex >= 0 ? actions[currentIndex] : null;

  // Pick component from Actions map or fallback to null

  const isCoreActionComponent = isCoreAutomationActionType(
    currentAction?.type as any,
    CoreComponentType.Sidebar,
  );

  const [pluginName, moduleName] = getAutomationTypes(
    currentAction?.type || '',
  );

  const onSaveActionRemoteConfig = (config: any) => {
    setValue(`actions.${currentIndex}.config`, config);
    setQueryParams({ activeNodeId: null });
    toggleSideBarOpen();
    toast({
      title: 'Action configuration added successfully.',
    });
  };

  return {
    isCoreActionComponent,
    control,
    currentIndex,
    currentAction,
    setQueryParams,
    setValue,
    toggleSideBarOpen,
    onSaveActionRemoteConfig,
    pluginName,
    moduleName,
  };
};
