import { ErrorState } from '@/automations/utils/ErrorState';
import { ApolloError } from '@apollo/client';
import { Card, Input, Skeleton, Tabs } from 'erxes-ui';
import React, { useState } from 'react';
import { useSidebarDefaultContent } from './hooks/useSidebarDefaultContent';
import { IconSearch } from '@tabler/icons-react';

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
      className="cursor-grab hover:bg-slate-50 transition-colors mb-2"
      draggable
      onDragStart={(event) => onDragStart(event, nodeType, item)}
    >
      <Card.Header className="p-3">
        <Card.Title className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div
              className={`h-5 w-5 rounded-full flex items-center justify-center`}
            >
              <TablerIcon name={`Icon${item?.icon}` as any} />
            </div> */}
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

export const AutomationSidebarDefaultContent = () => {
  const [searchValue, setSearchValue] = useState('');
  const {
    actionsConst,
    setNodeActiveTab,
    activeNodeTab,
    triggersConst,
    loading,
    error,
    refetch,
    onDragStart,
  } = useSidebarDefaultContent();
  return (
    <div className="w-80">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-3">Workflow Components</h3>
        <div className="relative flex items-center">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue={activeNodeTab || 'trigger'}
        onValueChange={(value) =>
          setNodeActiveTab(value as 'trigger' | 'action')
        }
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-2">
          <Tabs.List size="sm" className="w-full">
            <Tabs.Trigger size="sm" value="trigger" className="flex-1">
              Triggers
            </Tabs.Trigger>
            <Tabs.Trigger size="sm" value="action" className="flex-1">
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
