import { AUTOMATOMATION_CONSTANTS } from '@/automations/graphql/automationQueries';
import { ConstantsQueryResponse } from '@/automations/types';
import { useQuery } from '@apollo/client';
import { useQueryState } from 'erxes-ui';
import React from 'react';

export const useAutomationNodeLibrarySidebar = () => {
  const [activeNodeTab, setNodeActiveTab] = useQueryState<'trigger' | 'action'>(
    'activeNodeTab',
  );

  const { data, loading, error, refetch } = useQuery<ConstantsQueryResponse>(
    AUTOMATOMATION_CONSTANTS,
    {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-only', // Prevent any refetch after the first
      notifyOnNetworkStatusChange: false,
    },
  );

  const { triggersConst = [], actionsConst = [] } =
    data?.automationConstants || {};

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    { type, label, description, icon, isCustom }: any,
  ) => {
    const data = {
      nodeType,
      type,
      label,
      description,
      icon,
      isCustom,
    };

    event.dataTransfer.setData(
      'application/reactflow/draggingNode',
      JSON.stringify(data),
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return {
    activeNodeTab,
    setNodeActiveTab,
    loading,
    triggersConst,
    actionsConst,
    onDragStart,
    error,
    refetch,
  };
};
