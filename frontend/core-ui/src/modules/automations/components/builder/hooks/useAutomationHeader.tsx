import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import {
  AUTOMATION_CREATE,
  AUTOMATION_EDIT,
} from '@/automations/graphql/automationMutations';
import { NodeData } from '@/automations/types';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useMutation } from '@apollo/client';
import {
  Edge,
  EdgeProps,
  Node,
  ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react';
import { useToast } from 'erxes-ui';
import { SubmitErrorHandler, useFormContext, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';

export const useAutomationHeader = (
  reactFlowInstance: ReactFlowInstance<Node<NodeData>, Edge<EdgeProps>>,
) => {
  const { control, setValue, handleSubmit, clearErrors } =
    useFormContext<TAutomationProps>();

  const { setQueryParams } = useAutomation();

  const { getNodes, setNodes } = useReactFlow();
  const { toast } = useToast();
  const { id } = useParams();

  const [activeTab, isMinimized, detail] = useWatch({
    control,
    name: ['activeTab', 'isMinimized', 'detail'],
  });
  const {
    triggers = [],
    actions = [],
    name = '',
    status = 'draft',
  } = detail || {};

  const [save, { loading }] = useMutation(
    id ? AUTOMATION_EDIT : AUTOMATION_CREATE,
  );

  const handleSave = (values: TAutomationProps) => {
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
        title: 'Save successfull',
      });
    });
  };

  const handleError: SubmitErrorHandler<TAutomationProps> = ({
    detail: errors,
  }) => {
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
    setValue('activeTab', value);
    setQueryParams({ activeTab: value });
  };

  return {
    control,
    loading,
    isMinimized,
    handleSubmit,
    handleSave,
    handleError,
    activeTab,
    toggleTabs,
    setValue,
  };
};
