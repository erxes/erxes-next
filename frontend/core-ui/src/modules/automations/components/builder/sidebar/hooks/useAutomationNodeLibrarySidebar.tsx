import { useAutomation } from '@/automations/components/builder/hooks/useAutomation';
import { coreActionNames } from '@/automations/components/builder/nodes/actions/CoreActions';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import React, { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

export const useAutomationNodeLibrarySidebar = () => {
  const { awaitingToConnectNodeId, queryParams, setQueryParams } =
    useAutomation();
  const { activeNodeTab } = queryParams || {};

  const triggers =
    useWatch<TAutomationProps>({ name: 'detail.triggers' }) ?? [];
  const actions = useWatch<TAutomationProps>({ name: 'detail.actions' }) ?? [];

  const { triggersConst, actionsConst, loading, error, refetch } =
    useAutomation();

  const filteredActionsConst = useMemo(() => {
    if (!awaitingToConnectNodeId) return actionsConst;

    const [nodeType, nodeId] = awaitingToConnectNodeId.split('__') as [
      'trigger' | 'action',
      string,
    ];

    const nodeList = nodeType === 'trigger' ? triggers : actions;
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
