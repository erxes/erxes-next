import { AUTOMATOMATION_CONSTANTS } from '@/automations/graphql/automationQueries';
import { ConstantsQueryResponse } from '@/automations/types';
import { useQuery } from '@apollo/client';
import { useQueryState } from 'erxes-ui/hooks';
import React from 'react';

export const useSidebarDefaultContent = () => {
  const [activeNodeTab, setNodeActiveTab] = useQueryState<'trigger' | 'action'>(
    'activeNodeTab',
  );

  const { data, loading, error, refetch } = useQuery<ConstantsQueryResponse>(
    AUTOMATOMATION_CONSTANTS,
    { fetchPolicy: 'network-only' },
  );

  const { triggersConst, actionsConst } = data?.automationConstants || {};

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    { type, label, description, icon }: any,
  ) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/module', type);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.setData(
      'application/reactflow/description',
      description,
    );
    event.dataTransfer.setData('application/reactflow/icon', icon);
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
