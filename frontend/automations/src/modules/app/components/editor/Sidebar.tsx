import { ApolloError, gql, useQuery } from '@apollo/client';
import { IconX } from '@tabler/icons-react';
import { useReactFlow } from '@xyflow/react';
import { Button, Card, Input, Skeleton, Tabs } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { TablerIcon } from 'erxes-ui/icons';
import { cn } from 'erxes-ui/lib';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import queries from '../../graphql/queries';
import { ConstantsQueryResponse } from '../../types';
import { ActionDetail } from './actions';
import ErrorState from './common/EmptyState';
import { TAutomationProps } from './common/formSchema';
import { useDnD } from './DnDProvider';
import { TriggerDetail } from './triggers';

const TabsContent = (
  nodeType: string,
  list: any[],
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    node: any,
  ) => void,
  searchValue: string,
) => {
  if (searchValue) {
    list = list.filter((item) => new RegExp(searchValue, 'i').test(item.label));
  }

  return list.map((item, index) => (
    <Card
      key={index}
      className="cursor-grab hover:bg-slate-50 transition-colors pb-2"
      draggable
      onDragStart={(event) => onDragStart(event, nodeType, item)}
    >
      <Card.Header className="p-3">
        <Card.Title className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center`}
            >
              <TablerIcon name={`Icon${item?.icon}` as any} />
            </div>
            <span>{item?.label}</span>
          </div>
        </Card.Title>
        <p className="text-xs text-muted-foreground mt-1">
          {item?.description}
        </p>
      </Card.Header>
    </Card>
  ));
};

const LoadingSkeleton = () => {
  const LoadingRow = () => {
    return (
      <Card className="flex flex-col  gap-2 space-x-4 border rounded-xl p-3 cursor-wait">
        <Card.Title className="flex flex-row w-full items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-2/3" />
        </Card.Title>
        <Card.Description>
          <Skeleton className="h-4 w-4/5" />
        </Card.Description>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <LoadingRow key={index} />
      ))}
    </div>
  );
};

const TabContentWrapper = (
  loading: boolean,
  error: ApolloError | undefined,
  refetch: () => void,
  { type, list, onDragStart, searchValue }: any,
) => {
  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return (
      <ErrorState
        errorCode={error.message}
        errorDetails={error.stack}
        onRetry={refetch}
      />
    );
  }
  return <div>{TabsContent(type, list, onDragStart, searchValue)}</div>;
};

const Default = () => {
  const [searchValue, setSearchValue] = useState('');

  const { data, loading, error, refetch } = useQuery<ConstantsQueryResponse>(
    gql(queries.automationConstants),
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
  return (
    <div className="w-80">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-3">Workflow Components</h3>
        <div className="relative flex items-center">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="trigger" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <Tabs.List size="sm" className="w-full">
            <Tabs.Trigger size="sm" value="trigger" className="flex-1">
              {/* <IconHandClick /> */}
              Triggers
            </Tabs.Trigger>
            <Tabs.Trigger size="sm" value="action" className="flex-1">
              {/* <IconSettingsBolt /> */}
              Actions
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {[
          { type: 'trigger', list: triggersConst },
          { type: 'action', list: actionsConst },
        ].map(({ type, list = [] }, index) => (
          <Tabs.Content
            key={index}
            value={type}
            className=" flex-1 p-4 mt-0 w-full"
          >
            <div className="space-y-2">
              {TabContentWrapper(loading, error, refetch, {
                type,
                list,
                onDragStart,
                searchValue,
              })}
            </div>
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  );
};

export default () => {
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const [activeNodeId, setActiveNode] = useQueryState('activeNodeId');
  const { getNodes } = useReactFlow();
  const isMinimized = watch('isMinimized');
  const activeNode = watch('activeNode');

  const [_, setType] = useDnD();

  useEffect(() => {
    if (!!activeNodeId && !activeNode) {
      const nodes = getNodes();
      const node = nodes.find((node) => node.id === activeNodeId);
      if (node) {
        setValue('activeNode', { ...node.data, id: node.id });
      }
    }
  }, [activeNode, activeNodeId]);

  // Filter templates based on search term and active module

  const handleClose = () => {
    setActiveNode(null);
    setValue('activeNode', null);
    setValue('isMinimized', true);
  };

  const renderSideBarContent = () => {
    // if (!activeNode) {
    //   return null;
    // }
    const { nodeType = '' } = activeNode || {};
    if (nodeType === 'trigger') {
      return <TriggerDetail activeNode={activeNode} />;
    }

    if (nodeType === 'action') {
      return <ActionDetail />;
    }

    return <Default />;
  };

  return (
    <Card
      className={cn(
        `absolute top-0 right-0 h-full  border rounded-l-lg flex flex-col  transition-transform duration-300 bg-white z-10`,
        isMinimized ? 'invisible' : 'visible',
      )}
    >
      {activeNode && (
        <Card.Header className="flex flex-row justify-between w-full">
          <div className="max-w-64">
            <Card.Title>{activeNode?.label || ''}</Card.Title>
            <Card.Description>{activeNode?.description || ''}</Card.Description>
          </div>
          <Button size="icon" variant="outline" onClick={handleClose}>
            <IconX />
          </Button>
        </Card.Header>
      )}
      <div className=" flex-1 flex flex-col min-w-80 max-w-2xl w-fit">
        {renderSideBarContent()}
      </div>
    </Card>
  );
};
