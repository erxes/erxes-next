import { useAutomation } from '@/automations/context/AutomationProvider';
import { coreActionNames } from '@/automations/components/builder/nodes/actions/CoreActions';
import { useTriggersActions } from '@/automations/hooks/useTriggersActions';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import React, { useMemo } from 'react';

export const useAutomationNodeLibrarySidebar = () => {
  const { awaitingToConnectNodeId, queryParams, setQueryParams } =
    useAutomation();
  const { activeNodeTab } = queryParams || {};

  const { triggers, actions, getList } = useTriggersActions();

  const { triggersConst, actionsConst, loading, error, refetch } =
    useAutomation();

  const filteredActionsConst = useMemo(() => {
    if (!awaitingToConnectNodeId) return actionsConst;

    const [nodeType, nodeId] = awaitingToConnectNodeId.split('__') as [
      'trigger' | 'action',
      string,
    ];

    const nodeList = getList(nodeType);
    const nodeTypeValue = nodeList.find(
      (node: any) => node.id === nodeId,
    )?.type;

    const constantsMap = {
      trigger: triggersConst,
      action: actionsConst,
    };

    const connectableActionTypes =
      constantsMap[nodeType]?.find((c) => c.type === nodeTypeValue)
        ?.connectableActionTypes ?? [];

    if (!connectableActionTypes?.length) {
      return actionsConst;
    }

    return actionsConst.filter(
      (action) =>
        coreActionNames.includes(action?.type) ||
        connectableActionTypes.includes(action.type),
    );
  }, [awaitingToConnectNodeId, triggers, actions, actionsConst, triggersConst]);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: 'trigger' | 'action',
    { type, label, description, icon, isCustom }: any,
  ) => {
    const data = {
      nodeType,
      type,
      label,
      description,
      icon,
      isCustom,
      awaitingToConnectNodeId,
    };

    event.dataTransfer.setData(
      'application/reactflow/draggingNode',
      JSON.stringify(data),
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return {
    activeNodeTab: awaitingToConnectNodeId ? 'action' : activeNodeTab,
    setQueryParams,
    loading,
    triggersConst,
    actionsConst: filteredActionsConst,
    onDragStart,
    error,
    refetch,
  };
};
