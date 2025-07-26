import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import {
  AUTOMATION_CREATE,
  AUTOMATION_EDIT,
} from '@/automations/graphql/automationMutations';
import {
  automationBuilderActiveTabState,
  automationBuilderSiderbarOpenState,
  toggleAutomationBuilderOpenSidebar,
} from '@/automations/states/automationState';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { useMutation } from '@apollo/client';
import { useReactFlow } from '@xyflow/react';
import { useToast } from 'erxes-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import { SubmitErrorHandler, useFormContext, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';

export const useAutomationHeader = () => {
  const { control, handleSubmit, clearErrors } =
    useFormContext<TAutomationBuilderForm>();

  const { setQueryParams, reactFlowInstance } = useAutomation();
  const activeTab = useAtomValue(automationBuilderActiveTabState);
  const isOpenSideBar = useAtomValue(automationBuilderSiderbarOpenState);
  const toggleSideBarOpen = useSetAtom(toggleAutomationBuilderOpenSidebar);

  const { getNodes, setNodes } = useReactFlow();
  const { toast } = useToast();
  const { id } = useParams();

  const {
    triggers = [],
    actions = [],
    name = '',
    status = 'draft',
  } = useWatch({
    control,
  });

  const [save, { loading }] = useMutation(
    id ? AUTOMATION_EDIT : AUTOMATION_CREATE,
  );

  const handleSave = (values: TAutomationBuilderForm) => {
    const generateValues = () => {
      return {
        id,
        name,
        status: status,
        triggers: triggers.map((t: any) => ({
          id: t.id,
          type: t.type,
          config: t.config,
          icon: t.icon,
          label: t.label,
          description: t.description,
          actionId: t.actionId,
          position: t.position,
          isCustom: t.isCustom,
          workflowId: t.workflowId,
        })),
        actions: actions.map((a: any) => ({
          id: a.id,
          type: a.type,
          nextActionId: a.nextActionId,
          config: a.config,
          icon: a.icon,
          label: a.label,
          description: a.description,
          position: a.position,
          workflowId: a.workflowId,
        })),
      };
    };

    return save({ variables: generateValues() }).then(() => {
      clearErrors();
      toast({
        title: 'Save successful',
      });
    });
  };

  const handleError: SubmitErrorHandler<TAutomationBuilderForm> = (errors) => {
    const nodes = getNodes();
    const { triggers: triggersErrors, actions: actionsErrors } = errors || {};

    const nodeErrorMap: Record<string, string> = {};

    for (const { errors, list = [] } of [
      { errors: triggersErrors, list: triggers },
      { errors: actionsErrors, list: actions },
    ]) {
      if (Array.isArray(errors)) {
        errors.forEach((err, i) => {
          if (err && list[i]?.id) {
            const nodeId = list[i].id;
            const errorKeys = Object.keys(err);
            nodeErrorMap[nodeId] =
              errorKeys.length === 1
                ? err[errorKeys[0]]?.message
                : JSON.stringify(err);
          }
        });
      }
    }

    if (Object.keys(nodeErrorMap).length > 0) {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          error: nodeErrorMap[node.id],
        },
      }));

      setNodes(updatedNodes);

      // Focus on first error node
      const firstErrorNode = updatedNodes.find((n) => nodeErrorMap[n.id]);
      if (firstErrorNode && reactFlowInstance) {
        reactFlowInstance.fitView({
          nodes: [firstErrorNode],
          duration: 800,
        });
      }
    } else {
      const errorKeys = Object.keys(errors || {});
      if (errorKeys?.length > 0) {
        const errorMessage = (errors as Record<string, { message?: string }>)[
          errorKeys[0]
        ]?.message;
        toast({
          title: 'Error',
          description: errorMessage,
        });
      }
    }
  };

  const toggleTabs = (value: 'builder' | 'history') => {
    setQueryParams({ activeTab: value });
  };

  return {
    control,
    loading,
    isOpenSideBar,
    handleSubmit,
    handleSave,
    handleError,
    activeTab,
    toggleTabs,
    toggleSideBarOpen,
  };
};
